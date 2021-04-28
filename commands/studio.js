const { MessageEmbed } = require("discord.js");
const replace = require('./functions/replaceMsg');
const query = require("./queries/getStudioQuery.js");
const api = require("../api.js");
const paginationEmbed = require('discord.js-pagination');


module.exports = {
    name : 'studio', 
    description : 'Get informations on a studio',
    async execute(msg, args){
        msg.reply("This command is still in beta. It might take some times to process. I am trying to find a way to get the results faster like creating my own database.");
        
        let studio = replace.replaceVirgule(args);
        
        let start = new Date();
        async function getDataStudio(studio){
            const response = [];
            for(let i = 0; i < 99; i++){
                response[i] = await api(query, {search : studio, page: i+1});
                if(response[i].error){
                    console.error(response);
                    msg.channel.send("Something went wrong");
                    return reponse;
                }
                if(response[i].Studio.media.nodes.length < 1){
                    break;
                }
                while(new Date() - start < 1000){
                    //Do nothing. I can't really get setTimeout to work out
                }
                console.log(i);
            }
            return response;
        }
        const data = await getDataStudio(studio);

        handleData(data);

        function handleData(data){
            let pages = [];
            for(let i = 0; i < data.length; i++){
                if(data[i].Studio.media.nodes.length > 0){
                    const studioInfo = data[i].Studio;

                    const animes = sortAnime(studioInfo.media.nodes, 0);
                    const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    if(i===0){
                        embed.setURL(studioInfo.siteUrl)
                        embed.setAuthor(studioInfo.name)
                    }
                    embed.addFields(
                        { name : "Studio type", value : studioInfo.isAnimationStudio ? "Animation Studio" : " ??? ", inline: true},
                        );
                        for(let j = 0; j < animes.length; j++){
                            if(!animes[j]){
                                embed.addField("TBA", animes[j+1], false);
                            }
                            else{
                                embed.addField(animes[j], animes[j+1] , false);
                            }
                            j++;
                        };
                    pages[i] = embed;
                }
                else{
                    break;
                }
            }
            paginationEmbed(msg, pages);

        }

        function sortAnime(nodes, start){
            let animes = [];

            animes[0] = nodes[start].startDate.year;
            let year = animes[0];
            let index = 1;

            for(let i = 0; i < nodes.length; i++){
                if(nodes[i].startDate.year === year){
                    if(animes[index]){
                        animes[index] += nodes[i].title.romaji;
                    }
                    else{
                        animes[index] = nodes[i].title.romaji;
                    }
                    if(nodes[i].status !== "NOT_YET_RELEASED"){
                        animes[index] += " (" + nodes[i].season + " " + nodes[i].startDate.year + ") - "
                                                 + "score : " + nodes[i].averageScore / 10 + "/10";
                    }
                    animes[index] += " \n ";
                }
                else{
                    index++;
                    animes[index] = nodes[i].startDate.year;
                    year = animes[index];
                    index++;
                    if(nodes[i].startDate.year === year){
                        if(animes[index]){
                            animes[index] += nodes[i].title.romaji;
                        }
                        else{
                            animes[index] = nodes[i].title.romaji;
                        }
                        if(nodes[i].status !== "NOT_YET_RELEASED"){
                            animes[index] += " (" + nodes[i].season + " " + nodes[i].startDate.year + ") - "
                                                     + "score : " + nodes[i].averageScore / 10 + "/10";
                        }
                        animes[index] += " \n ";
                    }
                }
            }
            return animes;
        }

    }
}