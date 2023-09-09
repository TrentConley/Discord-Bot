require('dotenv').config();
const openAIKey = process.env['OpenAPIKey']
const discordKey = process.env['DiscordKey']
const openAIOrg = process.env['OpenAIOrg']

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

const { getConversation, saveConversation } = require('./db');

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return; //prevent infitie loop

        // Retrieve conversation history
        let conversation = await getConversation(message.author.id);

        console.log(`before error`);
        console.log(conversation);
        const completion = await openai.chat.completions.create({
            messages: conversation.messages.concat([{ role: 'user', content: message.content }]),
            model: 'gpt-3.5-turbo',
        });
        console.log(`after error`);

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