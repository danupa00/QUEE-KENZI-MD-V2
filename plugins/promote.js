const metadata = [
    {
        "command": "promote",
        "desc": "Promote participants to admin in the group",
        "example": "promote @user1 947XXXXXXXX",
        "type": "group"
    }
];

module.exports = async (sock, m, query, callback) => {
    const uid = m.key.remoteJid;

    if (!uid.endsWith('@g.us')) {
        const BodyMessage = '*Command can be used only in groups!*';
        callback({
            BodyMessage
        });

        await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        
    } else if (uid.endsWith('@g.us')) {
        let participants = [];

        if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
            participants = m.message.extendedTextMessage.contextInfo.mentionedJid || [];
        }

        if (query) {
            const numbers = query.split(' ').map(number => number.trim() + '@s.whatsapp.net');
            participants = participants.concat(numbers);
        }

        try {
            const response = await sock.groupParticipantsUpdate(uid, participants, "promote");
            const BodyMessage = '*PARTICIPANTS PROMOTED SUCCESSFULLY* ✅';
            callback({
                BodyMessage
            });
        } catch (error) {
            const BodyMessage = '*FAILED TO PROMOTE PARITICIPANTS* ❌';
            callback({
                BodyMessage
            });
        }
    }
};
