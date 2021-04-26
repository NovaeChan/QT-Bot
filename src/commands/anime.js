const { MessageEmbed } = require("discord.js");
const replace = require("./functions/replaceMsg");
const query = require("./queries/getAnimeQuery");
const processingRequest = require("./functions/processingRequest");
const api = require("../api");
const paginationEmbed = require('discord.js-pagination');



module.exports = {
    name : 'anime', 
    description : 'Get informations on an anime',
    async execute(msg, args){
      let start = new Date();
      const anime = replace.replaceVirgule(args);
      
      if(anime.toUpperCase() === "SPACE DANDY"){
        msg.channel.send("My favourite anime :heart:");
      }

      //Request to the API 
      const response = await api(query, { search : anime } );
      if(response.error){
        console.error(response);
        msg.channel.send("Something went wrong");
        return response;
      }
      handleData(response);

      function handleData(data){
          const animeInfo = data.Page.media;
          
          const status = [];
          for(let i = 0; i < animeInfo.length; i++){
            status[i] = processingRequest.getStatusAnime(animeInfo[i].status);
          }
          
          const studios = []
          for(let i = 0; i < animeInfo.length; i++){
            studios[i] = processingRequest.getStudio(animeInfo[i].studios);
          }

          const directors = []
          for(let i = 0; i < animeInfo.length; i++){
            directors[i] = processingRequest.getDirectors(animeInfo[i].staff);
          }

          const synopsis = [];
          for(let i = 0; i < animeInfo.length; i++){
            synopsis[i] = processingRequest.getSynopsis(animeInfo[i].description);
          }

          const genres = [];
          for(let i = 0; i < animeInfo.length; i++){
            genres[i] = processingRequest.getGenres(animeInfo[i].genres);
          }


          let pages = [];
          for(let i = 0; i < 10; i++){
            if(animeInfo[i]){
              const embed = new MessageEmbed()
              .setColor('#0099ff')
              .setAuthor(animeInfo[i].title.romaji)
              .setTitle(animeInfo[i].title.english || animeInfo[i].title.romaji)
              .setURL(animeInfo[i].siteUrl)
              .setThumbnail(animeInfo[i].coverImage.extraLarge || animeInfo[i].coverImage.large || animeInfo[i].coverImage.medium)
              .addFields(
                  { name : "Native", value : animeInfo[i].title.native || animeInfo[i].title.romaji, inline: true},                
                  { name : "Rating", value : animeInfo[i].averageScore / 10 + "/10", inline: true},
                  { name : "Type", value : animeInfo[i].format, inline: true},
                  { name : "Episodes", value : animeInfo[i].episodes || "N/A", inline : true},
                  { name : "Status", value : status[i], inline : true});

                  if(status[i] === "Not Yet Release"){
                    embed.addField('\u200B', '\u200B', true );
                  }
                  else{
                    const dayStart = replace.formatDateAnime(animeInfo[i].startDate.day);
                    const monthStart = replace.formatDateAnime(animeInfo[i].startDate.month);
                    const yearStart = replace.formatDateAnime(animeInfo[i].startDate.year);
                    if(status[i] === "Airing"){
                      embed.addfield('Started', dayStart + "/" + monthStart + "/" + yearStart,true);
                    }
                    else{
                      const dayEnd = replace.formatDateAnime(animeInfo[i].endDate.day);
                      const monthEnd = replace.formatDateAnime(animeInfo[i].endDate.month);
                      const yearEnd = replace.formatDateAnime(animeInfo[i].endDate.year);
                      embed.addField("Aired", dayStart + "/" + monthStart + "/" + yearStart + 
                                      " to " + dayEnd + "/" + monthEnd + "/" + yearEnd,true);
                    }
                  }
                  
                embed.addFields(
                  { name : "Studios", value : studios[i], inline : true },
                  { name: '\u200B', value: '\u200B', inline : true },
                  { name : "Directors", value : directors[i], inline : true },
                  { name : "Genres", value : genres[i], inline : false },
                  { name : "Synopsis", value : synopsis[i], inline : false },
                    );
              pages [i] = embed;
            }
            else{
              break;
            }
          }

          paginationEmbed(msg, pages);
    
          //msg.channel.send(embed);
          
      }
  }
}