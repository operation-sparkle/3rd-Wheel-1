const axios = require('axios');
module.exports.getLocation = () => {
  // if (navigator.geolocation) {
  return navigator.geolocation.getCurrentPosition(position => (console.log({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  })));
  // } else {
  //   console.log('geolocation is not supported');
  // }
};

module.exports.getPic = async (pic) => {
  try {
    const options = {
      method: 'get',
      url: `https://i.imgur.com/${pic}m.jpg`,
    };
    const response = await axios(options);
    const { picture } = response.data;
    return picture;
  } catch (err) {
    console.log(err);
    return err;
  }
};
