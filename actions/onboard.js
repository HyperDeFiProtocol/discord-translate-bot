const moment = require("moment")
const {sendMessage} = require('../actions/notify')

module.exports = async function (client) {
    const timeString = moment().toString()
    console.log(`Logged in as ${client.user.tag} at ${timeString}`);

    await sendMessage('bot', `💯 \`${timeString}\` onboard`)
}
