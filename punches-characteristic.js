var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var PunchesCharacteristic = function() {
	PunchesCharacteristic.super_.call(this, {
    uuid: 'FB880901-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['notify'],
    value: null,
    descriptors: [
                  // User description
                  new Descriptor({
                    uuid: '2901',
                    value: 'Sends out the SI-Card number'
                  }),
                  // presentation format: 0x08=unsigned 32-bit, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
                  new Descriptor({
                    uuid: '2904',
                    value: new Buffer([0x08, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
                  })
                ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
	 
  this._updateValueCallback = null;
  this._interval = null;
  this._counter = 0;
};

util.inherits(PunchesCharacteristic, BlenoCharacteristic);

PunchesCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('PunchesCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
  
  this._interval = setInterval(this.updatePunches.bind(this), 1000);
};

PunchesCharacteristic.prototype.onUnsubscribe = function() {
  console.log('PunchesCharacteristic - onUnsubscribe');
  clearInterval(this._interval);
  this._updateValueCallback = null;
};

PunchesCharacteristic.prototype.updatePunches = function() {
	this._counter++;
	console.log('counter' + this._counter);
	var buf = new Buffer(4);
	buf.writeUInt32LE(this._counter);
	this._updateValueCallback(buf);
}

PunchesCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('PunchesCharacteristic - disconnect');
	clearInterval(this._interval);
	this._updateValueCallback = null;
}

module.exports = PunchesCharacteristic;
