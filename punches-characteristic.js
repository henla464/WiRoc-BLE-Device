var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('@henla464/bleno');

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
	  value: 'Sends out the punch data'
	}),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
	new Descriptor({
	uuid: '2904',
	value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
	})
     ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
	 
  this._updateValueCallback = null;
  this._interval = null;
  this._maxValue = 20;
};

util.inherits(PunchesCharacteristic, BlenoCharacteristic);

PunchesCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('PunchesCharacteristic - onSubscribe - maxValueSize ' + maxValueSize + ' ' + updateValueCallback);
  var thisObj = this;
  var propName = 'sendtoblenoenabled';
  var propValue = '1';
  httphelper.getSetProperty(propName, propValue, function(status, propertyNameAndValue) {
      if (status == 'OK') {
	console.log('sendtoblenoenabled OK');
      } else {
        console.log('sendtoblenoenabled Error');
      }
  });
  this._maxValue = maxValueSize;
  this._updateValueCallback = updateValueCallback;
  this._interval = setInterval(this.updatePunches.bind(this), 2000);
};

PunchesCharacteristic.prototype.onUnsubscribe = function() {
  console.log('PunchesCharacteristic - onUnsubscribe');
  this.disconnect();
};

PunchesCharacteristic.prototype.updatePunches = function() {
  console.log('PunchesCharacteristic - updatePunches');
  var thisObj = this;
  httphelper.getSetProperty('punches', null, function(status, propertyNameAndValue) {
    var punches = propertyNameAndValue.substring('punches'.length+1);
    console.log('PunchesCharacteristic - status = "' + status + '" punches = ' + (punches != null ? punches : 'null'));
    if (status == 'OK') {
      if (thisObj._updateValueCallback != null) {
        punchesBuf =  new Buffer(punches, "utf-8");
	if (punchesBuf.length < 20) {
	  return; // no punches to return
	}
	for(var i = 0; i < punchesBuf.length; i+= thisObj._maxValue) {
	  var tmpBuf = punchesBuf.slice(i,i+thisObj._maxValue);
	  thisObj._updateValueCallback(tmpBuf);
	}
	if (punchesBuf.length % thisObj._maxValue == 0) { // send space at end to indicate end of transmission if last transmission is full length
	  var tmpBuf2 =  new Buffer(" ", "utf-8");
	  thisObj._updateValueCallback(tmpBuf2);
	}
      }
    } else {
      console.log('Error status != OK');
    }
  });
}

PunchesCharacteristic.prototype.disconnect = function(clientAddress) {
  console.log('PunchesCharacteristic - disconnect');
  clearInterval(this._interval);
  this._updateValueCallback = null;
  var thisObj = this;
  var propName = 'sendtoblenoenabled';
  var propValue = '0';
  httphelper.getSetProperty(propName, propValue, function(status, propertyNameAndValue) {
    if (status == 'OK') {
      console.log('sendtoblenoenabled Disabled OK');
    } else {
      console.log('sendtoblenoenabled Disabled Error');
    }
  });	
}

module.exports = PunchesCharacteristic;
