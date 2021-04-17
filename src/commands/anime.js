const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");
const replace = require("./functions/replaceMsg");
const query = require("./queries/getAnimeQuery");
const statusAnime = require("./functions/status");


module.exports = {
    name : 'anime', 
    description : 'Get informations on an anime',
    async execute(msg, args){
      let start = new Date();
      const anime = replace.replaceVirgule(args);
      
      if(anime.toUpperCase() === "SPACE DANDY"){
        msg.channel.send("My favourite anime :heart:");
      }

      const variables = {
        search : anime
      }

      const url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      }

      fetch(url, options).then(handleResponse)
                          .then(handleData)
                          .catch(handleError);

      function handleResponse(response) {
          return response.json().then(function (json) {
          return response.ok ? json : Promise.reject(json);
      });
      }

      function handleError(error) {
          msg.channel.send("No results found or something went wrong.");
          console.error(error);
      }

      function handleData(data){
          const animeInfo = data.data.Media;

          const status = statusAnime.statusAnime(animeInfo.status);

          let studios = "";
          if(animeInfo.studios.nodes.length > 0){
            for(i = 0; i < animeInfo.studios.nodes.length; i++){
              studios += animeInfo.studios.nodes[i].name;
              if( i+1 !== animeInfo.studios.nodes.length && animeInfo.studios.nodes[i]){
                studios += ", ";
              }
            }
          }

          let directors = "";
          if(animeInfo.staff.edges.length > 0){
            for(i = 0; i < animeInfo.staff.edges.length; i++){
              if(animeInfo.staff.edges[i].role === "Director" || animeInfo.staff.edges[i].role === "Chief Director"){
                directors += " " + animeInfo.staff.nodes[i].name.full + ",";
              }
            }
            if(directors.length > 0){
              directors = directors.substring(1);
              directors = directors.slice(0, -1);
            }
            else{
              directors = "No directors found";
            }
          }

          let synopsis = "";
          if(animeInfo.description.length > 0){
            synopsis = animeInfo.description;
            let regex = '<\/?!?(li|ul|br|em|i)[^>]*>'
            var re = new RegExp(regex, 'g');
            synopsis = synopsis.replace(re, '');

            if(animeInfo.description.length > 1020){
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
                    let dayStart = replace.formatDateAnime(animeInfo.startDate.day);
                    let monthStart = replace.formatDateAnime(animeInfo.startDate.month);
                    let yearStart = replace.formatDateAnime(animeInfo.startDate.year);
                    if(status === "Airing"){
                      embed.addfield('Started', dayStart + "/" + monthStart + "/" + yearStart,true);
                    }
                    else{
                      let dayEnd = replace.formatDateAnime(animeInfo.endDate.day);
                      let monthEnd = replace.formatDateAnime(animeInfo.endDate.month);
                      let yearEnd = replace.formatDateAnime(animeInfo.endDate.year);
                      embed.addField("Aired", dayStart + "/" + monthStart + "/" + yearStart + 
                                      " to " + dayEnd + "/" + monthEnd + "/" + yearEnd,true);
                    }
                  }
                  
              embed.addFields(
                { name : "Studios", value : studios, inline : true },
                { name: '\u200B', value: '\u200B', inline : true },
                { name : "Directors", value : directors, inline : true },
                { name : "Genres", value : animeInfo.genres.join(", "), inline : false },
                { name : "Synopsis", value : synopsis, inline : false },
                  )
              .setFooter(`Brought to you by QT Bot and Anilist API in ${new Date() - start}ms`);

          msg.channel.send(embed);
      }

      //let response = await anime.search(anime);
  }
}