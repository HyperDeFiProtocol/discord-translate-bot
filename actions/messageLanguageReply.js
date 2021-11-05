const fn = require('../utils/functions');
const googleTranslate = require("./googleTranslate");
const builders = require("@discordjs/builders");
const config = require("../utils/config");
const langs = require("langs");
const notify = require('../actions/notify');

module.exports = async function (message) {
    // if (global.isExceptChannel(message.channelId)) return;

    const text = message.content.trim()
    if (!text) return null

    // franc
    const franc = await fn.importFranc()

    // intend and target
    const intendLang = franc(text)
    const targetLang = fn.getChannelLang(message.channelId)
    if (!targetLang) return null

    // no need to translate
    if (intendLang === targetLang) return null

    // should be auto translate
    if (fn.isMessageShouldBeAutoTranslate(message)) {
        const translation = await googleTranslate(text, targetLang)
        if (translation !== text) await message.reply(`${text}\n👇🏻👇🏻\n\n${translation}`)
        return null
    }

    // und
    if ('und' === intendLang) return null

    // tip
    let tip = ''
    const intentChannelId = fn.getGlobalChannelId(intendLang)
    if (intentChannelId) {
        switch (intendLang) {
            case 'eng':
                tip = `Please do not use English in this room. For English communication, please go to ${builders.channelMention(intentChannelId)}`
                return
            case 'cmn':
                tip = `请不要在此房间使用其它语言。中文交流请到 ${builders.channelMention(intentChannelId)}`
                break
            case 'kor':
                tip = `이 방에서 한국어를 사용하지 마십시오. 한국어 커뮤니케이션은 ${builders.channelMention(intentChannelId)} 로 이동하세요.`
                break
            case 'jpn':
                tip = `この部屋では日本語を使用しないでください。 日本語のコミュニケーションについては、 ${builders.channelMention(intentChannelId)} にアクセスしてください`
                break
            case 'fra':
                tip = `Veuillez ne pas utiliser le français dans cette chambre. Pour la communication en français, veuillez vous rendre sur ${builders.channelMention(intentChannelId)}`
                break
            case 'spa':
                tip = `Por favor, no use español en esta sala. Para español, visite ${builders.channelMention(intentChannelId)}`
                break
            case 'deu':
                tip = `Bitte verwenden Sie in diesem Raum kein Deutsch. Für deutsche Kommunikation gehen Sie bitte zu ${builders.channelMention(intentChannelId)}`
                break
            case 'bul':
            case 'rus':
                tip = `Пожалуйста, не используйте русский язык в этой комнате. Для связи на русском языке перейдите на ${builders.channelMention(intentChannelId)}`
                break
            case 'vie':
                tip = `Vui lòng không sử dụng tiếng Việt trong phòng này. Đối với tiếng Việt, vui lòng truy cập ${builders.channelMention(intentChannelId)}`
                break
        }
    } else {
        tip = `Please do not use other languages in this room.`
        const otherGlobalChannelId = config['channels']['other']
        if (otherGlobalChannelId) {
            tip += ` Please go to ${builders.channelMention(otherGlobalChannelId)}`
        }

        let language = ''
        const lang = langs.where(3, intendLang)
        if (lang) {
            language = lang.name + ' `(' + intendLang + ')`'
        } else {
            language = intendLang
        }

        await notify.sendMessage(
            'moderator',
            `🌎 **Language detected:** ${language}\n`
            + builders.codeBlock(message.content)
            + `from ${builders.userMention(message.author.id)} in ${builders.channelMention(message.channelId)}`
        )
    }

    if (fn.isLangBelongsToAChannel(targetLang)) {
        tip += '\n\n'
        switch (targetLang) {
            case 'eng':
                tip += `Please do not use other languages in this room.`
                break
            case 'cmn':
                tip += `请不要在此房间使用其它语言。`
                break
            case 'kor':
                tip += `이 방에서 다른 언어를 사용하지 마십시오.`
                break
            case 'jpn':
                tip += `この部屋では他の言語を使用しないでください。`
                break
            case 'fra':
                tip += `Veuillez ne pas utiliser d'autres langues dans cette salle.`
                break
            case 'spa':
                tip += `No utilice otros idiomas en esta sala.`
                break
            case 'deu':
                tip += `Bitte verwenden Sie in diesem Raum keine anderen Sprachen.`
                break
            case 'bul':
            case 'rus':
                tip += `Пожалуйста, не используйте другие языки в этой комнате.`
                break
            case 'vie':
                tip += `Vui lòng không sử dụng các ngôn ngữ khác trong phòng này.`
                break
        }
    }

    if (tip) await message.reply(tip)
}
