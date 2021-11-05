const config = require('../utils/config');

const lang3 = async function (lang) {
    const languages = config['languages']
    if (!languages) return null;

    if (languages.hasOwnProperty(lang)) {
        return lang
    }

    for (const language in languages) {
        if (languages[language] === lang) return language
    }

    return null
}

const getGlobalChannelId = function (lang) {
    if (typeof lang !== 'string' || lang.length !== 3) return null
    if (!config['channels'] || !config['channels'][lang]) return null

    return config['channels'][lang][0]
}

const getChannelLang = function (channelId) {
    if (!config['channels']) return null

    for (const lang in config['channels']) {
        if (config['channels']) {
            for (const id of config['channels'][lang]) {
                if (id === channelId) return lang
            }
        }
    }

    return null
}

const isMessageShouldBeAutoTranslate = function (message) {
    const roles = config['autoTranslateRoles']
    if (!roles) return null

    for (const roleId of roles) {
        if (message.member.roles.cache.has(roleId)) return true
    }

    return false
}

const isLangBelongsToAChannel = function (lang) {
    if (lang.length !== 3) return null

    const channels = config['channels']
    if (!channels) return null

    if (channels.hasOwnProperty(lang)) return lang

    return null
}


async function importFranc() {
    const franc = await import('franc')
    return franc.franc
}


module.exports = {
    importFranc: importFranc,

    lang3: lang3,
    getGlobalChannelId: getGlobalChannelId,
    getChannelLang: getChannelLang,
    isMessageShouldBeAutoTranslate: isMessageShouldBeAutoTranslate,
    isLangBelongsToAChannel: isLangBelongsToAChannel,
}
