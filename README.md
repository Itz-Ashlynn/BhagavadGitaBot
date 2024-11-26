# Bhagavad Gita Cloudflare Bot Code

This repository contains code to deploy a Telegram bot on Cloudflare Workers that provides Bhagavad Gita Sloks, chapter summaries, and more using the `worker.js`.

## Prerequisites
- A Telegram bot token from [@BotFather](https://core.telegram.org/bots#botfather).
- A Cloudflare account with Workers enabled.

## Configuration

1. **Set up your Telegram bot**:
   - Obtain your bot token from [@BotFather](https://core.telegram.org/bots#botfather).
   - Set the `TOKEN` variable in `worker.js` with your bot's token.

2. **Bhagavad Gita API Usage**:
   - The bot uses the [Vedic Scriptures API](https://vedicscriptures.github.io) for fetching Sloks and chapter summaries.
   - No additional API key is required; all data is publicly available and is used to enhance the bot's functionality.

## Deployment Steps

1. **Go to the Cloudflare Dashboard**:
   - Navigate to Workers and create a new Worker.

2. **Add the Code**:
   - Copy the code from `worker.js` and paste it into the Worker editor.

3. **Deploy the Worker**:
   - Save and deploy the Worker. Cloudflare will assign a unique URL to your Worker.

4. **Webhook Registration**:
   - Register the Telegram bot webhook by accessing the `/registerWebhook` endpoint. Example:
     ```
     https://your-worker-url/registerWebhook
     ```
   - To remove the webhook, access the `/unRegisterWebhook` endpoint:
     ```
     https://your-worker-url/unRegisterWebhook
     ```

## Endpoints

- `/endpoint`: Main webhook endpoint for handling Telegram updates.
- `/registerWebhook`: Registers the bot's webhook with Telegram.
- `/unRegisterWebhook`: Unregisters the bot's webhook.

## Features
- Fetch random Sloks from the Bhagavad Gita.
- Retrieve specific Sloks by chapter and verse.
- Get chapter summaries from the Bhagavad Gita.
- Seamlessly handles Telegram commands and user interactions.

## Credits
This bot uses the Bhagavad Gita API provided by [Vedic Scriptures](https://vedicscriptures.github.io) for content and translations.  
Developed by [Ashlynn Repository](https://t.me/Ashlynn_Repository).  

If you find this project useful, please ⭐ the repository on GitHub! Contributions and forks are welcome to further improve and customize this bot.
