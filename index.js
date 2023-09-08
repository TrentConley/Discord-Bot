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

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return; //prevent infitie loop
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message.content }],
            model: 'gpt-3.5-turbo',
          });
        console.log(message.content);
        console.log(completion.choices);
        message.reply(`${completion.choices[0].message.content}`)
        
    } catch (error) {
        console.log(error);
    }
})

client.login(discordKey);