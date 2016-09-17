var util = require('util');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var DebugCharacteristic = function() {
	DebugCharacteristic.super_.call(this, {
    uuid: 'FB880902-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['notify'],
    value: null,
    descriptors: [
                  // User description
                  new Descriptor({
                    uuid: '2901',
                    value: 'Sends out debug information'
                  }),
                  // presentation format: 0x19=utf-8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
                  new Descriptor({
                    uuid: '2904',
                    value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
                  })
                ]
  });
  bleno.on('disconnect', this.disconnect.bind(this));
	
  this._updateValueCallback = null;
  this._interval = null;
  this._counter = 0;
};

util.inherits(DebugCharacteristic, BlenoCharacteristic);

DebugCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('DebugCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
  
  this._interval = setInterval(this.updatePunches.bind(this), 1000);
};

DebugCharacteristic.prototype.onUnsubscribe = function() {
  console.log('DebugCharacteristic - onUnsubscribe');
  clearInterval(this._interval);
  this._updateValueCallback = null;
};

DebugCharacteristic.prototype.updatePunches = function() {
	this._counter++;
	console.log('DebugCharacteristic - updatePunches ' + this._counter);
	var buf = new Buffer('Dbg: ' + this._counter.toString());
	this._updateValueCallback(buf);
}

DebugCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('DebugCharacteristic - disconnect');
	clearInterval(this._interval);
	this._updateValueCallback = null;
}



module.exports = DebugCharacteristic;
