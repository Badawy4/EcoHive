import { config } from 'dotenv';
import OpenAI from 'openai';
import readline from 'readline';

// Load environment variables from a .env file
config();

console.log("API Key:", process.env.API_KEY); // Debugging

// Create an instance of the OpenAI API client with your API key
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Initialize conversation history
let conversationHistory = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function chat() {
    rl.question('You: ', async (input) => {
        // Add user's message to conversation history
        conversationHistory.push({ role: "user", content: input });

        try {
            // Send the conversation history to the API
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
                max_tokens: 150,
            });

            // Get the assistant's response
            const reply = response.choices[0].message.content;

            // Print the assistant's response
            console.log(`ChatGPT: ${reply}`);

            // Add assistant's response to conversation history
            conversationHistory.push({ role: "assistant", content: reply });

            // Continue the chat
            chat();
        } catch (error) {
            console.error('Error:', error);
            rl.close();
        }
    });
}

// Start the chat
chat();
