const {SlashCommandBuilder} = require('@discordjs/builders')
const {config} = require('../utils/bot')
const fn = require('../utils/functions')
const googleTranslate = require('../actions/googleTranslate')


let languages = []
for (const key in config['languages']) {
    languages.push(config['languages'][key])
}



const execute = async function (interaction) {
    const language = interaction.options.getString('language').trim()
    const text = interaction.options.getString('text').trim()
    if (!text) {
        return interaction.editReply('🔴\nEmpty message...')
    }

    // franc
    const franc = await fn.importFranc()

    // intend and target
    const intendLang = franc(text)
    const targetLang = await fn.lang3(language)

    if (!targetLang) {
        return interaction.editReply(`🔴\nTarget language (${language}) not supported... text:\n\n${text}`)
    }

    // no need to translate
    if (intendLang === targetLang) {
        return interaction.editReply(`🟡 Same language... text:\n\n${text}`)
    }

    const translation = await googleTranslate(text, targetLang)
    if (translation) {
        return interaction.editReply(`🟢\n${text}\n👇🏻👇🏻\n\n${translation}`)
    } else {
        return interaction.editReply(`🔴 No result... text:\n\n${text}`)
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Replies with translation')
        .addStringOption(option => option.setName('language').setRequired(true).setDescription(languages.join(', ')))
        .addStringOption(option => option.setName('text').setRequired(true).setDescription('source text')),
    execute
}
