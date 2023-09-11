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

const { getConversation, saveConversation } = require('./conversation.js');
const { getEmbedding } = require('./embedder.js'); // Import getEmbedding function
const findClosestDocument = require('./vectorQuery.js');

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return; //prevent infitie loop

        // Get embedding for the message content
        const query_vector = await getEmbedding(message.content);
        // Find the closest document based on the query_vector
        const closest_document_text = await findClosestDocument(query_vector);


        const mongoose = await connectDB('test');

        let conversation = await getConversation(mongoose, message.author.id);

        const systemMessage = { role: 'system', content: closest_document_text };

        const completion = await openai.chat.completions.create({
            messages: conversation.messages.concat([systemMessage, { role: 'user', content: message.content }]),
            model: 'gpt-3.5-turbo',
        });

        // Save conversation history
        conversation.messages.push({ role: 'user', content: message.content });
        conversation.messages.push({ role: 'assistant', content: completion.choices[0].message.content });
        await saveConversation(mongoose, conversation);
        mongoose.connection.close();

        console.log(message.content);
        console.log(completion.choices);
        message.reply(`${completion.choices[0].message.content}`)

    } catch (error) {
        console.log(error);
    }
})

client.login(discordKey);