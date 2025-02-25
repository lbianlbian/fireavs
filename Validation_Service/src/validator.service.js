require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");

async function validate(proofOfTask) {

  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      var data = await oracleService.getPrice(taskResult.lat, taskResult.long, taskResult.time);
      return data.isThereFire == taskResult.isThereFire;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }
