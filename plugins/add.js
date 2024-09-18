const metadata = [
    {
        "command": "add",
        "desc": "Add participants to the group",
        "example": "add 947XXXXXXXX 947XXXXXXXX",
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

        
        const numbers = query.split(' ');
        const participants = numbers.map(number => number.trim() + '@s.whatsapp.net');

        
        
        try {

            if (!groupMetadata.memberAddMode && !botIsAdmin){
                const BodyMessage = '*I don\'t have permission to add participants in this group!*';
                callback({
                    BodyMessage
                });
                await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });

            } else if (!groupMetadata.memberAddMode && botIsAdmin || groupMetadata.memberAddMode && !botIsAdmin || groupMetadata.memberAddMode && botIsAdmin){
                const response = await sock.groupParticipantsUpdate(uid, participants, "add");
                const BodyMessage = '*Pariticipants Successfully added!*';
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

