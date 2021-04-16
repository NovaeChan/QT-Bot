module.exports = `
        query ($search: String) {
            Media(search:$search, type:MANGA, sort:POPULARITY_DESC){
                id
                title {
                romaji
                english
                native
                userPreferred
                }
                coverImage {
                extraLarge
                large
                medium
                color
                }
                chapters
                volumes
                format
                siteUrl
                source
                averageScore
                season
                status
                startDate {
                year
                month
                day
                }
                endDate {
                year
                month
                day
                }
                description
                genres
                staff {
                edges {
                    id
                    role
                }
                nodes{
                    id
                    name {
                    first
                    last
                    full
                    native
                    }  
                }
                }           
            }
        }
        `