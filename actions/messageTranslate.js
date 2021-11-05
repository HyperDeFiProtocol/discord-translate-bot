const {config} = require("../utils/bot");
const fn = require('../utils/functions')
const googleTranslate = require('../actions/googleTranslate');

let languages = []
for (const key in config['languages']) {
    languages.push(config['languages'][key])
}

const replyTranslateHelp = async function (message) {
    await message.reply('🟡 `!translate <language code>`\n\n' +
        `**<language code>** could be one of these:\n${languages.join(', ')}`)
}

module.exports = async function (message) {
    const msgText = message.content.trim().toLowerCase()

    if (message.reference) {
        const commandOptions = msgText.replace(/\s{2,}/, ' ').split(' ')

        if (commandOptions.length < 2) {
            await replyTranslateHelp(message)
            return
        }

        const targetLang = await fn.lang3(commandOptions[1])
        if (!targetLang) {
            await replyTranslateHelp(message)
            return
        }

        const intendMessage = await message.channel.messages.fetch(message.reference.messageId)
        const intendText = intendMessage.content.trim()
        const translation = await googleTranslate(intendText, targetLang);

        if (translation) {
            await message.reply(`🟢\n${intendText}\n👇🏻👇🏻\n\n${translation}`)
        } else {
            await message.reply(`🔴 No result... text:\n\n${intendText}`)
        }
    } else {
        await message.reply('🔴 `!translate <language code>` must be a reply of a message...')
    }
}
