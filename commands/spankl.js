const fetch = require('node-fetch');
const { MessageEmbed, RichEmbed } = require("discord.js");



module.exports = {
    name : 'spank', 
    description : 'Spanks someone',
    async execute(msg, args){
        const start = new Date();
        let url = `https://g.tenor.com/v1/search?q=anime+spanks&key=${process.env.TENORKEY}&contenfilter=medium`;
        let response = await fetch(url);
        let json = await response.json();
        let index = Math.floor(Math.random() * json.results.length);
        //msg.channel.send(json.results[index].url);

        let spankMessage = "";
        if (args.length === 1) {
            spankMessage = `${msg.author} is spanking ${msg.mentions.users.first()} >//<`
        }
        else{
            spankMessage = `Are you ok ${msg.author} ?!`
        }

        const embed = new MessageEmbed()
            .setColor(color=0x00ff00)
            .setDescription(description = `${spankMessage}`)
            //.setImage(url = json.results[index].url)
            .setImage(url = json.results[index].media[0].gif.url)
            .setFooter(`Brought to you by QT Bot and Tenor API in ${new Date() - start}ms`);

        await msg.channel.send(embed);
    }
} 