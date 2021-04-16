module.exports = `
query ($search: String) {
    Media(search:$search, type:ANIME, sort:POPULARITY_DESC){
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
      format
      siteUrl
      source
      averageScore
      season
      status
      episodes
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
      studios {
        edges {
          id
        }
        nodes{
          name
          siteUrl
        }
      }
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