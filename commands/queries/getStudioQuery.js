module.exports = `
query ($search: String, $page: Int){
    Studio(search:$search) {
        id
        name
        siteUrl
        isAnimationStudio
        media(sort:START_DATE_DESC,page: $page, perPage:15){
            nodes{
            title {
                romaji
                english
                native
            }
            startDate {
                year
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