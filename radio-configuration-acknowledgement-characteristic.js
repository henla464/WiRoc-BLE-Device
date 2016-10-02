var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var RadioConfigurationAcknowledgementCharacteristic = function() {
	RadioConfigurationAcknowledgementCharacteristic.super_.call(this, {
    uuid: 'DC57FFAC-D960-4202-82FD-5492696B02F6',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Request WiRoc receiver to acknowledge received messages'
      }),
      // presentation format: 0x01=unsigned 1-bit (boolean), 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x01, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });

  this._acknowledge = new Buffer([1]);
  //this._updateValueCallback = null;
};

util.inherits(RadioConfigurationAcknowledgementCharacteristic, Characteristic);

RadioConfigurationAcknowledgementCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log(this._acknowledge);
  callback(this.RESULT_SUCCESS, this._acknowledge);
};

RadioConfigurationAcknowledgementCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._acknowledge = data;

  console.log('RadioConfigurationAcknowledgementCharacteristic - onWriteRequest: value = ' + this._acknowledge.toString('hex'));

  //if (this._updateValueCallback) {
  //  console.log('EchoCharacteristic - onWriteRequest: notifying');
  //  this._updateValueCallback(this._value);
  //}

  callback(this.RESULT_SUCCESS);
};

module.exports = RadioConfigurationAcknowledgementCharacteristic;
