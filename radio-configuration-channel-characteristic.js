var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var RadioConfigurationChannelCharacteristic = function() {
  RadioConfigurationChannelCharacteristic.super_.call(this, {
    uuid: 'DC57FFAB-D960-4202-82FD-5492696B02F6',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Radio channel between 0 and 9'
      }),
      // presentation format: 0x04=unsigned 8-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });

  this._channel = new Buffer([5]);
  //this._updateValueCallback = null;
};

util.inherits(RadioConfigurationChannelCharacteristic, Characteristic);

RadioConfigurationChannelCharacteristic.prototype.onReadRequest = function(offset, callback) {
//  var channel = this._channel;
  console.log(this._channel);
  callback(this.RESULT_SUCCESS, this._channel);
};

RadioConfigurationChannelCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._channel = data;

  console.log('RadioConfigurationChannelCharacteristic - onWriteRequest: value = ' + this._channel.toString('hex'));

  //if (this._updateValueCallback) {
  //  console.log('EchoCharacteristic - onWriteRequest: notifying');
  //  this._updateValueCallback(this._value);
  //}

  callback(this.RESULT_SUCCESS);
};

module.exports = RadioConfigurationChannelCharacteristic;