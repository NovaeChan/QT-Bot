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
        const regex = '<\/?!?(li|ul|br|em|i)[^>]*>'
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

exports.getStudio = getStudio;
exports.getDirectors = getDirectors;
exports.getStatusAnime = getStatusAnime;
exports.getSynopsis = getSynopsis;
exports.getAuthor = getAuthor;
exports.getGenres = getGenres;