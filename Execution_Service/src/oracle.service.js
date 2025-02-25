const axios = require("axios");

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function distanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000; // Earth's radius in meters
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = earthRadius * c;
  
  return distance;
}

const URL = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_USA_contiguous_and_Hawaii_7d.csv"
/**
 * given lat, long, time, find if there is a fire in this location and time
 * lattitude and longitude should be in lower 48 or Hawaii
 * @param {number} lat short for lattitude
 * @param {number} long short for longitude
 * @param {number} time unix timestamp, should be within last 7 days
 * @returns object with attributes {req : {lat, long, time}, isThereFire: bool} 
 */
async function isThereFire(lat, long, time) {
  // check if lattitude and longitude are in lower 48 + Hawaii, but we don't need to check that
  // check if time is within last 7 days, but we don't need to check that
  // call api
  let resp = await axios.get(URL);
  let rawData = resp.data.split("\n");
  let data = [];  // will hold objects of lat, long, datetime, confidence
  for(let row of rawData){
    let rowArr = row.split(",");
    if(rowArr.length < 9){
      continue;
    }
    // indices: lat = 0, long = 1, date = 5, time = 6, confidence = 8
    // date format is yyyy-mm-dd time is hhmm, all in utc time zone
    let [year, month, day] = rowArr[5].split("-");
    let hours = rowArr[6].slice(0, 2);
    let minutes = rowArr[6].slice(2, 4);
    let timestamp = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    let currObj = {
      lat: Number(rowArr[0]),
      long: Number(rowArr[1]),
      datetime: timestamp.getTime() / 1000,
      confidence: rowArr[8]
    };
    data.push(currObj);
  }
  // parse resulting csv for closest lat/long/time
  let smallestTimeDiff = Infinity;
  let confidence = "not found";  // if nothing is found for this query, it isn't in the dataset and no fire here
  for(let datapoint of data){
    // see if each datapoint is within 375 meters
    if(distanceBetweenCoordinates(datapoint.lat, datapoint.long, lat, long) <= 375){
      // this datapoint describes this location
      let currTimeDiff = Math.abs(time - datapoint.datetime);
      if(currTimeDiff < smallestTimeDiff){
        confidence = datapoint.confidence;
      }
    }
  }
  let isThereFire = confidence == "high" || confidence == "nominal";
  return {
    req: {lat, long, time},
    isThereFire
  };
}
  
module.exports = {
  isThereFire,
}
