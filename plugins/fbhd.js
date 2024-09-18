const metadata = [
    {
        "command": "fbhd",
        "desc": "Download facebook videos on HD quality",
        "example": "fbhd https://facebook.com/watch/?mibextid=6aamW6&v=535935245442639",
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
        const videoPath = data.hdVideo;  
        const MType = 'urlvideo';
        const caption = system.botFooter;
        const autoplay = 'false';

        callback({
            videoPath, MType, caption, autoplay
        });
    }
};
