const { MessageEmbed } = require("discord.js");
const replace = require('./functions/replaceMsg');
const query = require("./queries/getStudioQuery.js");
const api = require("../api.js");

module.exports = {
    name : 'studio', 
    description : 'Get informations on a studio',
    async execute(msg, args){
        msg.reply("This command is still in beta");
        let start = new Date();
        let studio = replace.replaceVirgule(args);

        const response = await api(query, { search : studio } );
        if(response.error){
          console.error(response);
          msg.channel.send("Something went wrong");
          return response;
        }
        //console.log(response);
        handleData(response);

        function handleData(data){
            var studioInfo = data.Studio;
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(studioInfo.name)
                .setURL(studioInfo.siteUrl)
                .setAuthor(studioInfo.name)
                //.setThumbnail(data.data.Staff.image.large)
                .addFields(
                    { name : "Studio type", value : studioInfo.isAnimationStudio ? "Animation Studio" : " ??? ", inline: true},
                    { name : "Animes", value : getAnime(studioInfo.media.nodes, 1), inline: false},
                    { name : "Animes bis", value : getAnime(studioInfo.media.nodes, 2), inline : false}
                    )
                .setFooter(`Brought to you by Anilist API in ${new Date() - start}ms`);


            msg.channel.send(embed);
        }

        //Temp function
        function getAnime(nodes, index){
            let animes = "";
            let nodesSize = nodes.length;
            let start = 0;
            if(index === 1){
                nodesSize = Math.floor(nodes.length / 2);
            }
            else{
                start = Math.floor(nodes.length / 2 + 1);
            }
            for(i = start; i < nodesSize; i++){
                if(nodes[i]){
                    animes = animes + " - " + nodes[i].title.romaji 
                        + " (" + nodes[i].season + " " + nodes[i].seasonYear + ") - "
                        + "score : " + nodes[i].averageScore / 10 + "/10 \n";
                }
                else{
                    break;
                }
            }
            return animes;
        }
    }

}