import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

// Token from @BotFather, hardcoded so no .env file is needed.
const token = '8850656713:AAGYuIX3b9CYEe9LxbijDl2jvaemnsRV2ds'

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply('Send me anything and I will send it right back.'))

// Text messages: reply with exactly the same text.
bot.on(message('text'), (ctx) => ctx.reply(ctx.message.text))

// Anything else (photo, sticker, voice, document, ...): send an identical copy back.
bot.on('message', (ctx) => ctx.copyMessage(ctx.chat.id))

bot.catch((err, ctx) => {
  console.error(`Failed to handle update ${ctx.update.update_id}:`, err)
})

console.log('Bot is starting... press Ctrl+C to stop.')

bot.launch().catch((err) => {
  if (err?.response?.error_code === 401) {
    console.error('Telegram rejected the token (401 Unauthorized).')
    console.error('Check that the token in bot.js matches what @BotFather gave you.')
  } else {
    console.error('Bot failed to start:', err)
  }
  process.exit(1)
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
