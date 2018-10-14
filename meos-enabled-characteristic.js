var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MeosEnabledCharacteristic = function() {
	MeosEnabledCharacteristic.super_.call(this, {
    uuid: '6E30B301-BE1B-401C-8A6D-1A59D5C23C64',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Enable/Disable sending to Meos'
      }),
      // presentation format: 0x01=unsigned 1-bit (boolean), 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x01, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });
};

util.inherits(MeosEnabledCharacteristic, Characteristic);

MeosEnabledCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MeosEnabledCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getSendToMeosEnabled(function (status, enabled) {
    console.log('MeosEnabledCharacteristic - onReadRequest: status = "' + status + '" value = ' + (enabled != null ? (enabled ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS, new Buffer([enabled ? 1 : 0]));
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

MeosEnabledCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MeosEnabledCharacteristic - onWriteRequest');
  var thisObj = this;
  var enabled = data[0] == 1;
  httphelper.setSendToMeosEnabled(enabled, function(status, retEnabled) {
    console.log('MeosEnabledCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retEnabled != null ? (enabled ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = MeosEnabledCharacteristic;
