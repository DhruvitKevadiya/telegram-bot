import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

// Token from @BotFather, hardcoded so no .env file is needed.
const token = '8850656713:AAHWiWeT3kqqyk00vN5UHJxO32HfZVrc1ew'

// A fresh bot per attempt: a Telegraf instance whose launch failed
// cannot be reliably relaunched, so we rebuild it on each retry.
function createBot() {
  const bot = new Telegraf(token)

  bot.start((ctx) => ctx.reply('Send me anything and I will send it right back.'))

  // Text messages: reply with exactly the same text.
  bot.on(message('text'), (ctx) => ctx.reply(ctx.message.text))

  // Anything else (photo, sticker, voice, document, ...): send an identical copy back.
  bot.on('message', (ctx) => ctx.copyMessage(ctx.chat.id))

  bot.catch((err, ctx) => {
    console.error(`Failed to handle update ${ctx.update.update_id}:`, err)
  })

  return bot
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Telegram allows one getUpdates connection per bot and holds it open for up to
// 50s. After a restart the previous connection can still be alive, so a 409 here
// is usually temporary - wait it out instead of dying and being restarted into
// the same conflict.
async function start() {
  const RETRY_DELAY_MS = 15_000
  const MAX_ATTEMPTS = 10

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const bot = createBot()

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

    try {
      // Clears any leftover webhook and discards the backlog queued while down.
      await bot.telegram.deleteWebhook({ drop_pending_updates: true })

      console.log('Bot is starting... press Ctrl+C to stop.')
      await bot.launch({ dropPendingUpdates: true })
      return
    } catch (err) {
      if (err?.response?.error_code === 409 && attempt < MAX_ATTEMPTS) {
        const waited = attempt * RETRY_DELAY_MS
        console.warn(
          `409 Conflict (attempt ${attempt}/${MAX_ATTEMPTS}): a previous connection is still open. ` +
            `Retrying in ${RETRY_DELAY_MS / 1000}s (waited ${waited / 1000}s so far)...`
        )
        await sleep(RETRY_DELAY_MS)
        continue
      }

      if (err?.response?.error_code === 401) {
        console.error('Telegram rejected the token (401 Unauthorized).')
        console.error('Check that the token in bot.js matches what @BotFather gave you.')
        process.exit(1)
      }

      throw err
    }
  }

  console.error(`Still conflicting after ${MAX_ATTEMPTS} attempts.`)
  console.error('Another copy of this bot is running somewhere - check for a second Railway service or a local run.')
  process.exit(1)
}

start().catch((err) => {
  console.error('Bot failed to start:', err)
  process.exit(1)
})
