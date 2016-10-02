var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
    uuid: '2A19',
    properties: ['read'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Battery level between 0 and 100 percent'
      }),
      // presentation format: 0x04=unsigned 8-bit, 0x01=exponent 1, 0xAD 0x27=percentage, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0xAD, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
};

util.inherits(BatteryLevelCharacteristic, Characteristic);

BatteryLevelCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var percent = '100';
  console.log('Battery level - onReadRequest: value (dec)= ' + percent);
  percent = parseInt(percent, 10);
  callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

module.exports = BatteryLevelCharacteristic;
