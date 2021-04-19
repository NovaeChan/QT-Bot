const { MessageEmbed } = require("discord.js");
const query = require("./queries/getSeiyuuQuery.js");
const api = require("../api.js");


module.exports = {
  name : 'seiyuu', 
  description : 'Get informations on a seiyuu',
  async execute(msg, args){
    let seiyuu = args.join();
    seiyuu = seiyuu.replace(/,/g, " ");
    var start = new Date();

    const response = await api(query, { search : seiyuu } );
    if(response.error){
      console.error(response);
      msg.channel.send("Something went wrong");
      return response;
    }
    handleData(response);

    function handleData(data) {
      const Staff = data.Staff;
      const characters = getCharacters(Staff);
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(Staff.name.full)
        .setURL(Staff.siteUrl)
        .setAuthor(Staff.name.full)
        .setThumbnail(Staff.image.large)
        .addFields(
          {name : "Native name", value : Staff.name.native, inline: true},
          { name : "Language", value : Staff.language, inline: true},
          { name : "Description", value : Staff.description, inline : false},
          { name : "Characters (10 most popular)", value : characters, inline : false}
                )
        .setFooter(`Brought to you by QT Bot and Anilist API in ${new Date() - start}ms`);
      msg.channel.send(embed);
    }

    function getCharacters(Staff){
      var characters = "";
      var edges = Staff.characters.edges;
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