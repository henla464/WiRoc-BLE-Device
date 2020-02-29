var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MeosIPCharacteristic = function() {


  MeosIPCharacteristic.super_.call(this, {
    uuid: '6E30B302-BE1B-401C-8A6D-1A59D5C23C64',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: ''  //IP address for sending to Meos
      }),
      // presentation format: 0x19=utf8 string, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
 // this._ip = new Buffer([0x31,0x39,0x32,0x2E,0x31,0x36,0x38,0x2E,0x30,0x2E,0x32]); // 192.168.0.2
};

util.inherits(MeosIPCharacteristic, Characteristic);

MeosIPCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MeosIPCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getSendToMeosIP(function (status, ip) {
    console.log('MeosIPCharacteristic - onReadRequest: status = "' + status + '" value = ' + (ip != null ? ip : 'null'));
    var buf = new Buffer(ip, "utf-8");
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS, buf);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

MeosIPCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MeosIPCharacteristic - onWriteRequest');
  var thisObj = this;
  var ip = data.toString('utf-8')
  httphelper.setSendToMeosIP(ip, function(status, retIP) {
    console.log('MeosIPCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retIP != null ? retIP : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = MeosIPCharacteristic;
