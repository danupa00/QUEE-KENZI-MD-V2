const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, proto, generateWAMessageFromContent, MessageType, prepareWAMessageMedia } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../config');
const system = require('./system');
const fetch = require('node-fetch');
const express = require("express");
const { default: pino } = require('pino');
const startTime = require('../lib/start-time');
const { url } = require('inspector');
const { voiceMap } = require('../lib/auto-voice');


const pluginsDir = path.join(__dirname, '..', 'plugin');

// =============================

const sendButtonMessage = async (sock, remoteJid, bodyMessage, footerMessage, buttons, image = null) => {
    const formattedButtons = buttons.map((btn) => {
        if (btn.type === 'reply') {
            return {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: btn.text,
                    id: btn.id
                })
            };
        } else if (btn.type === 'url') {
            return {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: btn.text,
                    url: btn.url
                })
            };
        } else if (btn.type === 'select') {
            return {
                name: "single_select",
                buttonParamsJson: btn.info,
            };
        } else if (btn.type === 'copy') {
            return {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: btn.text,
                    id: btn.id,
                    copy_code: btn.code,
                })
            };
        }
    });

    let headerOptions = {
        title: "",
        gifPlayback: true,
        subtitle: "",
        hasMediaAttachment: false,
    };

    if (image) {
        const buffer = String(image).startsWith("fs:") 
            ? fs.readFileSync("./plugins/" + String(image).replace(/fs:/gi, '')) 
            : await getImageBuffer(image);
        const imageMedia = await prepareWAMessageMedia({ image: buffer }, { upload: sock.waUploadToServer });
        
        headerOptions = {
            title: "",
            gifPlayback: true,
            subtitle: "",
            hasMediaAttachment: true,
            imageMessage: imageMedia.imageMessage
        };
    }

    const msg = generateWAMessageFromContent(remoteJid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: bodyMessage
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: footerMessage
                    }),
                    header: proto.Message.InteractiveMessage.Header.create(headerOptions),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: formattedButtons
                    }),
                    contextInfo: {
                        mentionedJid: [remoteJid],
                        forwardingScore: 0,
                        isForwarded: false,
                    }
                }),
            },
        },
    }, {});

    await sock.relayMessage(remoteJid, msg.message, {
        messageId: msg.key.id
    });
};

async function getImageBuffer(imageUrl) {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    return buffer;
}

const sendImageMessage = async (sock, remoteJid, imageUrl, caption) => {
    const mediaPath = path.join(__dirname, 'media', imageUrl);
     const imageBuffer = fs.readFileSync(mediaPath);

     await sock.sendMessage(remoteJid, { 
         image: imageBuffer,
         caption: caption
     });
};

const sendAudioMessage = async (sock, remoteJid, audioPath, ptt) => {


     const mediaPath = await path.join(__dirname, 'audio', audioPath);
     const audioBuffer = await fs.readFileSync(mediaPath);

     if (ptt = 'true'){
        ptt = true;
     } else {
        ptt = false;
     }

     await sock.sendMessage(remoteJid, { 
         audio: audioBuffer,
         ptt: ptt,
         mimetype: 'audio/mp4'
     });

    
};

const sendVCardMessage = async (sock, remoteJid, name, botName, decryptedNumber, phoneNumber) => {

    const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + `FN:${name}\n`
            + `ORG:${botName};\n`
            + `TEL;type=CELL;type=VOICE;waid=${decryptedNumber}:${phoneNumber}\n`
            + 'END:VCARD'

    await sock.sendMessage( remoteJid,{ contacts: {  displayName: name, contacts: [{ vcard }] }})

};

const sendURLAudioMessage = async (sock, m, remoteJid, audioPath) => {
   
    
     await sock.sendMessage(remoteJid, {
         audio: { url : audioPath },
         mimetype: 'audio/mp4'
     });

     await sock.sendMessage(m.key.remoteJid, { react: { text: "🎵", key: m.key } });
        

   
};



const sendVideoMessage = async (sock, remoteJid, videoPath, caption, autoplay) => {
    const mediaPath = path.join(__dirname, 'media', videoPath);
     const videoBuffer = fs.readFileSync(mediaPath);

     if (autoplay = 'true'){
        autoplay = true;
     } else {
        autoplay = false;
     }

     await sock.sendMessage(remoteJid, { 
         video: videoBuffer,
         caption: caption,
         mimetype: 'video/mp4',
         gifPlayback: autoplay
     });

     
};


const sendURLVideoMessage = async (sock, m, remoteJid, videoPath, caption, autoplay) => {
    

     await sock.sendMessage(remoteJid, { 
         video: {url: videoPath},
         caption: caption,
         mimetype: 'video/mp4',
     });

     await sock.sendMessage(m.key.remoteJid, { react: { text: "📽️", key: m.key } });
        
};


const sendDocumentMessage = async (sock, remoteJid, documentPath, caption, mimetype, filename) => {
    const mediaPath = path.join(__dirname, 'media', documentPath);
    const documentBuffer = fs.readFileSync(mediaPath);

    
    await sock.sendMessage(remoteJid, { 
        document: documentBuffer,
        caption: caption,
        mimetype: mimetype,
        fileName: filename
    });
};

const sendURLDocumentMessage = async (sock, m, remoteJid, documentPath, caption, mimetype, filename) => {
    
    await sock.sendMessage(remoteJid, { 
        document: {url: documentPath},
        caption: caption,
        mimetype: mimetype,
        fileName: filename
    });

    await sock.sendMessage(m.key.remoteJid, { react: { text: "📄", key: m.key } });
};

