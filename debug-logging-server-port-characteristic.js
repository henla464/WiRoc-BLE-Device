var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('@henla464/bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var DebugLoggingServerPortCharacteristic = function() {
	DebugLoggingServerPortCharacteristic.super_.call(this, {
    uuid: 'FB88090F-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: '' //Get/set logging server Port
	}),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
	new Descriptor({
	uuid: '2904',
	value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
	})
     ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
  this.loggingServerPort = null;
};

util.inherits(DebugLoggingServerPortCharacteristic, BlenoCharacteristic);

DebugLoggingServerPortCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('DebugLoggingServerPortCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getLoggingServerPort(function (status, loggingServerPort) {
      console.log('DebugLoggingServerPortCharacteristic - onReadRequest: status = "' + status + '" value = ' + (deviceName != null ? deviceName : 'null'));
      thisObj.loggingServerPort = new Buffer(loggingServerPort, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.loggingServerPort);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.loggingServerPort == null || offset > thisObj.loggingServerPort.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.loggingServerPort = null;
    } else {
      var buf = this.loggingServerPort.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


DebugLoggingServerPortCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('DebugLoggingServerPortCharacteristic - onWriteRequest');
  var thisObj = this;
  var loggingServerPort = data.toString('utf-8')
  httphelper.setLoggingServerPort(ip, function(status, retLoggingServerPort) {
    console.log('DebugLoggingServerPortCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retLoggingServerPort != null ? retLoggingServerPort : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

DebugLoggingServerPortCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('DebugLoggingServerPortCharacteristic - disconnect');
}

module.exports = DebugLoggingServerPortCharacteristic;
