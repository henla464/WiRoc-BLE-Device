var exec = require('child_process').exec;
var os = require("os");

var Helper = Helper || {}

Helper.getBatteryLevel = function(callback) {
  console.log('Helper - get battery level');
  var hostname = os.hostname();
  if (hostname == "chip") {
    child = exec("/usr/sbin/i2cget -f -y 0 0x34 0xb9", function (error, stdout, stderr) {
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
        callback('EXEC ERROR', null);
      } else {
        var intPercent = parseInt(stdout.trim());
        console.log('Battery level - onReadRequest: value (dec)=' + intPercent);
        callback('OK', intPercent);
      }
    });
  } else { 
     callback('OK', 75);
  }

};

module.exports = Helper;
