var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MiscSettingsCharacteristic = function() {


  MiscSettingsCharacteristic.super_.call(this, {
    uuid: 'FB880904-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Get settings or change them'
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

util.inherits(MiscSettingsCharacteristic, Characteristic);

MiscSettingsCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscSettingsCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getSettings(function (status, settings) {
      console.log('MiscSettingsCharacteristic - onReadRequest: status = "' + status + '" value = ' + (settings != null ? settings : 'null'));
      thisObj.settings = new Buffer(settings, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.settings);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    var data = null;
    if (thisObj.settings == null || offset > thisObj.settings.length) {
      result = thisObj.RESULT_INVALID_OFFSET;
      thisObj.settings = null;
    } else {
      var data = this.settings.slice(offset);
      result = thisObj.RESULT_SUCCESS;
    }
    callback(result, data);
  }
};


MiscSettingsCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MiscSettingsCharacteristic - onWriteRequest');
  var thisObj = this;
  var keyAndValue = data.toString('utf-8');
  httphelper.setSetting(keyAndValue, function(status, retSetting) {
    console.log('MiscSettingsCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retSetting != null ? retSetting : 'null'));
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

module.exports = MiscSettingsCharacteristic;
