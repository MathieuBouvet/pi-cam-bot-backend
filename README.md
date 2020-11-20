# pi-cam-bot

Un petit robot qui filme devant lui, contrôlé par un raspberry-pi sur le réseau local.

Architecture client/serveur, le raspberry expose une API http, qui permet de controller les déplacements du robot et de lancer ou arrêter le stream de sa camera.

L'application client donne accès à une interface graphique qui affiche le stream de la camera et permet à l'utilisateur de diriger le robot au clavier.

