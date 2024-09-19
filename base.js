const chalk = require('chalk');
const fs = require('fs');
const { spawn } = require('child_process');

const showLoader = () => {
    const totalSteps = 10; 
    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        const progress = Math.floor((currentStep / totalSteps) * 100);
        const completed = '🟩'.repeat(currentStep);
        const remaining = '⬜'.repeat(totalSteps - currentStep);

        process.stdout.write(`\r${chalk.yellow('LOADING... ⌛')} ${completed}${remaining} (${progress}%)`);

        if (currentStep === totalSteps) {
            clearInterval(interval);
            console.log('\n' + chalk.green('LOADING COMPLETE ✅'));
            checkFiles(); 
        }
    }, 100); 
};

const checkFiles = () => {
    let allFilesExist = true;

    if (fs.existsSync('lib/')) {
        console.log(chalk.green('LIBRARIES LOADED ✅'));
    } else {
        console.log(chalk.red('LIBRARY FILES NOT FOUND ❌'));
        allFilesExist = false;
    }

    if (fs.existsSync('src/index.js')) {
        console.log(chalk.green('SERVER LOADED ✅'));
    } else {
        console.log(chalk.red('SERVER FILES NOT FOUND ❌'));
        allFilesExist = false;
    }

    if (fs.existsSync('session/creds.json')) {
        console.log(chalk.blue('STARTING WHATSAPP 🔁'));
    } else {
        console.log(chalk.red('NO SESSION FOUND ❌'));
        allFilesExist = false;
    }

    if (allFilesExist) {
        console.log(chalk.cyan('STARTING BOT 🚀'));

        async function startBot(){
        const bootProcess = spawn('node', ['boot.js'], {
            stdio: ['inherit', 'inherit', 'inherit'] // Pass through stdin, stdout, stderr
        });

        bootProcess.on('close', (code) => {
            if (code === 0) {
                console.log(chalk.green('EXIT:'));
            } else {
                console.log(chalk.red(`ERROR: ${code}.`));
            }
        });
        }

        setTimeout(startBot, 5000)
    }
};

showLoader();
