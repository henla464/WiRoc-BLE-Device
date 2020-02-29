var exec = require('child_process').exec;
var util = require('util');
var bleno = require('@henla464/bleno');
var os = require("os");

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
    uuid: '2A19',
    properties: ['read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: '' //Battery level between 0 and 100 percent
      }),
      // presentation format: 0x04=unsigned 8-bit, 0x01=exponent 1, 0xAD 0x27=percentage, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0xAD, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
};

util.inherits(BatteryLevelCharacteristic, Characteristic);

BatteryLevelCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var thisObj = this;
  var hostname = os.hostname();
  if (hostname == "chip") {
    child = exec("/usr/sbin/i2cget -f -y 0 0x34 0xb9", function (error, stdout, stderr) {
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      } else {
        var intPercent = parseInt(stdout.trim());
        console.log('Battery level - onReadRequest: value (dec)=' + intPercent);
        callback(thisObj.RESULT_SUCCESS, new Buffer([intPercent]));
      }
    });
  } else { 
     callback(thisObj.RESULT_SUCCESS, new Buffer([75]));
  }
};

module.exports = BatteryLevelCharacteristic;
