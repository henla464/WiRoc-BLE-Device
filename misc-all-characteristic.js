var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('@henla464/bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var MiscAllCharacteristic = function() {
	MiscAllCharacteristic.super_.call(this, {
    uuid: 'FB880909-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: 'Get all settings'
	}),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
	new Descriptor({
	uuid: '2904',
	value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
	})
     ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
  this.settings = null;
};

util.inherits(MiscAllCharacteristic, BlenoCharacteristic);

MiscAllCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscAllCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getAll(function (status, settings) {
      console.log('MiscAllCharacteristic - onReadRequest: status = "' + status + '" value = ' + (settings != null ? settings : 'null'));
      thisObj.settings = new Buffer(settings, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.settings);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.settings == null || offset > thisObj.settings.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.settings = null;
    } else {
      var buf = this.settings.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


MiscAllCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('MiscAllCharacteristic - disconnect');
}

module.exports = MiscAllCharacteristic;
