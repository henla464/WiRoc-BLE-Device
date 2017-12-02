var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var MiscDeviceNameCharacteristic = function() {
	MiscDeviceNameCharacteristic.super_.call(this, {
    uuid: 'FB88090A-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: 'Get wiroc device name'
	}),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
	new Descriptor({
	uuid: '2904',
	value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
	})
     ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
  this.deviceName = null;
};

util.inherits(MiscDeviceNameCharacteristic, BlenoCharacteristic);

MiscDeviceNameCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscDeviceNameCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getWiRocDeviceName(function (status, deviceName) {
      console.log('MiscDeviceNameCharacteristic - onReadRequest: status = "' + status + '" value = ' + (deviceName != null ? deviceName : 'null'));
      thisObj.deviceName = new Buffer(deviceName, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.deviceName);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.settings == null || offset > thisObj.settings.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.deviceName = null;
    } else {
      var buf = this.deviceName.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


MiscDeviceNameCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('MiscDeviceNameCharacteristic - disconnect');
}

module.exports = MiscDeviceNameCharacteristic;
