var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('@henla464/bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var DeviceStatusDeviceNameCharacteristic = function() {
	DeviceStatusDeviceNameCharacteristic.super_.call(this, {
    uuid: 'FB88090A-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: '' //Get/set wiroc device name
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

util.inherits(DeviceStatusDeviceNameCharacteristic, BlenoCharacteristic);

DeviceStatusDeviceNameCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('DeviceStatusDeviceNameCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getWiRocDeviceName(function (status, deviceName) {
      console.log('DeviceStatusDeviceNameCharacteristic - onReadRequest: status = "' + status + '" value = ' + (deviceName != null ? deviceName : 'null'));
      if (deviceName == null) {
        thisObj.deviceName = new Buffer("WiRoc Device", "utf-8");
      } else {
        thisObj.deviceName = new Buffer(deviceName, "utf-8");
      }
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.deviceName);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.deviceName == null || offset > thisObj.deviceName.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.deviceName = null;
    } else {
      var buf = this.deviceName.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


DeviceStatusDeviceNameCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('DeviceStatusDeviceNameCharacteristic - onWriteRequest');
  var thisObj = this;
  var deviceName = data.toString('utf-8')
  httphelper.setWiRocDeviceName(deviceName, function(status, retDeviceName) {
    console.log('DeviceStatusDeviceNameCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retDeviceName != null ? retDeviceName : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

DeviceStatusDeviceNameCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('DeviceStatusDeviceNameCharacteristic - disconnect');
}

module.exports = DeviceStatusDeviceNameCharacteristic;
