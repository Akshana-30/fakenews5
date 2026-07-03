"use server";

import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";

export async function generateResponse(prompt: string) {
    const { output } = await generateText({ model: google("gemini-2.5-flash"), prompt });
    return output;
}
