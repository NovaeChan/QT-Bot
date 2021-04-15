console.log('Bip boop');

require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKENBOT);
client.commands = new Discord.Collection();

client.on('ready', () => console.log('Connecté...'));

const commandHandler = require("./commands");

client.on("message", commandHandler);