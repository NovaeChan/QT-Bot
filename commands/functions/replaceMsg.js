    const replaceVirgule = (args) =>{
        let cleanString = args.join();
        cleanString = cleanString.replace(/,/g, " ");
        return cleanString;
    }

    const formatDateAnime = (date) =>{
        if(date < 10){
            return date = "" + "0" + date;
        }
        return date;
    }

    exports.replaceVirgule = replaceVirgule;
    exports.formatDateAnime = formatDateAnime;
