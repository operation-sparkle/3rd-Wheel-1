
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => ({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }));
  } else {
    console.log('geolocation is not supported');
  }
};

module.exports = {
  getLocation,
};
