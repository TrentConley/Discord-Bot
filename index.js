require('dotenv').config();
const openAIKey = process.env['OpenAPIKey']
const discordKey = process.env['DiscordKey']
const { getEmbedding } = require('./embedder'); // Import getEmbedding function


const {Client, GatewayIntentBits} = require('discord.js');
const client  = new Client({
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

const { getConversation, saveConversation, findClosestDocument } = require('./db');

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return; //prevent infitie loop

        // Get embedding for the message content
        const query_vector = await getEmbedding(message.content);

        // Find the closest document based on the query_vector
        const closest_document = await findClosestDocument(query_vector);
        console.log(closest_document);
        

        // Retrieve conversation history
        let conversation = await getConversation(message.author.id);

        const completion = await openai.chat.completions.create({
            messages: conversation.messages.concat([{ role: 'user', content: message.content }]),
            model: 'gpt-3.5-turbo',
        });

        // Save conversation history
        conversation.messages.push({role: 'user', content: message.content});
        conversation.messages.push({ role: 'assistant', content: completion.choices[0].message.content });
        await saveConversation(conversation);

        console.log(message.content);
        console.log(completion.choices);
        message.reply(`${completion.choices[0].message.content}`)
        
    } catch (error) {
        console.log(error);
    }
})

client.login(discordKey);