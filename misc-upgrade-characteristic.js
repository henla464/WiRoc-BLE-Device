var util = require('util');
var bleno = require('@henla464/bleno');
var helper = require('./helper');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MiscUpgradeCharacteristic = function() {


  MiscUpgradeCharacteristic.super_.call(this, {
    uuid: 'FB88090C-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['write','read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Upgrade wirocpython or wirocble'
      }),
      // presentation format: 0x19=utf8 string, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
  this.versions = null;
};

util.inherits(MiscUpgradeCharacteristic, Characteristic);


MiscUpgradeCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscUpgradeCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getVersions(function (status, versions) {
      console.log('MiscUpgradeCharacteristic - onReadRequest: status = "' + status + '" value = ' + (versions != null ? versions : 'null'));
      thisObj.versions = new Buffer(versions, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.versions);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.versions == null || offset > thisObj.versions.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.versions = null;
    } else {
      var buf = this.versions.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


MiscUpgradeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MiscUpgradeCharacteristic - onWriteRequest');
  var thisObj = this;
  var typeAndVersion = data.toString('utf-8')
  var typeAndVersionArr = typeAndVersion.split(";");
  if (typeAndVersionArr[0] == "wirocpython") {
    console.log('MiscUpgradeCharacteristic - wirocpython, version: ' + typeAndVersionArr[1]);
    helper.upgradeWiRocPython(typeAndVersionArr[1], function (status) {
      if (status == "OK") {
        callback(thisObj.RESULT_SUCCESS);
      }
    });
  } else if (typeAndVersionArr[0] == "wirocble") {
    console.log('MiscUpgradeCharacteristic - wirocble, version: ' + typeAndVersionArr[1]);
    helper.upgradeWiRocBLE(typeAndVersionArr[1], function (status) {
      if (status == "OK") {
        callback(thisObj.RESULT_SUCCESS);
      }
    });
  }
  callback(thisObj.RESULT_UNLIKELY_ERROR);
};

module.exports = MiscUpgradeCharacteristic;
