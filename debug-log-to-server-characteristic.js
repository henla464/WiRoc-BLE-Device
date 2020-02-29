var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DebugLogToServerCharacteristic = function() {
	DebugLogToServerCharacteristic.super_.call(this, {
    uuid: 'FB88090D-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: '' //Enable/Disable sending logs to server via http call
      }),
      // presentation format: 0x01=unsigned 1-bit (boolean), 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x01, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });
};

util.inherits(DebugLogToServerCharacteristic, Characteristic);

DebugLogToServerCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('DebugLogToServerCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getLogToServer(function (status, enabled) {
    console.log('DebugLogToServerCharacteristic - onReadRequest: status = "' + status + '" value = ' + (enabled != null ? (enabled ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS, new Buffer([enabled ? 1 : 0]));
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

DebugLogToServerCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('DebugLogToServerCharacteristic - onWriteRequest');
  var thisObj = this;
  var enabled = data[0] == 1;
  httphelper.setLogToServer(enabled, function(status, retEnabled) {
    console.log('DebugLogToServerCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retEnabled != null ? (enabled ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = DebugLogToServerCharacteristic;
