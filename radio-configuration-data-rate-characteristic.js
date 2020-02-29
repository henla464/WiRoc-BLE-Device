var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');

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
        value: ''  //Data rate, valid values: 146, 283, 586, 2148, 7032 bps
      }),
      // presentation format: 0x06=unsigned 16-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x06, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });

//  this._dataRate = new Buffer([74,2]);
};

util.inherits(RadioConfigurationDataRateCharacteristic, Characteristic);

RadioConfigurationDataRateCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RadioConfigurationDataRateCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getDataRate(function (status, dataRate) {
    console.log('RadioConfigurationDataRateCharacteristic - onReadRequest:  status = "' + status + '" value = ' + (dataRate != null ? dataRate : 'null'));
    var intDataRate = parseInt(dataRate);
    if (status == 'OK') {
      var buf = new Buffer(2);
      buf.writeUInt16LE(intDataRate);
      callback(thisObj.RESULT_SUCCESS, buf);  // dataRate & 0xFF, dataRate >> 8 ?
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

RadioConfigurationDataRateCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('RadioConfigurationDataRateCharacteristic - onWriteRequest');
  var thisObj = this;
  var intDataRate = data.readUInt16LE();
  httphelper.setDataRate(intDataRate, function(status, dataRate) {
    console.log('RadioConfigurationDataRateCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (dataRate != null ? dataRate : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = RadioConfigurationDataRateCharacteristic;
