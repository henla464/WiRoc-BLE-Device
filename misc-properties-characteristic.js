var util = require('util');
var httphelper = require('./http-helper');


var bleno = require('@henla464/bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var PropertiesCharacteristic = function() {
	PropertiesCharacteristic.super_.call(this, {
    uuid: 'FB880912-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['notify', 'write'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: 'Write a new property value, or read one'
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
  this._maxValue = 20;
  this._propertyNameAndValuesToWriteArr = [];
  this._propertyNameAndValuesReadArr = [];
};

util.inherits(PropertiesCharacteristic, BlenoCharacteristic);

PropertiesCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('PropertiesCharacteristic - onSubscribe - maxValueSize ' + maxValueSize);
  this._maxValue = Math.min(20, maxValueSize);
  this._updateValueCallback = updateValueCallback;
};

PropertiesCharacteristic.prototype.onUnsubscribe = function() {
  console.log('PropertiesCharacteristic - onUnsubscribe');
  this.disconnect();
};

PropertiesCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('PropertiesCharacteristic - disconnect');
};

PropertiesCharacteristic.prototype.sendProperties = function() {
  if (this._propertyNameAndValueBuf == null) {
    return;
  }

  var tmpBuf = this._propertyNameAndValueBuf.slice(0,this._maxValue);
  console.log("properties fragment: " + tmpBuf.toString('utf8'));
  this._updateValueCallback(tmpBuf);
  if (this._propertyNameAndValueBuf.length > this._maxValue) {
    this._propertyNameAndValueBuf = this._propertyNameAndValueBuf.slice(this._maxValue)
  } else {
    if (this._propertyNameAndValueBuf.length == this._maxValue) {
      var tmpBuf2 =  new Buffer(" ", "utf-8");
      console.log("properties fragment: (space)");
      this._updateValueCallback(tmpBuf2);
    }
    clearInterval(this._sendSingleFragmentInterval);
    this._sendSingleFragmentInterval = null;
    this._propertyNameAndValueBuf = null;
  }
};

PropertiesCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('PropertiesCharacteristic - onWriteRequest');
  // extend the array or properties to read or write
  var propertyNameAndValues = data.toString('utf-8');
  var thisFnCallPropertyNameAndValuesToWriteArr = propertyNameAndValues.split('|');
  this._propertyNameAndValuesToWriteArr.push.apply(this._propertyNameAndValuesToWriteArr, propertyNameAndValues.split('|'));

  function callbackFunction(thisObj) {
    return function(status, propertyNameAndValue) {
      if (status == 'OK') {
	thisObj._propertyNameAndValuesReadArr.push(propertyNameAndValue);
        if (thisObj._propertyNameAndValuesReadArr.length >= thisObj._propertyNameAndValuesToWriteArr.length) {
          // We have read/written all properties and received response back.
          // => notify
          var propertyNameAndValueString = thisObj._propertyNameAndValuesReadArr.join('|');
          thisObj._propertyNameAndValuesReadArr = [];
          thisObj._propertyNameAndValuesToWriteArr = [];
          // block if transfer in progress?
          //for (;thisObj._sendSingleFragmentInterval != null;) {}
          thisObj._propertyNameAndValueBuf = new Buffer(propertyNameAndValueString, "utf-8");
          thisObj._sendSingleFragmentInterval = setInterval(thisObj.sendProperties.bind(thisObj), 250);
          callback(thisObj.RESULT_SUCCESS);
        }
      } else {
          callback(thisObj.RESULT_UNLIKELY_ERROR);
      }
    };
  };
  var callbackFunctionInitialized = callbackFunction(this);

  thisFnCallPropertyNameAndValuesToWriteArr.forEach(propAndValue => {
    console.log(propAndValue);
    propAndValArr = propAndValue.split(';');
    var propName = propAndValArr[0];
    var propValue = propAndValArr[1];
    httphelper.getSetProperty(propName, propValue, callbackFunctionInitialized);
  });
  //callback(this.RESULT_SUCCESS);
};

module.exports = PropertiesCharacteristic;
