var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');
var helper = require('./helper');
var exec = require('child_process').exec;

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var NetworkIPCharacteristic = function() {


  NetworkIPCharacteristic.super_.call(this, {
    uuid: 'F5EA6204-BCC5-4406-A981-89C6C5FC09CF',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Get the ip address or req new DHCP ip address'
      }),
      // presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
      })
    ]
  });

  ipAddress = null;
};

util.inherits(NetworkIPCharacteristic, Characteristic);

NetworkIPCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('NetworkIPCharacteristic - onReadRequest');
  var thisObj = this;
  if (offset == 0) {
    helper.getIP(function(code, data) {
      if (code != 'OK') {
        callback(thisObj.RESULT_UNLIKELY_ERROR);
        return;
      }
      thisObj.ipAddress = new Buffer(data, "utf-8");
      callback(thisObj.RESULT_SUCCESS, thisObj.ipAddress);
    });
 } else {
    if (thisObj.ipAddress == null || offset > thisObj.ipAddress.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj.ipAddress = null;
    } else {
      var buf = this.ipAddress.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};


NetworkIPCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('NetworkIPCharacteristic - onWriteRequest - data: ' + data.toString() + ' offset: ' + offset);
  var thisObj = this;
  var result = this.RESULT_SUCCESS;

  var cmd = "nmcli -m multiline -f device,type device status";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
     if (error) {
       console.log('error code: "' + error + '"');
       console.log(stderr);
       callback(thisObj.RESULT_UNLIKELY_ERROR);
     }
     var devices = stdout.split(/\r?\n/).slice(0,-1); // remove last empty element
     devices = devices.map(function(s) { return s.slice(40).trim() });
     for (var i = 0; i < devices.length; i+=2) {
       var iface = devices[i];
       var ifaceNetworkType = devices[i+1];
       if (data.toString() == ifaceNetworkType){
         var cmd2 = "dhclient -v -1 " + iface + "";
         console.log(cmd2);
         exec(cmd2, function(error2, stdout2, stderr2) {
           if (error2) {
             console.log('error code: "' + error2 + '"');
             console.log(stderr2);
           }
           console.log(stdout2);
         });
         callback(result);
       }
     }
     callback(thisObj.RESULT_UNLIKELY_ERROR);
  });

};

module.exports = NetworkIPCharacteristic;
