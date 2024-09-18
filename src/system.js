// ======= [ SYSTEM SETTINGS ] =======

const developer = 'WHITE TIGER INC';
const v = '1.0v';
const developerNumber = '94753335072';
const botName = 'WHITE TIGER MD';
const botFooter = '● POWERED BY WHITE TIGER INC ●'

// ===================================








// Static properties
const staticProperties = {
    developer,
    v,
    developerNumber,
    botName,
    botFooter
};

// Dynamic properties (e.g., from the global object)
const dynamicProperties = {};
for (let key of Object.keys(global)) {
    if (key !== 'global' && key !== 'module' && key !== '__filename' && key !== '__dirname') {
        dynamicProperties[key] = global[key];
    }
}

// Combine static and dynamic properties
const system = {
    ...staticProperties,
    ...dynamicProperties
};

// Export the system object
module.exports = system;
