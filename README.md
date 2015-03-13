CodeEditor
======
CodeEditor is a real-time code editor which can used as tool for editing your codes collaborately with your friends. It is created by me and 2 of my friends (Aditya Kurniawan, Joe Erik Carla, Christine Sotanto) as my final project in college

How to install
=====
install mongodb and nodejs
run mongodb
install these npm packages = {
	share@0.6.3,
	connect,
	mongodb,
  socket.io,
  term.js,
  pty.js
} (using "npm install <packages list>" from your terminal, don't forget to point your current directory (in terminal) to CodeEditor/node_services)
change db name in share/src/db/mongo.coffee to Collaboration
change options.opsBeforeCommit period in share/src/mode.coffee to 0
change any IPs written in web/workspace/js/basicConfig.js and web/workspace/index.html to your public ip
change compile path in CodeEditor/compile/compile.sh and CodeEditor/node_server/terminal_server.js to your htdocs folder (for xampp users), or any folder you're using to installed this project
run 3 of nodejs server {ot.js, server.js, terminal_server.js} using node <filename> in terminal
copy new ace.js (i willl include it in additional folder) to CodeEditor/node_services/node_modules/share/webclient/ace.js

Feature highlights
======
* Live Cursor
* Terminal
* Chat

License
======
Copyright (C) 2015 CodeEditor Team
