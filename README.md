# Telegram Echo Bot

A Telegram bot that replies with whatever you send it.

## Setup

### 1. Create the bot and get a token

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Pick a display name, then a username ending in `bot` (e.g. `my_echo_bot`)
4. BotFather replies with a token that looks like `123456789:AAE...`

### 2. Add the token to this project

Copy `.env.example` to `.env` and paste your token in:

```
BOT_TOKEN=123456789:AAEyourRealTokenHere
```

### 3. Install and run

```
npm install
npm start
```

You should see `Bot is starting...`. Now open your bot in Telegram, press **Start**,
and send it a message — it will send the same thing back.

Stop the bot with `Ctrl+C`.

## What it does

- `/start` — sends a short greeting
- Any text message — replies with the exact same text
- Photos, stickers, voice notes, documents — sends an identical copy back

## Files

- `bot.js` — the whole bot, about 30 lines
- `.env` — your bot token (never commit this; `.gitignore` excludes it)
