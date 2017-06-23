var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MiscBatteryCharacteristic = function() {
	MiscBatteryCharacteristic.super_.call(this, {
    uuid: 'FB880908-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Is it charging'
      }),
      // presentation format: 0x01=unsigned 1-bit (boolean), 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x01, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
};

util.inherits(MiscBatteryCharacteristic, Characteristic);

MiscBatteryCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscBatteryCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getIsCharging(function (status, isCharging) {
    console.log('MiscBatteryCharacteristic - onReadRequest:  status = "' + status + '" value = ' + (isCharging != null ? (isCharging ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS, new Buffer([isCharging ? 1 : 0]));
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};


module.exports = MiscBatteryCharacteristic;
