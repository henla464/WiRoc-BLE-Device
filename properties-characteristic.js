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
  this._queuePropertyNameAndValueBuf = [];
};

util.inherits(PropertiesCharacteristic, BlenoCharacteristic);

PropertiesCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('PropertiesCharacteristic - onSubscribe - maxValueSize ' + maxValueSize);
  this._maxValue = maxValueSize;
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
  if (this._queuePropertyNameAndValueBuf.length == 0) {
    clearInterval(this._sendSingleFragmentInterval);
    this._sendSingleFragmentInterval = null;
    return;
  }

  var tmpBuf = this._queuePropertyNameAndValueBuf[0].slice(0,this._maxValue);
  console.log("properties fragment: " + tmpBuf.toString('utf8'));
  this._updateValueCallback(tmpBuf);
  if (this._queuePropertyNameAndValueBuf[0].length > this._maxValue) {
    this._queuePropertyNameAndValueBuf[0] = this._queuePropertyNameAndValueBuf[0].slice(this._maxValue)
  } else {
    if (this._queuePropertyNameAndValueBuf[0].length == this._maxValue) {
      var tmpBuf2 =  new Buffer(" ", "utf-8");
      console.log("properties fragment: (space)");
      this._updateValueCallback(tmpBuf2);
    }
    this._queuePropertyNameAndValueBuf.shift();
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
          thisObj._queuePropertyNameAndValueBuf.push(new Buffer(propertyNameAndValueString, "utf-8"));
          thisObj._sendSingleFragmentInterval = setInterval(thisObj.sendProperties.bind(thisObj), 50);
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
    var idx = propAndValue.indexOf('\t');
    var propName = propAndValue;
    var propValue = '';
    if (idx > 0) {
      propName = propAndValue.substring(0, idx);
      propValue = propAndValue.substring(idx+1);
    }
    if (propName == 'all') {
	if (propValue != null) {
            // the very first call will be to fetch 'all', this call should include
            // the chunklength ie. the number of bytes that can be sent at a time
            chunkLength = parseInt(propValue);
            console.log("chunklength: " + chunkLength);
            propValue = null;
        }
    }
    else if (propName == 'upgradewirocpython') {
        // Use helper function and then return instead of calling web service
        helper.upgradeWiRocPython(propName, propVal, callbackFunctionInitialized);
        return
    } 
    else if (propName == 'wirocdevicename') {
    	bleno.setDeviceName(propValue);
    }
                
    httphelper.getSetProperty(propName, propValue, callbackFunctionInitialized);
  });
};

module.exports = PropertiesCharacteristic;
