// ======= [ OWNER SETTINGS ] =======

const OwnerNumber = '94753335072';
const OwnerName = 'WHITE TIGER INC';

// ==================================


// ======= [ BOT SETTINGS ] =======

const BotName = 'WHITE TIGER MD';
const Prefix = '.';
const Mode = 'public';
const AlwaysOnline = false;
const AutoReply = 'true';
const timeZone = 'Asia/Colombo';

// ==================================







// Static properties
const staticProperties = {
    OwnerNumber,
    OwnerName,
    BotName,
    Prefix,
    Mode,
    AlwaysOnline,
    AutoReply,
    timeZone
};

// Dynamic properties (e.g., from the global object)
const dynamicProperties = {};
for (let key of Object.keys(global)) {
    if (key !== 'global' && key !== 'module' && key !== '__filename' && key !== '__dirname') {
        dynamicProperties[key] = global[key];
    }
}

// Combine static and dynamic properties
const config = {
    ...staticProperties,
    ...dynamicProperties
};

// Export the config object
module.exports = config;
