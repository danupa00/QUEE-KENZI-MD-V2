const metadata = [
    {
        "command": "alive",
        "desc": "See whether the bot is online or not",
        "example": "alive",
        "type": "main"
    }
];

const config = require('../config');
const system = require('../src/system');
const startTime = require('../lib/start-time');

module.exports = async (sock, m, query, callback) => {
    await sock.sendMessage(m.key.remoteJid, { react: { text: "🔥", key: m.key } });

    let HH = new Date().getHours();
    let MM = new Date().getMinutes();

    if (HH < 10) {
        HH = `0${HH}`;
    }

    if (MM < 10) {
        MM = `0${MM}`;
    }

    const time = `${HH}:${MM}`;
    const user = m.key.remoteJid;
    const phoneNumberMatch = user.match(/^(\d+)@/);
    const userPhoneNumber = phoneNumberMatch ? phoneNumberMatch[1] : 'Unknown';
    const mono = '`';

    const startTotalMinutes = startTime.sHH * 60 + startTime.sMM;
    const currentTotalMinutes = HH * 60 + MM;

    let uptimeMinutes = currentTotalMinutes - startTotalMinutes;
        if (uptimeMinutes < 0) {
            uptimeMinutes += 24 * 60;
        }

        const days = Math.floor(uptimeMinutes / (24 * 60));
        const hours = Math.floor((uptimeMinutes % (24 * 60)) / 60);
        const minutes = uptimeMinutes % 60;

        const formattedDays = days > 0 ? `${days}d ` : ''; // Only include days if greater than 0
        const formattedHours = hours < 10 ? `0${hours}h ` : `${hours}h `;
        const formattedMinutes = minutes < 10 ? `0${minutes}m` : `${minutes}m`;

        const uptime = `${formattedDays}${formattedHours}${formattedMinutes}`;

    
    const BodyMessage =  
`╭─━━━━━━( *● WT-MD ●* )━━━━━─◉
│
├ $ *USER -* @${userPhoneNumber}
├ $ *TIME -* ${time}
├ $ *ZONE -* ${config.timeZone}
├ $ *UPTIME -* ${uptime}
├ $ *PREFIX -* ${config.Prefix}
├ $ *OWNER -* ${config.OwnerNumber}
│
│  ${mono}I AM ALIVE NOW${mono}
│
╰─━━━━━━━━━━━━━━━━━━━─◉`;

    const FooterMessage = system.botFooter;
    const Buttons = [
        {
            "text": "MENU",
            "type": "reply", 
            "id": "menu-btn"
        },
        {
            "text": "OWNER",
            "type": "reply", 
            "id": "owner-btn"
        },
        {
            "text": "SCRIPT",
            "type": "url", 
            "url": "https://white-tiger.onrender.com/"
        },
    ];

    await callback({
        audioPath: 'alive.mp3',
        MType: 'audio',
        ptt: 'true'
    });
   
    await callback({
        BodyMessage,
        FooterMessage,
        Buttons,
        MType: 'buttonMessage'
    });

};
