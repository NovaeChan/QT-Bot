const getStudio = (studio) => {
    if(studio.nodes.length > 0){
        let studios = "";
        for(i = 0; i < studio.nodes.length; i++){
            studios += studio.nodes[i].name;
            if( i+1 !== studio.nodes.length && studio.nodes[i]){
                studios += ", ";
            }
        }
        return studios;
    }
    return "No studio found"; 
}

const getDirectors = (director) => {
    if(director.edges.length > 0){
        let directors = "";
        for(i = 0; i < director.edges.length; i++){
          if(director.edges[i].role === "Director" || director.edges[i].role === "Chief Director"){
            directors += " " + director.nodes[i].name.full + ",";
          }
        }
        if(directors.length > 0){
          directors = directors.substring(1);
          directors = directors.slice(0, -1);
          return directors;
        }
        else{
          return "No director found";
        }
    }
    return "No director found";
}

const getStatusAnime = (status) => {
    switch(status){
        case "FINISHED" :
           return "Finished";
        case "RELEASING" :
           return "Airing";
        case "NOT_YET_RELEASED" :
           return "Not Yet Released";
        default :
            return "Undefined";
      }
}

const getSynopsis = (description) => {
    if(description.length > 0){
        synopsis = description;
        const regex = '<\/?!?(li|ul|br|em|i|b|Br)[^>]*>'
        let re = new RegExp(regex, 'g');
        synopsis = synopsis.replace(re, '');
        if(description.length > 1020){
          synopsis = synopsis.slice(0, 1019);
          n = synopsis.lastIndexOf(".");
          if(n > 0 && n < synopsis.length){
              synopsis = synopsis.substring(0, n) + '[...]';
          }
        }
        return synopsis;
    }
    else{
        return "No synopsis found";
    }
}

const getAuthor = (author) => {
    if(author.edges.length > 0 && author.nodes.length){
        let roles = "";
        let auteurs = "";
        for(var i = 0; i < author.edges.length; i++){ 
            roles = author.edges[i].role;
            auteurs += author.nodes[i].name.full + " (" + roles + ")";  
            if( i+1 !== author.nodes.length && author.nodes[i]){
                auteurs += ", ";
            }
        }
        return auteurs;
    }
    else{
        return "No authors found";
    }
}

const getGenres = (genre) => {
    if(genre.length > 0){
        return genre.join(", ");
    }
    else{
        return "No genre found";
    }
}

const sortAnime = (nodes, start) => {
    let animes = [];

    animes[0] = nodes[start].startDate.year;
    let year = animes[0];
    let index = 1;

    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].startDate.year === year){
            if(animes[index]){
                animes[index] += nodes[i].title.romaji;
            }
            else{
                animes[index] = nodes[i].title.romaji;
            }
            if(nodes[i].status !== "NOT_YET_RELEASED"){
                if(nodes[i].season){
                    animes[index] += " (" + nodes[i].season;
                }
                if(nodes[i].averageScore){
                    animes[index] += ") - " + "score : " + nodes[i].averageScore / 10 + "/10";
                }
            }
            animes[index] += " \n ";
        }
        else{
            index++;
            animes[index] = nodes[i].startDate.year;
            year = animes[index];
            index++;
            if(nodes[i].startDate.year === year){
                if(animes[index]){
                    animes[index] += nodes[i].title.romaji;
                }
                else{
                    animes[index] = nodes[i].title.romaji;
                }
                if(nodes[i].status !== "NOT_YET_RELEASED"){
                    animes[index] += " (" + nodes[i].season + " " + nodes[i].startDate.year + ") - "
                                          + "score : " + nodes[i].averageScore / 10 + "/10";
                }
                animes[index] += " \n ";
            }
        }
    }
    return animes;
}


exports.getStudio = getStudio;
exports.getDirectors = getDirectors;
exports.getStatusAnime = getStatusAnime;
exports.getSynopsis = getSynopsis;
exports.getAuthor = getAuthor;
exports.getGenres = getGenres;
exports.sortAnime = sortAnime;