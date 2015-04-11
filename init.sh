#!/bin/bash

sudo apt-get update
sudo apt-get install -y nodejs npm=1.3.10~dfsg-1 redis-server=2:2.8.4-2
## note: use apt-show-versions <package> to check install version

##link nodejs => node to correct path weirdness
sudo ln -s /usr/bin/nodejs /usr/local/bin/node

#setup hubot just like any user would
sudo npm install -g coffee-script hubot@2.11 yo generator-hubot
sudo rm -rf ~/tmp #clean up after yo

mkdir ~/hubot -p
cd ~/hubot
sudo yo hubot --defaults
sudo rm -rf ~/tmp #clean up after yo

#install hubot-lambda package by adding it to external-scripts.json
sed -i "1s/.*/[\n  \"hubot-lambda\",/" external-scripts.json 

#link hubot-lambda to the vagrant working dir
ln -nsf /vagrant ~/hubot/node_modules/hubot-lambda


