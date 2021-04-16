const gif = require("./commands/gif");
const hug = require("./commands/hug");
const avatar = require("./commands/avatar");
const profile = require("./commands/profile");
const help = require("./commands/help");
const anime = require("./commands/anime");
const seiyuu = require("./commands/seiyuu");
const manga = require("./commands/manga");
const studio = require("./commands/studio");

const PREFIX = "!";

const commands = { hug, gif, avatar, profile, anime, manga, seiyuu, studio, help };

module.exports = async (msg) => {
    var message = msg.content.toLowerCase();
    let tokens = message.split(" ");
    let command = tokens.shift();

    //Ne fait rien si un bot écrit un message
    if(!msg.content.startsWith(PREFIX) || msg.author.bot){return;}

    if( command.charAt(0) === PREFIX ){

        //Quand l'utilisateur entre une commande qui commence par la valeur de PREFIX
        //On log le nom de l'utilisateur, l'heure à laquelle il a écrit le message
        //et le continue du message
        var date = new Date();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var secondes = date.getSeconds();
        console.log(`[${msg.author.tag}] (${hour}:${minutes}:${secondes}) : ${msg.content}`);

        //Appelle une fonction par rapport à la commande entrée par l'utilisateur
        //Exemple : !hug appelle la fonction hug
        command = command.substring(1);
        commands[command](msg, tokens);
    }
};