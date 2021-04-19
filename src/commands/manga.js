const { MessageEmbed } = require("discord.js");
const replace = require("./functions/replaceMsg");
const query = require("./queries/getMangaQuery");
const statusAnime = require("./functions/status");
const api = require("../api");
const processingRequest = require("./functions/processingRequest");


module.exports = {
    name : 'manga', 
    description : 'Get informations on a manga',
    async execute(msg, args){
        let start = new Date();
        let manga = replace.replaceVirgule(args);

        const response = await api(query, { search : manga } );
        if(response.error){
          console.error(response);
          msg.channel.send("Something went wrong");
          return response;
        }
        handleData(response);

        function handleData(data){
            const manga = data.Media;

            const status = statusAnime.statusAnime(manga.status);

            const genres = processingRequest.getGenres(manga.genres);
                
            const auteurs = processingRequest.getAuthor(manga.staff);

            const synopsis = processingRequest.getSynopsis(manga.description);

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${manga.title.english || manga.title.romaji}`)
                .setURL(`${manga.siteUrl}`)
                .setAuthor(`${manga.title.romaji}`)
                .setThumbnail(manga.coverImage.extraLarge || manga.coverImage.large || manga.coverImage.medium)
                .addFields(
                    { name : "Native" , value : manga.title.native, inline: true },
                    { name : "Type" , value : manga.format, inline: true },
                    { name : 'Rating', value: manga.averageScore / 10, inline : true },
                    { name : "Volumes", value : manga.volumes || "N/A", inline: true},
                    { name : "Chapters", value : manga.chapters || "N/A", inline: true},
                    { name : "Status", value : status, inline : true}
                );
                if(status === "Not Yet Release"){
                    embed.addField('\u200B', '\u200B', true );
                }
                else{
                    const dayStart = replace.formatDateAnime(manga.startDate.day);
                    const monthStart = replace.formatDateAnime(manga.startDate.month);
                    const yearStart = replace.formatDateAnime(manga.startDate.year);
                    if(status === "Airing"){
                        embed.addField('Started', dayStart + "/" + monthStart + "/" + yearStart,true);
                    }
                    else{
                        const dayEnd = replace.formatDateAnime(manga.endDate.day);
                        const monthEnd = replace.formatDateAnime(manga.endDate.month);
                        const yearEnd = replace.formatDateAnime(manga.endDate.year);
                        embed.addField("Aired", dayStart + "/" + monthStart + "/" + yearStart + 
                                        " to " + dayEnd + "/" + monthEnd + "/" + yearEnd,true);
                    }
                }
                embed.addFields(
                    { name : "Authors" , value : auteurs, inline: true },
                    { name : "Genres", value : genres, inline: false},
                    { name : "Description", value : synopsis, inline : false},    
                )
                .setFooter(`Brought to you by Anilist API in ${new Date() - start}ms`);
                msg.channel.send(embed);
            } 
    }
}