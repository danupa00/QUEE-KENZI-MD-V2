const metadata = [
    {
        "command": "mute",
        "desc": "Allow only admins to send messages to the group",
        "example": "mute",
        "type": "group"
    }
];

module.exports = async (sock, m, query, callback) => {
    const uid = m.key.remoteJid;
    
    if (!uid.endsWith('@g.us')) {
        callback({ BodyMessage: '*Command can be used only in Groups!*' });
        await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        return;
    } else {

    const groupMetadata = await sock.groupMetadata(uid);
    const botId = `${sock.user.id.match(/^(\d+):/)[1]}@s.whatsapp.net`;

    const botIsAdmin = groupMetadata.participants.some(participant =>
        participant.id === botId && (participant.admin === 'admin' || participant.admin === 'superadmin')
    );

        if (!botIsAdmin) {
            callback({ BodyMessage: '*Please make me an admin first!*' });
            await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
            return;
        }

        const isAdmin = groupMetadata.participants.some(participant =>
            participant.id === m.key.participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
        );

        if (!isAdmin) {
            callback({ BodyMessage: '*Only admins can use that command!*' });
            await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
            return;
        } 
        
        if (groupMetadata.announce) {
            callback({ BodyMessage: '*Group is in mute state already!*' });
            await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        } else {
            await sock.groupSettingUpdate(uid, 'announcement');
            callback({ BodyMessage: '*Group has been muted successfully!* 🛜' });
            await sock.sendMessage(m.key.remoteJid, { react: { text: "✅", key: m.key } });
        
        }

    }
};
