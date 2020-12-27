var util = require('util');
var httphelper = require('./http-helper');
var helper = require('./helper');

var bleno = require('@henla464/bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var CommandCharacteristic = function() {
	CommandCharacteristic.super_.call(this, {
    uuid: 'FB880913-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['notify', 'write'],
    value: null,
    descriptors: [
	// User description
	new Descriptor({
	  uuid: '2901',
	  value: 'Execute a command'
	}),
	// presentation format: 0x19=utf8, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
	new Descriptor({
	uuid: '2904',
	value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00])
	})
     ]
  });

  bleno.on('disconnect', this.disconnect.bind(this));
  this._commandNameAndResponse = null;
  this._updateValueCallback = null;
  this._maxValue = 20;
};

util.inherits(CommandCharacteristic, BlenoCharacteristic);

CommandCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('CommandCharacteristic - onSubscribe - maxValueSize ' + maxValueSize);
  this._maxValue = maxValueSize;
  this._updateValueCallback = updateValueCallback;
};

CommandCharacteristic.prototype.onUnsubscribe = function() {
  console.log('CommandCharacteristic - onUnsubscribe');
  this.disconnect();
};

CommandCharacteristic.prototype.disconnect = function(clientAddress) {
  console.log('CommandCharacteristic - disconnect');
};

CommandCharacteristic.prototype.sendCommandResponse = function() {
  if (this._commandNameAndResponse == null) {
    return;
  }

  var tmpBuf = this._commandNameAndResponse.slice(0,this._maxValue);
  console.log("Command fragment: " + tmpBuf.toString('utf8'));
  this._updateValueCallback(tmpBuf);
  if (this._commandNameAndResponse.length > this._maxValue) {
    this._commandNameAndResponse = this._commandNameAndResponse.slice(this._maxValue)
  } else {
    if (this._commandNameAndResponse.length == this._maxValue) {
      var tmpBuf2 =  new Buffer(" ", "utf-8");
      console.log("Command fragment: (space)");
      this._updateValueCallback(tmpBuf2);
    }
    clearInterval(this._sendSingleFragmentInterval);
    this._sendSingleFragmentInterval = null;
    this._commandNameAndResponse = null;
  }
};

CommandCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('CommandCharacteristic - onWriteRequest');
  this._commandNameAndData = data.toString('utf-8');

  function callbackFunction(thisObj) {
    return function(status, commandNameAndResponse) {
      if (status == 'OK') {
        // We have written the command and received them back.
        // => notify
        thisObj._commandNameAndResponse = new Buffer(commandNameAndResponse, "utf-8");
        thisObj._sendSingleFragmentInterval = setInterval(thisObj.sendCommandResponse.bind(thisObj), 100);
        callback(thisObj.RESULT_SUCCESS);
      } else {
          callback(thisObj.RESULT_UNLIKELY_ERROR);
      }
    };
  };
  var callbackFunctionInitialized = callbackFunction(this);

  console.log(this._commandNameAndData);
  var cmdAndValueArr = this._commandNameAndData.split(';');
  var commandName = cmdAndValueArr[0];
  var commandValue = null;
  if (cmdAndValueArr.length > 1) {
    commandValue = cmdAndValueArr[1];
  }

  switch(commandName) {
    case 'listwifi':
      helper.getListWifi(commandName, callbackFunctionInitialized);
      break;
    case 'connectwifi':
      helper.connectWifi(commandName, commandValue, callbackFunctionInitialized);
      break;
    case 'disconnectwifi':
      helper.disconnectWifi(commandName, callbackFunctionInitialized);
      break;
    case 'getip':
      helper.getIP(commandName, callbackFunctionInitialized);
      break;
    case 'renewip':
      helper.renewIP(commandName, commandValue, callbackFunctionInitialized);
      break;
    case 'getservices':
      helper.getServices(commandName, callbackFunctionInitialized);
      break;
    case 'dropalltables':
      helper.dropAllTables(commandName, callbackFunctionInitialized);
      break;
    case 'uploadlogarchive':
      helper.uploadLogArchive(commandName, callbackFunctionInitialized);
      break;
    case 'upgradewirocpython':
      helper.upgradeWiRocPython(commandName, commandValue, callbackFunctionInitialized);
      break;
    case 'upgradewirocble':
      helper.upgradeWiRocBLE(commandName, commandValue, callbackFunctionInitialized);
      break;
    case 'getall':
      helper.getAll(commandName, callbackFunctionInitialized);
      break;
    case 'batterylevel':
      helper.getBatteryLevel(commandName, callbackFunctionInitialized);
      break;
  }
};

module.exports = CommandCharacteristic;
