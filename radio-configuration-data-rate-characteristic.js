var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var RadioConfigurationDataRateCharacteristic = function() {
	RadioConfigurationDataRateCharacteristic.super_.call(this, {
    uuid: 'DC57FFAD-D960-4202-82FD-5492696B02F6',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Data rate, valid values: 146, 283, 586, 2148, 7032 bps'
      }),
      // presentation format: 0x06=unsigned 16-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x06, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });

  this._dataRate = new Buffer([74,2]);
  //this._updateValueCallback = null;
};

util.inherits(RadioConfigurationDataRateCharacteristic, Characteristic);

RadioConfigurationDataRateCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RadioConfigurationDataRateCharacteristic - onReadRequest: value = ' + this._dataRate.toString('hex'));
  callback(this.RESULT_SUCCESS, this._dataRate);
};

RadioConfigurationDataRateCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._dataRate = data;

  console.log('RadioConfigurationDataRateCharacteristic - onWriteRequest: value = ' + this._dataRate.toString('hex'));

  //if (this._updateValueCallback) {
  //  console.log('EchoCharacteristic - onWriteRequest: notifying');
  //  this._updateValueCallback(this._value);
  //}

  callback(this.RESULT_SUCCESS);
};

module.exports = RadioConfigurationDataRateCharacteristic;
