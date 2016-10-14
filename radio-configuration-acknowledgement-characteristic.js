var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');

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
};

util.inherits(RadioConfigurationAcknowledgementCharacteristic, Characteristic);

RadioConfigurationAcknowledgementCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RadioConfigurationAcknowledgementCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getAcknowledgementRequested(function (status, ackReq) {
    console.log('RadioConfigurationAcknowledgementCharacteristic - onReadRequest:  status = "' + status + '" value = ' + (ackReq != null ? (ackReq ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS, new Buffer([ackReq ? 1 : 0]));
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

RadioConfigurationAcknowledgementCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('RadioConfigurationAcknowledgementCharacteristic - onWriteRequest');
  var thisObj = this;
  var ack = data[0] == 1;
  httphelper.setAcknowledgementRequested(ack, function(status, ackReq) {
    console.log('RadioConfigurationAcknowledgementCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (ackReq != null ? (ackReq ? 'True' : 'False') : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = RadioConfigurationAcknowledgementCharacteristic;
