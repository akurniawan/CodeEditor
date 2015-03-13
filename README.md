# CodeEditor is a real-time code editor which can used as tool for editing your codes collaborately with your friends. It is created by me and 2 of my friends (Aditya Kurniawan, Joe Erik Carla, Christine Sotanto as my final project in college)
# How to install
# install mongodb and nodejs
# run mongodb
# install these npm packages = {
#	 share@0.6.3,
#	 connect,
#	 mongodb,
#   socket.io,
#   term.js,
#   pty.js
# } (using "npm install <packages list>" from your terminal, don't forget to point your current directory (in terminal) to CodeEditor/node_services)
# change db name in share/src/db/mongo.coffee to Collaboration
# change options.opsBeforeCommit period in share/src/mode.coffee to 0
# change any IPs written in web/workspace/js/basicConfig.js and web/workspace/index.html to your public ip
# change compile path in CodeEditor/compile/compile.sh and CodeEditor/node_server/terminal_server.js to your htdocs folder (for xampp users), or any folder you're using to installed this project
# run 3 of nodejs server {ot.js, server.js, terminal_server.js} using node <filename> in terminal
# copy new ace.js (i willl include it in additional folder) to CodeEditor/node_services/node_modules/share/webclient/ace.js

Foreign LINUX
======

Foreign LINUX is a dynamic binary translator and a Linux system call interface emulator for the Windows platform. It is capable of running *unmodified* Linux binaries on Windows without any drivers or modifications to the system. This provides another way of running Linux applications under Windows in constrast to Cygwin and other tools. There is a  [comparison](https://github.com/wishstudio/flinux/wiki/Comparison) over existing projects.

This project is in heavy development. It is currently capable of running many Linux utilities. Including but not limiting to:

* Basic utilities: **bash**, **vim**, **nano**
* Programming environments: **python**, **gcc**
* Package managers: **pacman**
* Terminal-based games: **vitetris**, **nethack**
* Network utilities: **wget**, **curl**, **ssh**
* X applications: **xeyes**, **xclock**, **glxgears**

Some major missing functions are file permissions, process management, signals, multi-threading, and more. Applications depending on these technologies will not work properly.

How to use
=====
Foreign LINUX is still in early stage, bad things like *crashing your system* or *eating your harddisk* may happen. **You have been warned.**

For users who just want to give it a try. Download a premade Arch Linux environment [here](https://xysun.me/static/flinux-archlinux.7z). Then visit [Beginner's Guide](https://github.com/wishstudio/flinux/wiki/Beginner's-Guide).

For just the binary executables, visit [release page](https://github.com/wishstudio/flinux/releases).

For developers, you can also visit [this guide](https://github.com/wishstudio/flinux/wiki/ArchLinux-installation-steps) for detailed bootstrapping steps of an ArchLinux chroot.

Screenshots
=====
![Screenshot](https://xysun.me/static/flinux-screenshot.png)

Feature highlights
======
* Run unmodified Linux applications in a pure user-mode application, no privileged code or drivers or virtual machines
* Support both dynamically and statically compiled executables
* Support NTFS native hardlinks and emulated symbolic links
* Xterm-like terminal emulation on Win32 console
* Client-side networking (sockets) support

For a more technical perspective, see [this](https://github.com/wishstudio/flinux/wiki/Features).

Development
======
See [this guide](https://github.com/wishstudio/flinux/wiki/Development) on how to compile this project.

License
======
Copyright (C) 2014, 2015 Xiangyan Sun <wishstudio@gmail.com>

The source code is licensed under GNU General Public License version 3 or above (GPLv3+)

