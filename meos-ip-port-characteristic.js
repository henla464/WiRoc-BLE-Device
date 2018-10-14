var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MeosIPPortCharacteristic = function() {
	MeosIPPortCharacteristic.super_.call(this, {
    uuid: '6E30B303-BE1B-401C-8A6D-1A59D5C23C64',
    properties: ['read', 'write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Send to Meos IP port'
      }),
      // presentation format: 0x06=unsigned 16-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x06, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });

//  this._ipport = new Buffer([0x10, 0x27]);
};

util.inherits(MeosIPPortCharacteristic, Characteristic);

MeosIPPortCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MeosIPPortCharacteristic - onReadRequest');
  var thisObj = this;
  httphelper.getSendToMeosIPPort(function (status, port) {
    console.log('MeosIPPortCharacteristic - onReadRequest: status = "' + status + '" value = ' + (port != null ? port : 'null'));
    var intPort = parseInt(port);
    if (status == 'OK') {
      var buf = new Buffer(2);
      buf.writeUInt16LE(intPort);
      callback(thisObj.RESULT_SUCCESS, buf);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR, null);
    }
  });
};

MeosIPPortCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MeosIPPortCharacteristic - onWriteRequest');
  var thisObj = this;
  var ipPort = data.readUInt16LE();
  httphelper.setSendToMeosIPPort(ipPort, function(status, retIPPort) {
    console.log('MeosIPPortCharacteristic - onWriteRequest: status = "' + status + '" value = ' + (retIPPort != null ? retIPPort : 'null'));
    if (status == 'OK') {
      callback(thisObj.RESULT_SUCCESS);
    } else {
      callback(thisObj.RESULT_UNLIKELY_ERROR);
    }
  });
};

module.exports = MeosIPPortCharacteristic;
