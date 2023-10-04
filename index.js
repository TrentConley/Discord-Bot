require('dotenv').config();
const openAIKey = process.env['OpenAPIKey']
const discordKey = process.env['DiscordKey']
const connectDB = require('./db.js');


const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})


const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: openAIKey, // defaults to process.env["OPENAI_API_KEY"]
});

// const { getConversation, saveConversation } = require('./conversation.js');
const { getEmbedding } = require('./embedder.js'); // Import getEmbedding function
// const findClosestDocument = require('./vectorQuery.js');
const { findClosestDocument, fetchConversation, saveConversation } = require('./dbOperations');
const mongoose = require('mongoose');

client.on('messageCreate', async (message) => {
    try {

        if (message.author.bot) return//prevent infinite loop
        const query_vector = await getEmbedding(message.content);

        // Fetch closest document
        const closestDoc = await findClosestDocument(query_vector);
        console.log("Closest Document:", closestDoc);

        // Fetch conversation

        const conversation = await fetchConversation(message.author.id);
        console.log("Fetched Conversation:", conversation);

        const systemMessage = { role: 'system', content: closestDoc };
        const SystemPrompt = { role: 'system', content: process.env['SystemPrompt'] };


        // Ensure messages array is initialized
        if (!conversation.messages) {
            conversation.messages = [];
        }
        const messages = conversation.messages.concat([systemMessage, { role: 'user', content: message.content }, SystemPrompt]);
        messages.forEach(message => {
            console.log(message);
        });

        console.log(`Messages are ${messages}`);
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'ft:gpt-3.5-turbo-0613:personal:chatner-bot:85giWnHG',
        });

        // Save conversation history
        conversation.messages.push({ role: 'user', content: message.content });
        conversation.messages.push({ role: 'assistant', content: completion.choices[0].message.content });
        await saveConversation(conversation);
        message.reply(`${completion.choices[0].message.content}`)
    } catch (error) {
        console.log(error);
    }
})

client.login(discordKey);
