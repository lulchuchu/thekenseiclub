import api from "@/lib/api";

interface TokenAIGeneratedDetails {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  imageBase64?: string;
  image_description?: string;
  gatewayUrl?: string;
}

export const useTokenGeneratingService = () => {
  const generateImageFromPrompt = async (
    prompt: string,
    userId?: string
  ): Promise<{
    imageUrl: string;
    imageBase64: string;
    gatewayUrl?: string;
  }> => {
    if (!prompt.trim()) {
      throw new Error("Prompt is required");
    }
    try {
      const response = await fetch("/api/openai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      const imageBase64 = data.imageBase64;

      // For browser context, create a blob URL
      if (typeof window !== "undefined") {
        // Convert base64 to binary
        const byteCharacters = atob(imageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });
        const file = new File([blob], "ai-generated.png", {
          type: "image/png",
        });

        // Create a URL for browser preview
        const imageUrl = URL.createObjectURL(file);

        // Upload the generated image to the API
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "coin");

          if (userId) {
            formData.append("userId", userId);
          }

          const uploadResponse = await api.post("/images", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (
            uploadResponse.data &&
            uploadResponse.data.image &&
            uploadResponse.data.image.gatewayUrl
          ) {
            // Return both the local preview URL and the IPFS gateway URL
            return {
              imageUrl,
              imageBase64,
              gatewayUrl: uploadResponse.data.image.gatewayUrl,
            };
          }
        } catch (uploadError) {
          console.error("Error uploading generated image to API:", uploadError);
          // Fall back to returning just the local URL if upload fails
        }

        return { imageUrl, imageBase64 };
      }

      // For server context, just return the base64 data
      return {
        imageUrl: `data:image/png;base64,${imageBase64}`,
        imageBase64,
      };
    } catch (error) {
      console.error("Error generating image with OpenAI:", error);
      throw new Error("Failed to generate image");
    }
  };

  const generateTokenWithAI = async (
    input: string,
    userId?: string
  ): Promise<TokenAIGeneratedDetails> => {
    try {
      // Call our secure API to generate token concept
      const conceptResponse = await fetch("/api/openai/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!conceptResponse.ok) {
        const errorData = await conceptResponse.json();
        throw new Error(errorData.error || "Failed to generate token concept");
      }

      const response = await conceptResponse.json();

      if (!response.image_description) {
        throw new Error("No image description generated");
      }

      // Generate image using the description and pass userId for upload
      const { imageUrl, imageBase64, gatewayUrl } =
        await generateImageFromPrompt(response.image_description, userId);

      return {
        ...response,
        imageUrl: gatewayUrl || imageUrl, // Prefer the gateway URL if available
        imageBase64,
        gatewayUrl,
      };
    } catch (error) {
      console.error("Error in generateTokenWithAI:", error);
      throw new Error("Failed to generate token details");
    }
  };

  return {
    generateTokenWithAI,
    generateImageFromPrompt,
  };
};
