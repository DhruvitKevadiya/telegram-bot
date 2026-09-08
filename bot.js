import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const token = process.env.BOT_TOKEN

if (!token) {
  console.error('BOT_TOKEN is missing.')
  console.error('Copy .env.example to .env and paste the token @BotFather gave you.')
  process.exit(1)
}

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
    console.error('Check that BOT_TOKEN in .env matches what @BotFather gave you.')
  } else {
    console.error('Bot failed to start:', err)
  }
  process.exit(1)
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
