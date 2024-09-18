const metadata = [
    {
        "command": "remove",
        "desc": "Remove participants from the group",
        "example": "remove @user1 947XXXXXXXX",
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
        const groupMetadata = await sock.groupMetadata(uid);
        const botId = `${sock.user.id.match(/^(\d+):/)[1]}@s.whatsapp.net`;
        const botIsAdmin = groupMetadata.participants.some(participant =>
            participant.id === botId && (participant.admin === 'admin' || participant.admin === 'superadmin')
        );

        const isAdmin = groupMetadata.participants.some(participant =>
            participant.id === m.key.participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
        );

        
        const numbers = query.split(' ');
        const participants = numbers.map(number => number.trim() + '@s.whatsapp.net');

        
        
        try {

            if (!botIsAdmin){
                const BodyMessage = '*Make me an admin first!*';
                callback({
                    BodyMessage
                });
                await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });

            } else if (!isAdmin){
                const BodyMessage = '*Only admins can use this command!*';
                callback({
                    BodyMessage
                });
                await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });

            } else if (botIsAdmin && isAdmin){
                const response = await sock.groupParticipantsUpdate(uid, participants, "remove");
                const BodyMessage = '*Pariticipants Successfully removed!*';
                    callback({
                        BodyMessage
                    });
                    await sock.sendMessage(m.key.remoteJid, { react: { text: "✅", key: m.key } });
            }

            

        } catch (error) {
            const BodyMessage = '*Failed to add participants!*';
            callback({
                BodyMessage
            });

            await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        }
    }
};
