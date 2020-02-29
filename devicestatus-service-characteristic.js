var util = require('util');
var bleno = require('@henla464/bleno');
var exec = require('child_process').exec;

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceStatusServiceCharacteristic = function() {


  DeviceStatusServiceCharacteristic.super_.call(this, {
    uuid: 'FB880905-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: '' //Get service status
      }),
      // presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });

  _statusServices = [];
  _statusServiceBuffer = null;
};

util.inherits(DeviceStatusServiceCharacteristic, Characteristic);

DeviceStatusServiceCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('DeviceStatusServiceCharacteristic - onReadRequest offset ' + offset);
  var thisObj = this;
  if (offset == 0) {
    thisObj._statusServices = [];
    thisObj._statusServiceBuffer = null;
    var cmd = "systemctl is-active WiRocPython.service";
    exec(cmd, function(error, stdout, stderr) {
      thisObj._statusServices.push({ Name: 'WiRocPython', Status: stdout.trim('\n') });
      var cmd = "systemctl is-active WiRocPythonWS.service";
      exec(cmd, function(error, stdout, stderr) {
        thisObj._statusServices.push({ Name: 'WiRocPythonWS', Status: stdout.trim('\n') });
        var cmd = "systemctl is-active blink.service";
        exec(cmd, function(error, stdout, stderr) {
           thisObj._statusServices.push({ Name: 'WiRocMonitor', Status: stdout.trim('\n') });
           jsonStr = JSON.stringify({ services: thisObj._statusServices });
           thisObj._statusServiceBuffer = new Buffer(jsonStr, "utf-8");
           console.log(jsonStr);
           callback(thisObj.RESULT_SUCCESS, thisObj._statusServiceBuffer);
        });
      });
    });
  } else {
    if (thisObj._statusServiceBuffer == null || offset > thisObj._statusServiceBuffer.length) {
      result = this.RESULT_INVALID_OFFSET;
      this._statusServices = [];
      this._statusServiceBuffer = null;
    } else {
      var buf = this._statusServiceBuffer.slice(offset);
      callback(this.RESULT_SUCCESS, buf);
    }
  }
};

module.exports = DeviceStatusServiceCharacteristic;
