const { MessageEmbed } = require("discord.js");
const replace = require("./functions/replaceMsg");
const query = require("./queries/getAnimeQuery");
const processingRequest = require("./functions/processingRequest");
const api = require("../api");


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
          const animeInfo = data.Media;

          const status = processingRequest.getStatusAnime(animeInfo.status);

          const studios = processingRequest.getStudio(animeInfo.studios);

          const directors = processingRequest.getDirectors(animeInfo.staff);

          const synopsis = processingRequest.getSynopsis(animeInfo.description);

          const genres = processingRequest.getGenres(animeInfo.genres);

          const embed = new MessageEmbed()
              .setColor('#0099ff')
              .setAuthor(animeInfo.title.romaji)
              .setTitle(animeInfo.title.english || animeInfo.title.romaji)
              .setURL(animeInfo.siteUrl)
              .setThumbnail(animeInfo.coverImage.extraLarge || animeInfo.coverImage.large || animeInfo.coverImage.medium)
              .addFields(
                  { name : "Native", value : animeInfo.title.native || animeInfo.title.romaji, inline: true},                
                  { name : "Rating", value : animeInfo.averageScore / 10 + "/10", inline: true},
                  { name : "Type", value : animeInfo.format, inline: true},
                  { name : "Episodes", value : animeInfo.episodes || "N/A", inline : true},
                  { name : "Status", value : status, inline : true});

                  if(status === "Not Yet Release"){
                    embed.addField('\u200B', '\u200B', true );
                  }
                  else{
                    const dayStart = replace.formatDateAnime(animeInfo.startDate.day);
                    const monthStart = replace.formatDateAnime(animeInfo.startDate.month);
                    const yearStart = replace.formatDateAnime(animeInfo.startDate.year);
                    if(status === "Airing"){
                      embed.addfield('Started', dayStart + "/" + monthStart + "/" + yearStart,true);
                    }
                    else{
                      const dayEnd = replace.formatDateAnime(animeInfo.endDate.day);
                      const monthEnd = replace.formatDateAnime(animeInfo.endDate.month);
                      const yearEnd = replace.formatDateAnime(animeInfo.endDate.year);
                      embed.addField("Aired", dayStart + "/" + monthStart + "/" + yearStart + 
                                      " to " + dayEnd + "/" + monthEnd + "/" + yearEnd,true);
                    }
                  }
                  
              embed.addFields(
                { name : "Studios", value : studios, inline : true },
                { name: '\u200B', value: '\u200B', inline : true },
                { name : "Directors", value : directors, inline : true },
                { name : "Genres", value : genres, inline : false },
                { name : "Synopsis", value : synopsis, inline : false },
                  )
              .setFooter(`Brought to you by Anilist API in ${new Date() - start}ms`);

          msg.channel.send(embed);
      }
  }
}