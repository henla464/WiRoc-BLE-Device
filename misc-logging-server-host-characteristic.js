var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('@henla464/bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var MiscLoggingServerHostCharacteristic = function() {
	MiscLoggingServerHostCharacteristic.super_.call(this, {
    uuid: 'FB88090E-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: 'Get/set logging server host'
	}),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
	new Descriptor({
	uuid: '2904',
	value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
	})
     ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
  this.loggingServerHost = null;
};

util.inherits(MiscLoggingServerHostCharacteristic, BlenoCharacteristic);

MiscLoggingServerHostCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscLoggingServerHostCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getLoggingServerHost(function (status, loggingServerHost) {
      console.log('MiscLoggingServerHostCharacteristic - onReadRequest: status = "' + status + '" value = ' + (deviceName != null ? deviceName : 'null'));
      thisObj.loggingServerHost = new Buffer(loggingServerHost, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.loggingServerHost);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.loggingServerHost == null || offset > thisObj.loggingServerHost.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.loggingServerHost = null;
    } else {
      var buf = this.loggingServerHost.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


MeosEnabledCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MiscLoggingServerHostCharacteristic - onWriteRequest');
  var thisObj = this;
  var loggingServerHost = data.toString('utf-8')
  httphelper.setLoggingServerHost(ip, function(status, retLoggingServerHost) {
    console.log('MiscLoggingServerHostCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retLoggingServerHost != null ? retLoggingServerHost : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

MiscLoggingServerHostCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('MiscLoggingServerHostCharacteristic - disconnect');
}

module.exports = MiscLoggingServerHostCharacteristic;
