const clientId = "cDHcdbl53tynysyp6VpQDg";
const secret =
  "0LT82NypLQfqX7zDd1sb6iM96PHmFsGHF0ptug751I5Kpx250ed2NIPeY5wI4YKP";
let accessToken = "";

const Yelp = {
  getAccessToken() {
    if (accessToken) {
      return new Promise(resolve => resolve(accessToken));
    }
    return fetch(
      `https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${
        clientId
      }&client_secret=${secret}`,
      {
        method: "POST"
      }
    )
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        accessToken = jsonResponse.access_token;
      });
  },

  search(term, location, sortBy) {
    return Yelp.getAccessToken()
      .then(() => {
        return fetch(
          `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${
            term
          }&location=${location}&sort_by=${sortBy}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.businesses) {
          return jsonResponse.businesses.map(business => {
            return {
              id: business.id,
              image_src: business.image_url,
              name: business.name,
              address1: business.location.address,
              city: business.location.city,
              state: business.location.state,
              zip_code: business.location.zipCode,
              category: business.categories[0].title,
              rating: business.rating,
              review_count: business.reviewCount
            };
          });
        }
      });
  }
};

export default Yelp;
