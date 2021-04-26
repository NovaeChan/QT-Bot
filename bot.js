console.log('Bip boop');

//require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const PREFIX = process.env.PREFIX;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.login(process.env.TOKENBOT);
client.once('ready', () => console.log('Connecté...'));

//const commandHandler = require("./commands");

client.on("message", message => {
    if(message.content === "69"){
        message.channel.send('https://tenor.com/view/noice-nice-click-gif-8843762');
    }
    //Do nothing if the message doesn't start with the PREFIX or if the message is send by a bot
    if(!message.content.startsWith(PREFIX) || message.author.bot){return;}

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var secondes = date.getSeconds();
    console.log(`[${message.author.tag}] (${hour}:${minutes}:${secondes}) : ${message.content}`);

    if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}

});