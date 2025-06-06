"use client";

import { VoteNotification } from "@/app/components/ui/vote-notification";
import { useTokenGeneratingService } from "@/services/TokenGeneratingService";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import ImageUpload from "./image-upload";

interface ManualInputFormProps {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  imagePreview: string | null;
  isGeneratingImage: boolean;
  isCreatingToken: boolean;
  error?: string;
  onTokenNameChange: (value: string) => void;
  onTokenSymbolChange: (value: string) => void;
  onTokenDescriptionChange: (value: string) => void;
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
  onGenerateImage: () => void;
  onSubmit: (data: any) => void;
}

export default function ManualInputForm({
  tokenName,
  tokenSymbol,
  tokenDescription,
  imagePreview,
  isGeneratingImage,
  isCreatingToken,
  error,
  onTokenNameChange,
  onTokenSymbolChange,
  onTokenDescriptionChange,
  onImageUpload,
  onImageClear,
  onGenerateImage,
  onSubmit,
}: ManualInputFormProps) {
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const tokenGeneratingService = useTokenGeneratingService();
  const currentAccount = useCurrentAccount();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const validateAndSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!tokenName.trim()) {
      onSubmit({ error: "Token name is required" });
      return;
    }

    if (!tokenSymbol.trim()) {
      onSubmit({ error: "Token symbol is required" });
      return;
    }

    if (!imagePreview) {
      onSubmit({ error: "Token image is required" });
      return;
    }

    if (!tokenDescription.trim()) {
      onSubmit({ error: "Token description is required" });
      return;
    }

    // All validations passed, show confirmation dialog
    if (
      window.confirm(
        `Are you sure you want to create ${tokenName} (${tokenSymbol}) token?`
      )
    ) {
      try {
        // Prepare form data for submission
        const formData = {
          name: tokenName,
          symbol: tokenSymbol,
          description: tokenDescription,
        };

        // Call the onSubmit function with the form data
        onSubmit(formData);
      } catch (error) {
        console.error("Error creating token:", error);
        onSubmit({ error: "An unexpected error occurred" });
      }
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setNotificationMessage("Please enter a description for your image");
      setShowNotification(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Generate image using the token generation service
      const result = await tokenGeneratingService.generateImageFromPrompt(
        imagePrompt,
        currentAccount?.address // Pass user ID for attribution
      );

      // Update the UI with the generated image
      setGeneratedImageUrl(result.imageUrl);

      // Update the parent's imagePreview with the local URL
      if (typeof onImageClear === "function") {
        onImageClear();
      }

      if (
        typeof onTokenNameChange === "function" &&
        typeof window !== "undefined"
      ) {
        // Set the imagePreview in the parent component without triggering another upload
        window.setTimeout(() => {
          // Use a custom event to pass data between components
          const event = new CustomEvent("setImagePreview", {
            detail: {
              previewUrl: result.imageUrl,
              gatewayUrl: result.gatewayUrl,
            },
          });
          window.dispatchEvent(event);
        }, 0);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setNotificationMessage("Failed to generate image. Please try again.");
      setShowNotification(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={validateAndSubmitForm} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Token Image and Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Token Image
          </label>
          <div className="grid grid-cols-2 gap-6">
            <ImageUpload
              previewUrl={imagePreview || generatedImageUrl}
              onImageSelect={onImageUpload}
              onClear={onImageClear}
            />
            <div className="space-y-4">
              {/* AI Generation */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Or generate with AI</p>
                <div className="flex flex-col gap-2">
                  <textarea
                    placeholder="Describe the image you want"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[170px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0039C6]"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-[#0039C6] text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 w-full hover:bg-opacity-90 transition-colors"
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !imagePrompt.trim()}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <>
                        Generate
                        <Sparkles size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Token Name */}
              <div>
                <label
                  htmlFor="token-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Token Name
                </label>
                <input
                  type="text"
                  id="token-name"
                  name="name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0039C6]"
                  placeholder="e.g. Pepe Coin"
                  value={tokenName}
                  onChange={(e) => onTokenNameChange(e.target.value)}
                  required
                />
              </div>

              {/* Token Symbol */}
              <div>
                <label
                  htmlFor="token-symbol"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Token Symbol
                </label>
                <input
                  type="text"
                  id="token-symbol"
                  name="symbol"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0039C6]"
                  placeholder="e.g. PEPE (2-6 characters)"
                  value={tokenSymbol}
                  onChange={(e) =>
                    onTokenSymbolChange(
                      e.target.value.toUpperCase().slice(0, 6)
                    )
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Token Description */}
        <div>
          <label
            htmlFor="token-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Token Description
          </label>
          <textarea
            id="token-description"
            name="description"
            rows={4}
            className="w-full rounded-xl border-2 border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#0039C6]"
            placeholder="Describe your token, its purpose, and community"
            value={tokenDescription}
            onChange={(e) => onTokenDescriptionChange(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0039C6] text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !tokenName ||
            !tokenSymbol ||
            !tokenDescription ||
            !imagePreview ||
            isCreatingToken
          }
        >
          {isCreatingToken ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Creating Your Token...</span>
            </div>
          ) : (
            "Create Token"
          )}
        </button>
      </form>
      <VoteNotification
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
      />
    </motion.div>
  );
}
