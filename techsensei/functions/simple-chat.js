const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline');

// Configuration
const API_KEY = process.env.GOOGLE_AI_API_KEY || "AIzaSyCPFwK_F698N_Uh1ch1vUKnvBMZYJ43D24";
const MODEL_NAME = "gemini-2.0-flash-lite-001";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const chat = model.startChat({
    history: [],
    generationConfig: {
        maxOutputTokens: 1000,
    },
});

console.log("-----------------------------------------");
console.log(" TechSensei CLI Chatbot");
console.log("-----------------------------------------");
console.log(`Model: ${MODEL_NAME}`);
console.log("Type 'exit' or 'quit' to stop.");
console.log("-----------------------------------------");

async function sendMessageWithRetry(msg, retries = 3) {
    try {
        process.stdout.write('AI: Thinking...');
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();

        // Clear "Thinking..." line
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        console.log(`AI: ${text.trim()}\n`);
    } catch (error) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        if (error.status === 429 || error.message.includes('429') || error.message.includes('Too Many Requests')) {
            console.log("Rate limit hit. Waiting 10 seconds before retrying...");
            await new Promise(resolve => setTimeout(resolve, 10000));
            return sendMessageWithRetry(msg, retries - 1);
        }

        console.error(`Error: ${error.message}\n`);
    }
}

async function askQuestion() {
    rl.question('You: ', async (msg) => {
        if (msg.toLowerCase() === 'exit' || msg.toLowerCase() === 'quit') {
            console.log('Goodbye!');
            rl.close();
            return;
        }

        await sendMessageWithRetry(msg);

        askQuestion();
    });
}

askQuestion();
