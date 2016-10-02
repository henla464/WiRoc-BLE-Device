var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MeosIPPortCharacteristic = function() {
	MeosIPPortCharacteristic.super_.call(this, {
    uuid: '6E30B303-BE1B-401C-8A6D-1A59D5C23C64',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Send to Meos IP port'
      }),
      // presentation format: 0x06=unsigned 16-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x06, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });

  this._ipport = new Buffer([0x10, 0x27]);
  //this._updateValueCallback = null;
};

util.inherits(MeosIPPortCharacteristic, Characteristic);

MeosIPPortCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MeosIPPortCharacteristic - onReadRequest: value = ' + this._ipport.toString('hex'));
  callback(this.RESULT_SUCCESS, this._ipport);
};

MeosIPPortCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._ipport = data;

  console.log('MeosIPPortCharacteristic - onWriteRequest: value = ' + this._ipport.toString('hex'));

  //if (this._updateValueCallback) {
  //  console.log('EchoCharacteristic - onWriteRequest: notifying');
  //  this._updateValueCallback(this._value);
  //}

  callback(this.RESULT_SUCCESS);
};

module.exports = MeosIPPortCharacteristic;
