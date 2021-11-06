const {config} = require('../utils/bot')
const messageLanguageReply = require('../actions/messageLanguageReply');
const messageTranslate = require('../actions/messageTranslate');


const execute = async function (message) {
    if (!message.author) return;
    if (message.author.bot) return;
    if (message.guild.id !== config['guildId']) return;

    if (message.content.trim().toLowerCase().startsWith('!translate')) {
        await messageTranslate(message)
        return;
    }

    await messageLanguageReply(message)
}

module.exports = {
    name: 'messageCreate',
    execute,
}
