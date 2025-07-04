// backend/robot.js
const { spawn } = require('child_process');
const path = require('path');

// Chemin vers l’exécutable placé dans ce même dossier
const exePath = path.join(__dirname, 'run_chatbot_executable.exe');

function askNyrio(question) {
  return new Promise((resolve, reject) => {
    // On lance l’exécutable sans paramètres
    const bot = spawn(exePath, [], { stdio: ['pipe','pipe','pipe'] });
    let output = '';

    // On écoute ce que le bot écrit (stdout)
    bot.stdout.on('data', data => {
      output += data.toString();
      // Dès qu’on voit “User:” dans la sortie, c’est le prompt de Nyrio
      if (output.includes('User:')) {
        const parts = output.split('User:');
        const answer = parts.slice(0, -1).join('User:').trim();
        bot.kill();       // on ferme le process
        resolve(answer);  // on renvoie la réponse
      }
    });

    bot.stderr.on('data', data => console.error('Erreur Nyrio:', data.toString()));
    bot.on('error', err => reject(err));

    // On envoie la question à stdin, suivie d’un retour à la ligne
    bot.stdin.write(question + '\n');
  });
}

module.exports = { askNyrio };
