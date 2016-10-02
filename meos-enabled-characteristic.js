var util = require('util');
var bleno = require('bleno');

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

  this._enabled = new Buffer([0]);
  //this._updateValueCallback = null;
};

util.inherits(MeosEnabledCharacteristic, Characteristic);

MeosEnabledCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MeosEnabledCharacteristic - onReadRequest: value = ' + this._enabled.toString('hex'));
  callback(this.RESULT_SUCCESS, this._enabled);
};

MeosEnabledCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._enabled = data;

  console.log('MeosEnabledCharacteristic - onWriteRequest: value = ' + this._enabled.toString('hex'));

  //if (this._updateValueCallback) {
  //  console.log('EchoCharacteristic - onWriteRequest: notifying');
  //  this._updateValueCallback(this._value);
  //}

  callback(this.RESULT_SUCCESS);
};

module.exports = MeosEnabledCharacteristic;
