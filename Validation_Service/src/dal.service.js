require('dotenv').config();
const axios = require("axios");

var ipfsHost='';

function init() {
  ipfsHost = process.env.IPFS_HOST;
}


async function getIPfsTask(cid) {
    const { data } = await axios.get(ipfsHost + cid);
    return {
      lat: parseFloat(data.lat),
      long: parseFloat(data.long),
      time: parseFloat(data.time),
      isThereFire: data.isThereFire,
    };
  }  
  
module.exports = {
  init,
  getIPfsTask
}
