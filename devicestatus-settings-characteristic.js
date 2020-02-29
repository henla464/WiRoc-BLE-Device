var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceStatusSettingsCharacteristic = function() {


  DeviceStatusSettingsCharacteristic.super_.call(this, {
    uuid: 'FB880904-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write', 'notify'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: '' //Get settings or change them
      }),
      // presentation format: 0x19=utf8 string, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
  this.settings = null;
};

util.inherits(DeviceStatusSettingsCharacteristic, Characteristic);

DeviceStatusSettingsCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var thisObj = this;
  if (offset == 0) {
    console.log('DeviceStatusSettingsCharacteristic - onReadRequest offset ' + offset);
    httphelper.getSettings(function (status, settings) {
      console.log('DeviceStatusSettingsCharacteristic - onReadRequest: status = "' + status + '" value = ' + (settings != null ? settings : 'null'));
      thisObj.settings = new Buffer(settings, "utf-8");
      console.log('DeviceStatusSettingsCharacteristic - onReadRequest: length = ' + thisObj.settings.length);
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.settings);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    var data = null;
    if (thisObj.settings == null || offset > thisObj.settings.length) {
      console.log('DeviceStatusSettingsCharacteristic - onReadRequest offset>length offset: ' + offset);
      result = thisObj.RESULT_INVALID_OFFSET;
      thisObj.settings = null;
    } else {
      console.log('DeviceStatusSettingsCharacteristic - onReadRequest offset ' + offset);
      var data = thisObj.settings.slice(offset);
      result = thisObj.RESULT_SUCCESS;
    }
    callback(result, data);
  }
};


DeviceStatusSettingsCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('DeviceStatusSettingsCharacteristic - onWriteRequest');
  var thisObj = this;
  var keyAndValue = data.toString('utf-8');
  httphelper.setSetting(keyAndValue, function(status, retSetting) {
    console.log('DeviceStatusSettingsCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retSetting != null ? retSetting : 'null'));
    if (status == 'OK') {
      var keyAndValueArr = keyAndValue.split(';');
      if (keyAndValueArr[0] == 'WiRocDeviceName') {
         bleno.setDeviceName(keyAndValueArr[1]);
      }
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};



DeviceStatusSettingsCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('DeviceStatusSettingsCharacteristic - onSubscribe - maxValueSize ' + maxValueSize + ' ' + updateValueCallback);
  this._maxValue = Math.min(20, maxValueSize);
  this._updateValueCallback = updateValueCallback;
  var thisObj = this;

  httphelper.getSettings(function (status, settings) {
      console.log('DeviceStatusSettingsCharacteristic - onSubscribe: status = "' + status + '" value = ' + (settings != null ? settings : 'null'));
      if (status == 'OK') {
        var settingsBuf = new Buffer(settings, "utf-8");
        console.log('DeviceStatusSettingsCharacteristic - onSubscribe: settings length = ' + settingsBuf.length);
	for(var i = 0; i < settingsBuf.length; i+= thisObj._maxValue) {
      		var tmpBuf = settingsBuf.slice(i,i+thisObj._maxValue);
		thisObj._updateValueCallback(tmpBuf);
	}
	if (settingsBuf.length % thisObj._maxValue == 0) { // send space at end to indicate end of transmission if last transmission is full length
		var tmpBuf2 =  new Buffer(" ", "utf-8");
		thisObj._updateValueCallback(tmpBuf2);
	}
      } else {
        console.log('DeviceStatusSettingsCharacteristic - onSubscribe: error status= ' + status);
      }
    });

};

DeviceStatusSettingsCharacteristic.prototype.onUnsubscribe = function() {
  console.log('DeviceStatusSettingsCharacteristic - onUnsubscribe');
  this.disconnect();
};


DeviceStatusSettingsCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('DeviceStatusSettingsCharacteristic - disconnect');
	this._updateValueCallback = null;
}

module.exports = DeviceStatusSettingsCharacteristic;
