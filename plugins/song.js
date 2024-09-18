const metadata = [{

    "command" : "song",
    "desc"    : "Get any song you need",
    "example" : "song unstoppable",
    "type"    : "download"

}];

const config = require('../config');
const ytc = require('../lib/yt-core');
const system = require('../src/system');

module.exports = async (sock, m, query, callback) => {

                const searchQuery = query;
            try{
                const videoDetails = await ytc.ytcore(searchQuery);

                await sock.sendMessage(m.key.remoteJid, { react: { text: "🔎", key: m.key } });
        
                if (videoDetails && videoDetails != '') {

                    await sock.sendMessage(m.key.remoteJid, { react: { text: "🗃️", key: m.key } });
        

                    const lite = '`';

                    const BodyMessage =  
`╭─━━━━━━( *● WT-MD ●* )━━━━━─◉
│
│  ${lite}SONG DOWNLOADER${lite}
│
├ $ *NAME -* ${videoDetails.title}
├ $ *FILE SIZE -* ${videoDetails.size}
│
╰─━━━━━━━━━━━━━━━━━━━─◉`;

                        const image = videoDetails.thumbnail;
                    
                        const FooterMessage = system.botFooter;
                        const Buttons = [
                            {
                                "text": "AUDIO",
                                "type": "reply", 
                                "id": `${config.Prefix}mp3audio ${query}-btn`
                            },
                            {
                                "text": "DOCUMENT",
                                "type": "reply", 
                                "id": `${config.Prefix}mp3doc ${query}-btn`
                            },
                        ];

                        await callback({
                            BodyMessage,
                            FooterMessage,
                            Buttons,
                            MType: 'buttonMessage',
                            image
                        });
                } else {
                    BodyMessage = '*Song not found! (404)*';    
                    callback({
                        BodyMessage
                    });

                    await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        
                }

            } catch(err){
                console.log(err);
                BodyMessage = '*Error Occured! (API ERROR)*';    
                    callback({
                        BodyMessage
                    });

                    await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        
            }

};

