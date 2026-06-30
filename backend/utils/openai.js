import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const getGeminiApiResponse = async (message) => {
    try {
        const chat = await ai.chats.create({
            model: "gemini-2.5-flash"
        });

        const response = await chat.sendMessage({
            message
        });

        return response.text;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default getGeminiApiResponse;