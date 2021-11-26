const {config} = require("../utils/bot");
const fn = require('../utils/functions')
const googleTranslate = require('../actions/googleTranslate');

let languages = []
for (const key in config['languages']) {
    languages.push(config['languages'][key])
}

module.exports = async function (message) {
    const msgText = message.content.trim().toLowerCase()
    if (!msgText) return null
    if (!message.reference) return null
    if (msgText.length > 3) return null

    const targetLang = await fn.lang3(msgText)
    if (!targetLang) return null

    const intendMessage = await message.channel.messages.fetch(message.reference.messageId)
    const intendText = intendMessage.content.trim()
    const translation = await googleTranslate(intendText, targetLang);

    if (translation) {
        await message.reply(`🟢\n${intendText}\n👇🏻👇🏻\n\n${translation}`)
    } else {
        await message.reply(`🔴 No result... text:\n\n${intendText}`)
    }

    return true
}
