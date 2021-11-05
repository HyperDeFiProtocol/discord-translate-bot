const {Client, Intents} = require('discord.js')
const config = require('../utils/config')

let notifyChannels = {}


// init client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        // Intents.FLAGS.GUILD_MEMBERS,
        // Intents.FLAGS.GUILD_BANS,
        // Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        // Intents.FLAGS.GUILD_WEBHOOKS,
        // Intents.FLAGS.GUILD_INVITES,
        // Intents.FLAGS.GUILD_VOICE_STATES,
        // Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        // Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        // Intents.FLAGS.GUILD_MESSAGE_TYPING,
        // Intents.FLAGS.DIRECT_MESSAGES,
        // Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        // Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    // for reactions
    // partials: [
    //     'MESSAGE',
    //     'CHANNEL',
    //     'REACTION'
    // ],
})

// on ready
const onReady = async function () {
    if (!config['notifyChannels']) return;

    // notifyChannels
    for (const key in config['notifyChannels']) {
        notifyChannels[key] = client.channels.cache.get(config['notifyChannels'][key])
    }
}
client.once('ready', onReady);


// export
module.exports = {
    config: config,

    client: client,
    notifyChannels: notifyChannels,
}
