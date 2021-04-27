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
        handleData(response);

        function handleData(data){
            var studioInfo = data.Studio;
            console.log(studioInfo);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(studioInfo.name)
                .setURL(studioInfo.siteUrl)
                .setAuthor(studioInfo.name)
                //.setThumbnail(data.data.Staff.image.large)
                .addFields(
                    { name : "Studio type", value : studioInfo.isAnimationStudio ? "Animation Studio" : " ??? ", inline: true},
                    { name : "Animes", value : "a"/*getAnime(studioInfo.media.nodes, 1)*/, inline: false},
                    { name : "Animes bis", value : "a"/*getAnime(studioInfo.media.nodes, 2)*/, inline : false}
                    )
                .setFooter(`Brought to you by Anilist API in ${new Date() - start}ms`);


            msg.channel.send(embed);
        }


        //TODO: Je dois vérfier l'année de diffusion
        //Si pas encore diffusé alors => TBA et je n'affiche pas la note
        //Je dois grouper en fonction de l'année de diffusion
        //Si la taille dépasse la taille max autorisée alors je passe à la deuxième page


        /*
        Si nodes[i] existe alors : 
            si la taille de la liste d'animes < 1024 alors : 
                on regroupe les animes par groupe d'années 
        */
        function sortAnime(nodes, start){
            let animeInfo = [];

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