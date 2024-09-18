const metadata = [
    {
        "command": "fbsd",
        "desc": "Download facebook videos on SD quality",
        "example": "fbsd https://facebook.com/watch/?mibextid=6aamW6&v=535935245442639",
        "type": "download"
    }
];

const system = require('../src/system');
const { fetchFbVideoDetails } = require('../lib/fb-core');

module.exports = async (sock, m, query, callback) => {
    
    const data = await fetchFbVideoDetails(query);
    await sock.sendMessage(m.key.remoteJid, { react: { text: "⬇️", key: m.key } });

    if (data) { 
        await sock.sendMessage(m.key.remoteJid, { react: { text: "⬆️", key: m.key } });
        
        const videoPath = data.sdVideo;  
        const MType = 'urlvideo';
        const caption = system.botFooter;
        const autoplay = 'false';

        callback({
            videoPath, MType, caption, autoplay
        });
    }
};
