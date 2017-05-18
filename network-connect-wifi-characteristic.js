var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');
var exec = require('child_process').exec;
var os = require("os");

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var NetworkConnectWifiCharacteristic = function() {
  this.wifiConnectData = null;

  NetworkConnectWifiCharacteristic.super_.call(this, {
    uuid: 'F5EA6202-BCC5-4406-A981-89C6C5FC09CF',
    properties: ['write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Connect to a Wifi network'
      }),
      // presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });
};

util.inherits(NetworkConnectWifiCharacteristic, Characteristic);

NetworkConnectWifiCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('NetworkConnectWifiCharacteristic - onWriteRequest - data: ' + data.toString() + ' offset: ' + offset);
  var thisObj = this;
  var result = this.RESULT_SUCCESS;
  this.wifiConnectData = data;

  var hostname = os.hostname();
  var wlanIFace = 'wlan0';
  if (hostname.toLowerCase() != 'chip') {
    wlanIFace = 'wlp2s0';
  }
  
  var wifiName = this.wifiConnectData.toString().split(/\r?\n/)[0];
  var wifiPassword = this.wifiConnectData.toString().split(/\r?\n/)[1];
  var cmd = "nmcli device wifi connect '" + wifiName + "' password '" + wifiPassword + "' ifname " + wlanIFace;
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

module.exports = NetworkConnectWifiCharacteristic;
