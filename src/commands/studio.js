const replace = require('./functions/replaceMsg');
const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");


module.exports = {
    name : 'studio', 
    description : 'Get informations on a studio',
    async execute(msg, args){
        msg.reply("This command is still in beta");
        let start = new Date();
        let studio = replace.replaceVirgule(args);

        var query = `
        query ($search: String){
            Studio(search:$search) {
                id
                name
                siteUrl
                isAnimationStudio
                media(sort:POPULARITY_DESC,page: 1, perPage:25){
                    nodes{
                    title {
                        romaji
                        english
                        native
                    }
                    countryOfOrigin
                    type
                    status
                    season
                    seasonYear
                    episodes
                    source
                    averageScore
                    }
                }
            }
        }`;

        var variables = {
            search : studio
        }

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

        fetch(url, options).then(handleResponse)
            .then(handleData)
            .catch(handleError);

        function handleResponse(response) {
            return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
        }

        function handleError(error) {
            console.error(error);
        }

        function handleData(data){
            var studioInfo = data.data.Studio;
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(studioInfo.name)
                .setURL(studioInfo.siteUrl)
                .setAuthor(studioInfo.name)
                //.setThumbnail(data.data.Staff.image.large)
                .addFields(
                    { name : "Studio type", value : studioInfo.isAnimationStudio ? "Animation Studio" : " ??? ", inline: true},
                    { name : "Animes", value : getAnime(studioInfo.media.nodes, 1), inline: false},
                    { name : "Animes bis", value : getAnime(studioInfo.media.nodes, 2), inline : false}
                    )
                .setFooter(`Brought to you by QT Bot and Anilist API in ${new Date() - start}ms`);


            msg.channel.send(embed);
        }

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