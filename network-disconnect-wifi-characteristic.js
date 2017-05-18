var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');
var exec = require('child_process').exec;
var os = require("os");

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var NetworkDisonnectWifiCharacteristic = function() {
  NetworkDisonnectWifiCharacteristic.super_.call(this, {
    uuid: 'F5EA6203-BCC5-4406-A981-89C6C5FC09CF',
    properties: ['write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Disconnect to a Wifi network'
      }),
      // presentation format: 0x01=1 bit (bool), 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x01, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });
};

util.inherits(NetworkDisonnectWifiCharacteristic, Characteristic);

NetworkDisonnectWifiCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('NetworkDisonnectWifiCharacteristic - onWriteRequest - data: ' + data.toString() + ' offset: ' + offset);
  var thisObj = this;
  var result = this.RESULT_SUCCESS;
 
  var hostname = os.hostname();
  var wlanIFace = 'wlan0';
  if (hostname.toLowerCase() != 'chip') {
    wlanIFace = 'wlp2s0';
  }
  
  var cmd = "nmcli device disconnect " + wlanIFace;
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
     if (error) {
       console.log('error code: "' + error + '"');
       console.log(stderr);
       callback(thisObj.RESULT_UNLIKELY_ERROR);
     }
     console.log(stdout);
     callback(result);
  });
};

module.exports = NetworkDisonnectWifiCharacteristic;
