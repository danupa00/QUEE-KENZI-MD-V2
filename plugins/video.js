const metadata = [{

    "command" : "video",
    "desc"    : "Download a video on yt by its query",
    "example" : "video unstoppable official video",
    "type"    : "download"

}];

const ytc = require('../lib/yt-core');

module.exports = async (sock, m, query, callback) => {

                
                const searchQuery = query;
            try{
                const videoDetails = await ytc.ytcore(searchQuery);
                await sock.sendMessage(m.key.remoteJid, { react: { text: "⬇️", key: m.key } });

                if (videoDetails && videoDetails != '') {

                    await sock.sendMessage(m.key.remoteJid, { react: { text: "⬆️", key: m.key } });
                        
                    const videoPath = videoDetails.mp4Url;  
                    const MType = 'urlvideo';
                    const autoplay = 'false';
                    
                    callback({
                        videoPath, MType, autoplay
                    });
                } else {
                    BodyMessage = '*Video not found! (404)*';    
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

