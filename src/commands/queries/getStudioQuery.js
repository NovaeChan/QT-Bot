module.exports = `
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
}`