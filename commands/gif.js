const fetch = require('node-fetch');


module.exports = async (msg, args) => {
    let keywords = 'cat';
    if (args.length >= 1) {
        keywords = args.join(' ');
    }
    let url = `https://g.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contenfilter=medium`;
    let response = await fetch(url);
    let json = await response.json();
    let index = Math.floor(Math.random() * json.results.length);
    msg.channel.send(json.results[index].url);
} 