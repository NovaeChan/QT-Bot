module.exports = async (id) => {
    var query = `
    query ($search: String) {
        Staff(search: $search) {
        id
        siteUrl
        image {
            large
            medium
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
        characterMedia(sort:SCORE_DESC){
            edges{
            node{
                id
                title {
                romaji
                english
                native
                userPreferred
                }
            }
            }
        }
        }
    }`

    var variables = {
        search : seiyuu
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        }

        // Make the HTTP Api request
    fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

    function handleResponse(response) {
    return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
    });
    }

    function handleData(data) {
    }
}
