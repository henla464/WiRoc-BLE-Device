var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var RadioConfigurationRangeCharacteristic = function() {
	RadioConfigurationRangeCharacteristic.super_.call(this, {
    uuid: 'DC57FFAE-D960-4202-82FD-5492696B02F6',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Range, valid values: UL, XL, L, ML, MS, S'
      }),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
  this.range = null;
};

util.inherits(RadioConfigurationRangeCharacteristic, Characteristic);

RadioConfigurationRangeCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RadioConfigurationRangeCharacteristic - onReadRequest');
  var thisObj = this;
  if (offset == 0) {
    httphelper.getRange(function (status, range) {
      console.log('RadioConfigurationRangeCharacteristic - onReadRequest: status = "' + status + '" value = ' + (range != null ? range : 'null'));
      thisObj.range = new Buffer(range, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.range);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.range == null || offset > thisObj.range.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.range = null;
    } else {
      var buf = this.range.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};

RadioConfigurationRangeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('RadioConfigurationRangeCharacteristic - onWriteRequest');
  var thisObj = this;
  var range = data.toString('utf-8')
  httphelper.setRange(range, function(status, range) {
    console.log('RadioConfigurationDataRateCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (range != null ? range : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

RadioConfigurationRangeCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('RadioConfigurationRangeCharacteristic - disconnect');
}

module.exports = RadioConfigurationRangeCharacteristic;