// ============================

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, '..', 'session'));

    const sock = makeWASocket({
        auth: state,
        logger: require('pino')({ level: 'silent' }), 
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            console.log('CONNECTION CLOSED DUE TO', lastDisconnect.error, ', RECONNECTING... ', shouldReconnect);
            
            if (shouldReconnect) {
                connectToWhatsApp(); 
            }
        } else if (connection === 'open') {
            console.log(chalk.green(`${startTime.sHH}:${startTime.sMM} CONNECTED TO WHATSAPP ✅`));

            const userId = sock.user.id;
            const phoneNumberMatch = userId.match(/^(\d+):/);
            const userPhoneNumber = phoneNumberMatch ? phoneNumberMatch[1] : 'Unknown';

            console.log(chalk.green(`${system.botName} ${system.v} DEVELOPED BY ${system.developer}(${system.developerNumber}) IS NOW CONNECTED WITH ${userPhoneNumber} 🔗`));

            if (config.AlwaysOnline === false){
                sock.sendPresenceUpdate('unavailable');
                sock.sendPresenceUpdate('unavailable');
            }
        }
    });

    sock.ev.on('messages.upsert', async (messages) => {
        for (const message of messages.messages) {
            let mbody;
    
            if (message.message && message.message.ephemeralMessage) {
                mbody = message.message.ephemeralMessage.message.extendedTextMessage.text;
            } else if (message.message && message.message.extendedTextMessage) {
                mbody = message.message.extendedTextMessage.text;
            } else if (message.message) {
                mbody = message.message.conversation;
            }
    
            let response = false;
    
            if (config.Mode === 'private') {
                if (message.key.fromMe || message.key.remoteJid === config.OwnerNumber + '@s.whatsapp.net') {
                    response = true;
                } else {
                    response = false;
                }
            } else if (config.Mode === 'public') {
                response = true;
            } else {
                response = false;
                continue;
            }
    
            let command;
            let cprefix = config.Prefix;
            let query = '';
    
            if (mbody && mbody.startsWith(cprefix)) {
                const splitMessage = mbody.slice(cprefix.length).split(' ', 2);
                command = splitMessage[0];
                const newQuery = mbody.slice(cprefix.length + command.length + 1);
                query = newQuery || '';
            } else {
                command = mbody;
            }
    
            let selectedBtn;
    
            if (message.message && message.message.templateButtonReplyMessage && message.message.templateButtonReplyMessage.selectedId) {
                selectedBtn = message.message.templateButtonReplyMessage.selectedId;
    
                try {
                    if (selectedBtn.includes(' ')) {
                        const parts = selectedBtn.split(' ');
                        command = parts[0].substring(1);  
                        query = parts[1].match(/^(.+)-btn$/)[1];
                    } else {
                        command = selectedBtn.match(/^(.+)-btn$/)[1];
                        query = null;
                    } 
                } catch(err){
                    return;
                }
            }
    
            if (voiceMap[command] && voiceMap[command][0] === "© WHITE TIGER MIND INC") {
                const audioPath = voiceMap[command][1];
                await sendAudioMessage(sock, message.key.remoteJid, audioPath, 'true');
                continue;  
            }
    
            if (response && command) {
                let commandFile;
                if (command) {
                    commandFile = path.join(pluginsDir, `${command.toLowerCase()}.js`);
                }
                
                if (fs.existsSync(commandFile)) {
                    const commandFunction = require(commandFile);
                    
                    await commandFunction(sock, message, query, async (msg) => {
                        switch (msg.MType) {
                            case 'buttonMessage':
                                await sendButtonMessage(sock, message.key.remoteJid, msg.BodyMessage, msg.FooterMessage, msg.Buttons, msg.image);
                                break;
                            case 'image':
                                await sendImageMessage(sock, message.key.remoteJid, msg.imageUrl, msg.caption);
                                break;
                            case 'audio':
                                await sendAudioMessage(sock, message.key.remoteJid, msg.audioPath, msg.caption, msg.ptt);
                                break;
                            case 'urlaudio':
                                await sendURLAudioMessage(sock, message, message.key.remoteJid, msg.audioPath, msg.caption, msg.ptt);
                                break;
                            case 'video':
                                await sendVideoMessage(sock, message.key.remoteJid, msg.videoPath, msg.caption, msg.autoplay);
                                break;
                            case 'urlvideo':
                                await sendURLVideoMessage(sock, message, message.key.remoteJid, msg.videoPath, msg.caption, msg.autoplay);
                                break;    
                            case 'document':
                                await sendDocumentMessage(sock, message.key.remoteJid, msg.documentPath, msg.caption, msg.mimetype, msg.filename);
                                break;
                            case 'urldocument':
                                await sendURLDocumentMessage(sock, message, message.key.remoteJid, msg.documentPath, msg.caption, msg.mimetype, msg.filename);
                                break;    
                            case 'vcard':
                                await sendVCardMessage(sock, message.key.remoteJid, msg.name, msg.botName, msg.decryptedNumber, msg.phoneNumber);
                                break;
                            default:
                                await sock.sendMessage(message.key.remoteJid, { text: msg.BodyMessage });
                        }
                    });
                }
            }
        }
    });
    
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err.message);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
    sock.ev.on('creds.update', saveCreds);
}

connectToWhatsApp().catch(err => console.error("Failed to connect to WhatsApp:", err));

// ==============================================

const app = express();

const PORT = process.env.PORT || 7860;


app.use(express.static('public'));


const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(chalk.yellow(`SERVER LISTENING ON PORT ${port} 🛜`));
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use, trying another...`);
      startServer(8080);
    } else {
      throw err;
    }
  });
};


startServer(PORT);
