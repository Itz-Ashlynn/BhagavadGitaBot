const TOKEN = '';
const WEBHOOK = '/endpoint';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}/`;
// Hare Krishna! 🙏
addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname === WEBHOOK) {
        event.respondWith(handleWebhook(event));
    } else if (url.pathname === '/registerWebhook') {
        event.respondWith(registerWebhook(event, url, WEBHOOK));
    } else if (url.pathname === '/unRegisterWebhook') {
        event.respondWith(unRegisterWebhook(event));
    } else {
        event.respondWith(new Response('No handler for this request'));
    }
});

// Hare Krishna! 🙏
async function handleWebhook(event) {
    const update = await event.request.json();
    event.waitUntil(onUpdate(update));
    return new Response('Ok');
}

// Hare Krishna! 🙏
async function onUpdate(update) {
    if (update.message) {
        await onMessage(update.message);
    }
}

// Hare Krishna! 🙏
async function onMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    if (!text) {
        await sendPlainText(chatId, "Unsupported input type. Please send a valid command. Use /help to see available commands.");
        return;
    }

    if (text === '/start') {
        await sendStartMessage(chatId);
    } else if (text === '/help') {
        await sendHelpMessage(chatId);
    } else if (text === '/about') {
        await sendAboutMessage(chatId);
    } else if (text.startsWith('/randomSlok')) {
        const responseMessage = await fetchRandomSlok();
        await sendPlainText(chatId, responseMessage);
    } else if (text.startsWith('/getSlok')) {
        const args = text.split(' ').slice(1);
        if (args.length === 0) {
            await sendPlainText(chatId, "Usage: /getSlok [chapter] [verse]\nExample: /getSlok 2 47");
        } else {
            const chapter = args[0];
            const verse = args[1];
            const responseMessage = await fetchSpecificSlok(chapter, verse);
            await sendPlainText(chatId, responseMessage);
        }
    } else if (text.startsWith('/chapters')) {
        await sendChapters(chatId);
    } else {
        await sendPlainText(chatId, "Unknown command. Use /help to see the available commands.");
    }
}

// Hare Krishna! 🙏
async function sendStartMessage(chatId) {
    const text = "Hare Krishna! 🙏\nI'm your Bhagavad Gita Slok bot. Use /help to see available commands.";
    await sendPlainText(chatId, text);
}

// Hare Krishna! 🙏
async function sendHelpMessage(chatId) {
    const text = `🛠️ *Commands List*:\n
/start - Welcome message\n
/help - List of commands\n
/about - About the bot\n
/randomSlok - Get a random Slok from the Bhagavad Gita\n
/getSlok [chapter] [verse] - Get a specific Slok\n
/chapters - Get a summary of all chapters one by one\n
Example: /getSlok 2 47\n\nHare Krishna! 🙏`;
    await sendPlainText(chatId, text);
}

// Hare Krishna! 🙏
async function sendAboutMessage(chatId) {
    const text = "I'm a bot dedicated to sharing the wisdom of the Bhagavad Gita. Developed with love. 🙌";
    await sendPlainText(chatId, text);
}

// Hare Krishna! 🙏
async function fetchRandomSlok() {
    const bgBaseUrl = "https://vedicscriptures.github.io";
    const slokId = gitaslokid();
    const response = await fetch(`${bgBaseUrl}/slok/${slokId}`, { redirect: 'follow' });
    const slok = await response.json();
    return prepareSlokToSend(slok);
}

// Hare Krishna! 🙏
async function fetchSpecificSlok(chapter, verse) {
    const bgBaseUrl = "https://vedicscriptures.github.io";
    const response = await fetch(`${bgBaseUrl}/slok/${chapter}/${verse}`, { redirect: 'follow' });
    if (!response.ok) {
        return "Could not fetch the requested Slok. Please check the chapter and verse numbers.";
    }
    const slok = await response.json();
    return prepareSlokToSend(slok);
}

// Hare Krishna! 🙏
function gitaslokid() {
    const slokCounts = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];
    const chapter = Math.floor(Math.random() * slokCounts.length) + 1;
    const verse = Math.floor(Math.random() * slokCounts[chapter - 1]) + 1;
    return `${chapter}/${verse}`;
}

// Hare Krishna! 🙏
function prepareSlokToSend(slok) {
    return `Here is the Bhagavad Gita Slok you requested:\n
*Chapter*: ${slok.chapter}\n
*Verse*: ${slok.verse}\n\n
Slok (Sanskrit):\n${slok.slok}\n\n
*Hindi Translation*: ${slok.tej.ht}\n
*English Translation*: ${slok.gambir.et}\n\n
Hare Krishna! 🙏`;
}

// Hare Krishna! 🙏
async function sendChapters(chatId) {
    const chaptersApiUrl = "https://vedicscriptures.github.io/chapters/";
    const response = await fetch(chaptersApiUrl);
    if (!response.ok) {
        await sendPlainText(chatId, "Unable to fetch chapters at the moment. Please try again later.");
        return;
    }

    const chapters = await response.json();
    for (const chapter of chapters) {
        const chapterMessage = `*Chapter ${chapter.chapter_number}: ${chapter.name}*\n
Transliteration: ${chapter.transliteration}\n
Translation: ${chapter.translation}\n
Meaning: ${chapter.meaning.en}\n
Summary: ${chapter.summary.en}\n\n
Hare Krishna! 🙏`;

        await sendPlainText(chatId, chapterMessage);
    }
}

// Hare Krishna! 🙏
async function sendPlainText(chatId, text) {
    const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
    };
    await fetch(`${TELEGRAM_API_URL}sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

// Hare Krishna! 🙏
async function registerWebhook(event, requestUrl, suffix) {
    const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`;
    const response = await fetch(`${TELEGRAM_API_URL}setWebhook?url=${webhookUrl}`);
    const data = await response.json();
    return new Response(data.ok ? 'Webhook registered successfully' : JSON.stringify(data, null, 2));
}

// Hare Krishna! 🙏
async function unRegisterWebhook(event) {
    const response = await fetch(`${TELEGRAM_API_URL}setWebhook?url=`);
    const data = await response.json();
    return new Response(data.ok ? 'Webhook removed successfully' : JSON.stringify(data, null, 2));
}
// Hare Krishna! 🙏
