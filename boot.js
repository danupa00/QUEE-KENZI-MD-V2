const figlet = require('figlet');
const chalk = require('chalk');
const { spawn } = require('child_process');
const config = require('./config');
const system = require('./src/system');

// Clear the terminal
console.clear();

// Function to center text in the terminal
const centerText = (text, width) => {
    const lines = text.split('\n');
    const centeredLines = lines.map(line => {
        const spaces = Math.max(0, Math.floor((width - line.length) / 2));
        return ' '.repeat(spaces) + line;
    });
    return centeredLines.join('\n');
};

// Display ASCII text
figlet.text(system.botName, { font: 'Colossal' }, (err, data) => {
    if (err) {
        console.error('Error generating ASCII art:', err);
        return;
    }

    // Get terminal width
    const width = process.stdout.columns || 80;

    // Center text and apply color
    const centeredText = centerText(data, width);
    console.log(chalk.blue(centeredText));

});


setTimeout(() => {
    const bootProcess = spawn('node', ['src/index'], {
        stdio: ['inherit', 'inherit', 'inherit'] 
    });
}, 3000);