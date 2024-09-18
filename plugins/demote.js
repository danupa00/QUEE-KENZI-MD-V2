const metadata = [
    {
        "command": "demote",
        "desc": "Demote participants from admin in the group",
        "example": "demote @user1 947XXXXXXXX",
        "type": "group"
    }
];

module.exports = async (sock, m, query, callback) => {
    const uid = m.key.remoteJid;

    if (!uid.endsWith('@g.us')) {
        const BodyMessage = '*COMMAND CAN BE USED ONLY IN GROUPS* ❌';
        callback({
            BodyMessage
        });
    } else if (uid.endsWith('@g.us')) {
        let participants = [];

        // Handle mentioned participants
        if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
            participants = m.message.extendedTextMessage.contextInfo.mentionedJid || [];
        }

        // Handle numbers passed in query
        if (query) {
            const numbers = query.split(' ').map(number => number.trim() + '@s.whatsapp.net');
            participants = participants.concat(numbers);
        }

        try {
            const response = await sock.groupParticipantsUpdate(uid, participants, "demote");
            const BodyMessage = '*PARTICIPANTS DEMOTED SUCCESSFULLY* ✅';
            callback({
                BodyMessage
            });
        } catch (error) {
            const BodyMessage = '*FAILED TO DEMOTE PARTICIPANTS* ❌';
            callback({
                BodyMessage
            });
        }
    }
};
