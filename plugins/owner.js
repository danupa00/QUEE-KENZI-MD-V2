const metadata = [
    {
        "command": "owner",
        "desc": "Get the owner of the bot",
        "example": "owner",
        "type": "main"
    }
];

const config = require('../config');

module.exports = async (sock, m, query, callback) => {

    const name = config.OwnerName;
    const botName = config.BotName;
    const decryptedNumber = config.OwnerNumber;
    const phoneNumber = '+' + config.OwnerNumber;

    await sock.sendMessage(m.key.remoteJid, { react: { text: "🌟", key: m.key } });
        

    await callback({
        MType: 'vcard',
        name,
        botName,
        decryptedNumber,
        phoneNumber
    });

}