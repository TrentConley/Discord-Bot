# Prime Protocol Discord Bot

This is a Discord bot for the company Prime Protocol. It uses OpenAI's GPT-3 model to interact with users and provide assistance.

## Setup

1. Install dependencies with `npm install`.
2. Set up your environment variables in a `.env` file. You will need:
    - `OpenAPIKey`: Your OpenAI API key.
    - `DiscordKey`: Your Discord bot token.
    - `SystemPrompt`: The system prompt for the bot.
3. Run the bot with `node index.js`.

## Features

- **Message Embedding**: The bot uses OpenAI's text embedding model to understand user messages.
- **Conversation Fetching**: The bot fetches the conversation history for each user.
- **Message Generation**: The bot generates responses using OpenAI's GPT-3 model.

## Code Overview

- `index.js`: The main entry point for the bot. It sets up the Discord client and handles incoming messages.
- `db.js`: Connects to the MongoDB database.
- `embedder.js`: Contains the `getEmbedding` function, which gets the text embedding for a given message.
- `dbOperations.js`: Contains functions for interacting with the database, such as `findClosestDocument`, `fetchConversation`, and `saveConversation`.

## TODO

- **Cross-Chain Borrowing**: Integrate with various blockchains to allow users to borrow across chains.
- **Portfolio Backing**: Allow users to back their loans with their entire portfolio of cross-chain assets.
- **Decentralized Finance**: Break down the silos between blockchains and create one of the first cross-chain xApps.

