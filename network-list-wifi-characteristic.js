var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');
var exec = require('child_process').exec;

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var NetworkListWifiCharacteristic = function() {
    this.wifiDataList = null;

	NetworkListWifiCharacteristic.super_.call(this, {
    uuid: 'F5EA6201-BCC5-4406-A981-89C6C5FC09CF',
    properties: ['read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Get list of Wifi networks in range'
      }),
      // presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });
};

util.inherits(NetworkListWifiCharacteristic, Characteristic);

NetworkListWifiCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('NetworkListWifiCharacteristic - onReadRequest');
  var thisObj = this;
  var result = this.RESULT_SUCCESS;
 
  if (offset == 0) {
    // Get new wifi list
//  console.log('NetworkListWifiCharacteristic - onReadRequest - offset 0');
    var cmd = 'nmcli -m multiline -f ssid,active,signal device wifi list';
    exec(cmd, function(error, stdout, stderr) {
//  console.log('NetworkListWifiCharacteristic - onReadRequest - stdout' + stdout);
      var wifiNetworks = stdout.split(/\r?\n/).slice(0,-1); // remove last empty element
      wifiNetworks = wifiNetworks.map(function(s) { return s.slice(40).trim() });
//  console.log('NetworkListWifiCharacteristic - onReadRequest - wifiNetworks' + wifiNetworks.join('\n'));
      thisObj.wifiDataList = new Buffer(wifiNetworks.join('\n'));
      callback(result, thisObj.wifiDataList);
    });
  } else {
    var data = null;
    if (thisObj.wifiDataList == null || offset > thisObj.wifiDataList.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.wifiDataList = null;
    } else {
//  console.log('NetworkListWifiCharacteristic - onReadRequest - stdout' + thisObj.wifiDataList.slice(offset).toString());
      data = thisObj.wifiDataList.slice(offset);
    }
    callback(result, data);
  }
};

module.exports = NetworkListWifiCharacteristic;
