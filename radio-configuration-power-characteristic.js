var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var RadioConfigurationPowerCharacteristic = function() {
  RadioConfigurationPowerCharacteristic.super_.call(this, {
    uuid: 'DC57FFA8-D960-4202-82FD-5492696B02F6',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: ''  //Power between 1 and 7
      }),
      // presentation format: 0x04=unsigned 8-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
};

util.inherits(RadioConfigurationPowerCharacteristic, Characteristic);

RadioConfigurationPowerCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RadioConfigurationPowerCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getPower(function (status, power) {
    var intPower = parseInt(power);
    console.log('RadioConfigurationPowerCharacteristic - onReadRequest: status = "' + status + '" value = ' + (power != null ? power : 'null'));
    if (status == 'OK') {
      console.log('read power success: ' + thisObj.RESULT_SUCCESS);
      callback(thisObj.RESULT_SUCCESS, new Buffer([intPower]));
    } else {
      console.log('read power fail: ' + this.RESULT_UNLIKELY_ERROR);
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

RadioConfigurationPowerCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('RadioConfigurationPowerCharacteristic - onWriteRequest');
  var thisObj = this;
  var power = data[0];
  httphelper.setPower(power, function(status, retPower) {
    console.log('RadioConfigurationPowerCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retPower != null ? retPower : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = RadioConfigurationPowerCharacteristic;
