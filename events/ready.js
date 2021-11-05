const onboard = require('../actions/onboard');
const {sendError} = require('../actions/notify');


const execute = async function (client) {
    try {
        await onboard(client)
    } catch (e) {
        await sendError(e)
    }
}

module.exports = {
    name: 'ready',
    once: true,
    execute,
}
