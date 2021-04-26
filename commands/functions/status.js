
const statusOnline = (presenceStatus) => {
    return presenceStatus === "offline" ? ":black_circle: - Offline"
        :  presenceStatus === "online"  ? ":green_circle: - Online"
        :  presenceStatus === "idle"    ? ":yellow_circle: - Idle"
        :                                 ":red_circle: - Do Not Disturb"
}

const statusAnime = (status) => {
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

exports.statusOnline = statusOnline;
exports.statusAnime = statusAnime;