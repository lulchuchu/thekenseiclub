import {
    type ActionExample,
    composeContext,
    elizaLogger,
    generateObject,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
} from "@elizaos/core";
import { z } from "zod";
import { topicsProvider } from "../providers/topics";
import { getInferenceTemplate } from "../templates";
import { AlloraAPIClient, type ChainSlug } from "@alloralabs/allora-sdk";

interface InferenceFields {
    topicId: number | null;
    topicName: string | null;
}

export const getInferenceAction: Action = {
    name: "GET_INFERENCE",
    similes: [
        "GET_ALLORA_INFERENCE",
        "GET_TOPIC_INFERENCE",
        "ALLORA_INFERENCE",
        "TOPIC_INFERENCE",
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Get inference from Allora Network",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ): Promise<boolean> => {
        // Initialize or update state
        let currentState = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        // Get Allora topics information from the provider
        currentState.alloraTopics = await topicsProvider.get(
            runtime,
            message,
            currentState
        );

        // Compose context for extracting the inference fields
        const inferenceTopicContext = composeContext({
            state: currentState,
            template: getInferenceTemplate,
        });

        // Define the schema for extracting the inference fields
        const schema = z.object({
            topicId: z.number().nullable(),
            topicName: z.string().nullable(),
        });

        const results = await generateObject({
            runtime,
            context: inferenceTopicContext,
            modelClass: ModelClass.SMALL,
            schema,
        });
        const inferenceFields = results.object as InferenceFields;

        if (!inferenceFields.topicId || !inferenceFields.topicName) {
            callback({
                text: "There is no active Allora Network topic that matches your request.",
            });
            return false;
        }

        elizaLogger.info(
            `Retrieving inference for topic ID: ${inferenceFields.topicId}`
        );

        try {
            // Get inference from Allora API
            const alloraApiClient = new AlloraAPIClient({
                chainSlug: runtime.getSetting("ALLORA_CHAIN_SLUG") as ChainSlug,
                apiKey: runtime.getSetting("ALLORA_API_KEY") as string,
            });

            const inferenceRes = await alloraApiClient.getInferenceByTopicID(
                inferenceFields.topicId
            );
            const inferenceValue =
                inferenceRes.inference_data.network_inference_normalized;

            callback({
                text: `It will be ${inferenceValue}. (Prediction provided by Allora Network)`,
                user: "Sage",
            });
            return true;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            const displayMessage = `There was an error fetching the inference from Allora Network: ${errorMessage}`;

            elizaLogger.error(displayMessage);
            callback({
                text: displayMessage,
                user: "Sage",
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the predicted ETH price in 5 minutes?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the inference now...",
                    action: "GET_INFERENCE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Inference provided by Allora Network on topic ETH 5min (ID: 13): 3393.364326646801085508",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the predicted price of gold in 24 hours?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the inference now...",
                    action: "GET_INFERENCE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "There is no active Allora Network topic that matches your request.",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
