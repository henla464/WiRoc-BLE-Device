var util = require('util');
var bleno = require('bleno');
var httphelper = require('./http-helper');
var exec = require('child_process').exec;

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MiscStatusCharacteristic = function() {


  MiscStatusCharacteristic.super_.call(this, {
    uuid: 'FB880903-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Get status information'
      }),
      // presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });

  statusMsg = null;
};

util.inherits(MiscStatusCharacteristic, Characteristic);

MiscStatusCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscStatusCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    httphelper.getStatus(function (status, statusMsg) {
      console.log('MiscStatusCharacteristic - onReadRequest: status = "' + status + '" value = ' + (statusMsg != null ? statusMsg : 'null'));
      thisObj.statusMsg = new Buffer(statusMsg, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj.statusMsg);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj.statusMsg == null || offset > thisObj.statusMsg.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.statusMsg = null;
    } else {
      var buf = this.statusMsg.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};

module.exports = MiscStatusCharacteristic;
