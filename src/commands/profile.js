const dateFormat = require ("dateformat");
const { MessageEmbed, DiscordAPIError } = require("discord.js");
const status = require("./functions/status");

module.exports = {
    name : 'profile', 
    description : 'Return the information of the author of the message or the person mentionned',
    execute(msg, args){
        let start = new Date();
        const auteur = msg.mentions.users.first() || msg.author;
        const userMember = msg.member;
        const nickname = userMember.displayName;

        let rolemap = msg.guild.member(auteur).roles._roles
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(",");
            if(rolemap.length > 1024){
                rolemap = "Too many roles OwO";
            }
            if(rolemap.length === 0){
                rolemap = "No role :sob:";
            }
        let dateJoined = dateFormat(msg.guild.member(auteur).joinedAt, "hh:MM:ss dd/mm/yyyy");
        let dateCreated = dateFormat(userMember.user.createdAt, "hh:MM:ss dd/mm/yyyy");
        let activite = userMember.presence.activities;

        const embed = new MessageEmbed()
            .setAuthor( `${auteur.tag}`, `${auteur.displayAvatarURL({ format: "png", dynamic: true })}`)
            .setTitle(`${auteur.username}'s profile`)
            .addField('ID', `${auteur.id}     `, true)
            .addField('Nickname', `${nickname !== null ? `${nickname}` : 'N/A'}`, true)
            .addField("Status", `${status.statusOnline(userMember.presence.status)}`, true)
            .addField("Now playing", `${activite.length > 0 ? activite.find(activity => activity.type === "PLAYING").name : 'N/A'}`, true)
            .addField("Mention", `${auteur.toString()}`, true)
            .addField("Bot or Not :robot: ?", auteur.bot ? "You're a bot" : "You're not a bot", true)
            .addField("Joined", `${dateJoined} (CET)`, false)
            .addField("Created", `${dateCreated} (CET)`, true)
            .addField("Roles", rolemap, false)
            .setThumbnail(auteur.displayAvatarURL({ format: "png", dynamic: true }))
            .setColor(0x4b0082)
            //.attachFile(attachment);
            let time = new Date() - start
            embed.setFooter(`Executed in : ${time}ms`)

            msg.channel.send(embed);
    }
}
