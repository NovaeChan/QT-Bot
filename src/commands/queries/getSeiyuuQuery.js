module.exports = `
    query ($search: String) {
      Staff(search: $search) {
        id
        siteUrl
        image {
          large
        }
        name {
          first
          last
          full
          native
        }
        language
        description
        characters(sort: FAVOURITES_DESC, perPage:10){
          edges{
            node{
              id
              name {
                first
                last
                full
                native
              }
    
            }
            media{
              id
              title {
                romaji
                english
              }
              characters {
                edges {
                  id
                }
              }
            }
    
            }
        }
      }
    }`