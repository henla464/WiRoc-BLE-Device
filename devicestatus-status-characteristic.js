var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');
var exec = require('child_process').exec;

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MiscStatusCharacteristic = function() {


  MiscStatusCharacteristic.super_.call(this, {
    uuid: 'FB880903-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read', 'write'],
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
  if (thisObj.statusMsg == null || offset > thisObj.statusMsg.length) {
    result = this.RESULT_INVALID_OFFSET;
    thisObj.statusMsg = null;
  } else {
    var buf = this.statusMsg.slice(offset);
    callback(thisObj.RESULT_SUCCESS, buf);
  }
};


MiscStatusCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MiscStatusCharacteristic - onWriteRequest');
  var thisObj = this;
  var offsetToUseStr = data.toString('utf-8');
  var offsetToUse = parseInt(offsetToUseStr);
  if (offsetToUse == 0) {
    httphelper.getStatus(function (status, statusMsg) {
      console.log('MiscStatusCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (statusMsg != null ? statusMsg : 'null'));
      thisObj.statusMsg = new Buffer(statusMsg, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR);
      }
    });
  } else {
    if (offsetToUse <= this.statusMsg.length) {
      this.statusMsg = this.statusMsg.slice(offsetToUse);
      callback(thisObj.RESULT_SUCCESS);
    } else {
      this.statusMsg = null;
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  }
};

module.exports = MiscStatusCharacteristic;
