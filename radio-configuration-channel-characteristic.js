var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');

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

//  this._channel = new Buffer([5]);
};

util.inherits(RadioConfigurationChannelCharacteristic, Characteristic);

RadioConfigurationChannelCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RadioConfigurationChannelCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getChannel(function (status, channel) {
    var intChannel = parseInt(channel);
    console.log('RadioConfigurationChannelCharacteristic - onReadRequest: status = "' + status + '" value = ' + (channel != null ? channel : 'null'));
    if (status == 'OK') {
      console.log('read channel success: ' + thisObj.RESULT_SUCCESS);
      callback(thisObj.RESULT_SUCCESS, new Buffer([intChannel]));
    } else {
      console.log('read channel fail: ' + this.RESULT_UNLIKELY_ERROR);
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

RadioConfigurationChannelCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('RadioConfigurationChannelCharacteristic - onWriteRequest');
  var thisObj = this;
  var channel = data[0];
  httphelper.setChannel(channel, function(status, retChannel) {
    console.log('RadioConfigurationChannelCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retChannel != null ? retChannel : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = RadioConfigurationChannelCharacteristic;
