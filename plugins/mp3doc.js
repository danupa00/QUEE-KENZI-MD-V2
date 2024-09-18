const metadata = [{

    "command" : "mp3audio",
    "desc"    : "Get any song you need in mp3 format",
    "example" : "mp3audio unstoppable",
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
        
                        
                    const documentPath = videoDetails.mp3Url;  
                    const MType = 'urldocument';
                    const mimetype = 'audio/mp4';
                    const filename = videoDetails.title + '.mp3';
                    
                    callback({
                        documentPath, MType, mimetype, filename
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
                BodyMessage = '*Error Occured (API ERROR)*';    
                    callback({
                        BodyMessage
                    });
                await sock.sendMessage(m.key.remoteJid, { react: { text: "⚠️", key: m.key } });
        
            }

};

