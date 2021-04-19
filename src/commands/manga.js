const { MessageEmbed } = require("discord.js");
const replace = require("./functions/replaceMsg");
const query = require("./queries/getMangaQuery.js");
const statusAnime = require("./functions/status");
const api = require("../api.js");

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
            let manga = data.Media;

            const status = statusAnime.statusAnime(manga.status);

            let genres;
            if(manga.genres.length > 0){
                genres = manga.genres.join(", ");
            }
            else{
                genres = "No genre found";
            }
                
            //Looking for all the directors who worked on the anime
                
            let auteurs = "";
            if(manga.staff.edges.length > 0 && manga.staff.nodes.length){
                for(var i = 0; i < manga.staff.edges.length; i++){
                    let roles = ""; 
                    roles = manga.staff.edges[i].role;
                    auteurs += manga.staff.nodes[i].name.full + " (" + roles + ")";  
                    if( i+1 !== manga.staff.nodes.length && manga.staff.nodes[i]){
                        auteurs += ", ";
                    }
                }
            }
            else{
                roles = "No roles found";
                auteurs = "No authors found";
            }

            let synopsis = "";
            if(manga.description.length > 0){
                synopsis = manga.description;
                let regex = '<\/?!?(li|ul|br|em|i|bR|Br|u|b|a|a href)[^>]*>'
                var re = new RegExp(regex, 'g');
                synopsis = synopsis.replace(re, '');

                if(manga.description.length > 1020){
                    synopsis = synopsis.slice(0, 1019);
                    n = synopsis.lastIndexOf(".");
                    if(n > 0 && n < synopsis.length){
                        synopsis = synopsis.substring(0, n) + '[...]';
                    }
                }
            }
            else{
                synopsis = "No synopsis found";
            }

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
                    let dayStart = replace.formatDateAnime(manga.startDate.day);
                    let monthStart = replace.formatDateAnime(manga.startDate.month);
                    let yearStart = replace.formatDateAnime(manga.startDate.year);
                    if(status === "Airing"){
                        embed.addField('Started', dayStart + "/" + monthStart + "/" + yearStart,true);
                    }
                    else{
                        let dayEnd = replace.formatDateAnime(manga.endDate.day);
                        let monthEnd = replace.formatDateAnime(manga.endDate.month);
                        let yearEnd = replace.formatDateAnime(manga.endDate.year);
                        embed.addField("Aired", dayStart + "/" + monthStart + "/" + yearStart + 
                                        " to " + dayEnd + "/" + monthEnd + "/" + yearEnd,true);
                    }
                }
                embed.addFields(
                    { name : "Authors" , value : auteurs, inline: true },
                    { name : "Genres", value : genres, inline: false},
                    { name : "Description", value : synopsis, inline : false},    
                )
                .setFooter(`Brought to you by QT Bot in ${new Date() - start}ms`);
                msg.channel.send(embed);
            } 
    }
}