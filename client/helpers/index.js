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
