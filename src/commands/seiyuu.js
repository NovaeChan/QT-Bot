const fetch = require('node-fetch');
const anilist = require('anilist-node');
const { MessageEmbed } = require("discord.js");
const query = require("./queries/getSeiyuuQuery.js");


module.exports = {
  name : 'seiyuu', 
  description : 'Get informations on a seiyuu',
  async execute(msg, args){
    let seiyuu = args.join();
    seiyuu = seiyuu.replace(/,/g, " ");
    var start = new Date();

    var variables = {
      search : seiyuu
    };

    var url = 'https://graphql.anilist.co',
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

      // Make the HTTP Api request
    fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

    function handleResponse(response) {
    return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
    });
    }

    function handleData(data) {
      var characters = getCharacters(data);
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(data.data.Staff.name.full)
        .setURL(data.data.Staff.siteUrl)
        .setAuthor(data.data.Staff.name.full)
        .setThumbnail(data.data.Staff.image.large)
        .addFields(
          {name : "Native name", value : data.data.Staff.name.native, inline: true},
          { name : "Language", value : data.data.Staff.language, inline: true},
          { name : "Description", value : data.data.Staff.description, inline : false},
          { name : "Characters (10 most popular)", value : characters, inline : false}
                )
        .setFooter(`Brought to you by QT Bot and Anilist API in ${new Date() - start}ms`);
      msg.channel.send(embed);
    }

    function handleError(error) {
      console.error(error);
    }

    function getCharacters(data){
      var characters = "";
      var edges = data.data.Staff.characters.edges;
      for(i=0; i < edges.length; i++){
        characters = characters + edges[i].node.name.full + " (" + getAnimeCharacter(edges[i]) + ")" + "\n";
      }
      return characters
    }

    function getAnimeCharacter(data){
      return data.media[0].title.romaji;
    }
  }
    
}