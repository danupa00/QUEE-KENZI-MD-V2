const fs = require('fs');
const path = require('path');
const system = require('../src/system');

const extractMetadata = (fileContent) => {
    const metadataMatch = fileContent.match(/const\s+metadata\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/);
    if (metadataMatch) {
        try {
            let metadataString = metadataMatch[1];
            metadataString = metadataString
                .replace(/^\s*\[\s*/, '[')
                .replace(/\s*\]\s*$/, ']');

            return JSON.parse(metadataString);
        } catch (error) {
            console.warn('Failed to parse metadata:', error);
            return null;
        }
    }
    return null;
};

module.exports = async (sock, m, query, callback) => {
    await sock.sendMessage(m.key.remoteJid, { react: { text: "🔁", key: m.key } });
    const pluginDir = __dirname;
    const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js') && file !== 'menu.js');

    const types = new Set();

    files.forEach(file => {
        try {
            const filePath = path.join(pluginDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            const metadata = extractMetadata(fileContent);

            if (metadata && Array.isArray(metadata)) {
                metadata.forEach(meta => {
                    const { type } = meta;
                    if (type) {
                        types.add(type); 
                    }
                });
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    });

    
    const Buttons = Array.from(types).map(type => ({
        text: type.toUpperCase() + ' MENU', // Capitalize type and append ' Menu'
        type: "reply",
        id: type + '-menu' 
    }));

    const lite = '`';

    const BodyMessage = 
`╭─━━━━━( *● WT-MD ●* )━━━━━─◉
│
│  ${lite}WT-MD MENU${lite}
│
╰─━━━━━━━━━━━━━━━━━━━─◉`;

    const FooterMessage = system.botFooter || 'Footer text here'; // Ensure system.botFooter is defined

    const MType = 'buttonMessage'; // Type of message to send

    callback({
        BodyMessage,
        FooterMessage,
        Buttons,
        MType
    });
    await sock.sendMessage(m.key.remoteJid, { react: { text: "⚙️", key: m.key } });
};
