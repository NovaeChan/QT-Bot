const { MessageEmbed } = require("discord.js");
const replace = require("./functions/replaceMsg");
const query = require("./queries/getMangaQuery");
const statusAnime = require("./functions/status");
const api = require("../api");
const processingRequest = require("./functions/processingRequest");
const paginationEmbed = require('discord.js-pagination');


module.exports = {
    name : 'manga', 
    description : 'Get informations on a manga',
    async execute(msg, args){
        let manga = replace.replaceVirgule(args);

        const response = await api(query, { search : manga } );
        if(response.error){
          console.error(response);
          msg.channel.send("No manga found");
          return response;
        }
        handleData(response);

        function handleData(data){
            const manga = data.Page.media;

            const status = [];
            for(let i = 0; i < manga.length; i++){
                status[i] = statusAnime.statusAnime(manga[i].status);
            }

            const genres = [];
            for(let i = 0; i < manga.length; i++){
                genres[i] = processingRequest.getGenres(manga[i].genres);
            }

            const auteurs = [];
            for(let i = 0; i < manga.length; i++){
                auteurs[i] = processingRequest.getAuthor(manga[i].staff);
            }

            const synopsis = [];
            for(let i = 0; i < manga.length; i++){
                synopsis[i] = processingRequest.getSynopsis(manga[i].description);
            }

            let pages = [];
            for(let i = 0; i < 10; i++){
                if(manga[i]){
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${manga[i].title.english || manga[i].title.romaji}`)
                        .setURL(`${manga[i].siteUrl}`)
                        .setAuthor(`${manga[i].title.romaji}`)
                        .setThumbnail(manga[i].coverImage.extraLarge || manga[i].coverImage.large || manga[i].coverImage.medium)
                        .addFields(
                            { name : "Native" , value : manga[i].title.native, inline: true },
                            { name : "Type" , value : manga[i].format, inline: true },
                            { name : 'Rating', value: manga[i].averageScore / 10, inline : true },
                            { name : "Volumes", value : manga[i].volumes || "N/A", inline: true},
                            { name : "Chapters", value : manga[i].chapters || "N/A", inline: true},
                            { name : "Status", value : status[i], inline : true}
                        );
                        if(status[i] === "Not Yet Release"){
                            embed.addField('\u200B', '\u200B', true );
                        }
                        else{
                            const dayStart = replace.formatDateAnime(manga[i].startDate.day);
                            const monthStart = replace.formatDateAnime(manga[i].startDate.month);
                            const yearStart = replace.formatDateAnime(manga[i].startDate.year);
                            if(status[i] === "Airing"){
                                embed.addField('Started', dayStart + "/" + monthStart + "/" + yearStart,true);
                            }
                            else{
                                const dayEnd = replace.formatDateAnime(manga[i].endDate.day);
                                const monthEnd = replace.formatDateAnime(manga[i].endDate.month);
                                const yearEnd = replace.formatDateAnime(manga[i].endDate.year);
                                embed.addField("Aired", dayStart + "/" + monthStart + "/" + yearStart + 
                                                " to " + dayEnd + "/" + monthEnd + "/" + yearEnd,true);
                            }
                        }
                        embed.addFields(
                            { name : "Authors" , value : auteurs[i], inline: true },
                            { name : "Genres", value : genres[i], inline: false},
                            { name : "Description", value : synopsis[i], inline : false},    
                        );
                    pages[i] = embed;
                }
                else{
                    break;
                }
            } 
            paginationEmbed(msg, pages);
        }
    }
}