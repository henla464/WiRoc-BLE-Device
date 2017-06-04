var util = require('util');
var httphelper = require('./http-helper');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var MiscTestPunchesCharacteristic = function() {
	MiscTestPunchesCharacteristic.super_.call(this, {
    uuid: 'FB880907-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['notify','read', 'write'],
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
  this._sendSingleFragmentInterval = null;
  this._maxValue = 20;

  this._testPunchesRead = null;

  this._addPunchInterval = null;
  this._testBatchGuid = null;
  this._noOfPunchesAdded = 0;
  this._noOfPunchesToAdd = 0;
  this._siNo = "123456789";
  this._punchesBuf = null;
  this._shouldStopSending = false;
  this._ackReq = false;
};

util.inherits(MiscTestPunchesCharacteristic, BlenoCharacteristic);

MiscTestPunchesCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('MiscTestPunchesCharacteristic - onSubscribe - maxValueSize ' + maxValueSize);
  this._maxValue = Math.min(20, maxValueSize);
  this._updateValueCallback = updateValueCallback;
  this._interval = setInterval(this.updatePunches.bind(this), 3000);
  this._sendSingleFragmentInterval = setInterval(this.singleUpdatePunchesCall.bind(this), 200);
};

MiscTestPunchesCharacteristic.prototype.onUnsubscribe = function() {
  console.log('MiscTestPunchesCharacteristic - onUnsubscribe');
  this.disconnect();
};

MiscTestPunchesCharacteristic.prototype.singleUpdatePunchesCall = function() {
	//console.log("singleUpdatePunchesCall");
	if (this._punchesBuf == null) {
		return;
	} 
	var tmpBuf = this._punchesBuf.slice(0,this._maxValue);
	console.log("punches fragment: " + tmpBuf.toString('utf8'));
	this._updateValueCallback(tmpBuf);
	if (this._punchesBuf.length > this._maxValue) {
		this._punchesBuf = this._punchesBuf.slice(this._maxValue)
	} else {
		if (this._punchesBuf.length == this._maxValue) {
			var tmpBuf2 =  new Buffer(" ", "utf-8");
			console.log("punches fragment: (space)");
			this._updateValueCallback(tmpBuf2);
		}
		this._punchesBuf = null;
		if (this._shouldStopSending) {
			clearInterval(this._sendSingleFragmentInterval);
			this._sendSingleFragmentInterval = null;
		}
	}
}

MiscTestPunchesCharacteristic.prototype.updatePunches = function() {
    console.log('MiscTestPunchesCharacteristic - updatePunches');
    var includeAll = false;
    var thisObj = this;
    httphelper.getTestPunches(thisObj._testBatchGuid, includeAll, function (status, punches) {
      console.log('MiscTestPunchesCharacteristic - status = "' + status + '" punches = ' + (punches != null ? punches : 'null'));
      if (status == 'OK') {
	if (thisObj._updateValueCallback != null && thisObj._punchesBuf == null) {  // check that we should send, and that previous data has been sent
		tmpPunchesBuf =  new Buffer(punches, "utf-8");
		if (tmpPunchesBuf.length < 20) {
			console.log("updatePunches 2");
			return; // no test punches to return, too short
		}
		thisObj._punchesBuf = tmpPunchesBuf;
	}
      } else {
        console.log('Error status != OK');
      }
    });
}

MiscTestPunchesCharacteristic.prototype.disconnect = function(clientAddress) {
	console.log('MiscTestPunchesCharacteristic - disconnect');
	clearInterval(this._interval);
	this._interval = null;
	clearInterval(this._addPunchInterval);
        this._addPunchInterval = null;
	//this._updateValueCallback = null;
	this._shouldStopSending = true;
}

MiscTestPunchesCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('MiscTestPunchesCharacteristic - onReadRequest');
  var includeAll = true;
  var thisObj = this;
  if (offset == 0) {
    httphelper.getTestPunches(this._testBatchGuid, includeAll, function (status, punches) {
      console.log('MiscTestPunchesCharacteristic - onReadRequest: status = "' + status + '" value = ' + (punches != null ? punches : 'null'));
      thisObj._testPunchesRead = new Buffer(punches, "utf-8");
      if (status == 'OK') {
        callback(thisObj.RESULT_SUCCESS, thisObj._testPunchesRead);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR, null);
      }
    });
  } else {
    if (thisObj._testPunchesRead == null || offset > thisObj._testPunchesRead.length) {
      result = this.RESULT_INVALID_OFFSET;
      thisObj._testPunchesRead = null;
    } else {
      var buf = this._testPunchesRead.slice(offset);
      callback(thisObj.RESULT_SUCCESS, buf);
    }
  }
};

MiscTestPunchesCharacteristic.prototype.getNewGuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

MiscTestPunchesCharacteristic.prototype.addTestPunch = function(callback) {
  // add punch
  console.log("addTestPunch");
  httphelper.addTestPunch(this._testBatchGuid, this._siNo, this._ackReq, function (status, addedPunch) {
    console.log('MiscTestPunchesCharacteristic - addTestPunch: status = "' + status + '" value = ' + (addedPunch != null ? addedPunch : 'null'));
  });

  this._noOfPunchesAdded++;
  if (this._noOfPunchesAdded >= this._noOfPunchesToAdd) {
    console.log("addPunchInterval cleared");
    clearInterval(this._addPunchInterval);
    this._addPunchInterval = null;
  }
};

MiscTestPunchesCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MiscTestPunchesCharacteristic - onWriteRequest');
  var noOfPunchesAndIntervalAndSINo = data.toString('utf-8');
  this._noOfPunchesToAdd = parseInt(noOfPunchesAndIntervalAndSINo.split(';')[0]);
  this._noOfPunchesAdded = 0;
  var intervalMs = 1000;
  if (noOfPunchesAndIntervalAndSINo.split(';').length > 1) {
    intervalMs = parseInt(noOfPunchesAndIntervalAndSINo.split(';')[1]);
  }
  if (noOfPunchesAndIntervalAndSINo.split(';').length > 2) {
    this._siNo = noOfPunchesAndIntervalAndSINo.split(';')[2];
  }
  if (noOfPunchesAndIntervalAndSINo.split(';').length > 3) {
    this._ackReq = noOfPunchesAndIntervalAndSINo.split(';')[3];
  }
  console.log("Number of punches to add: " + this._noOfPunchesToAdd + " interval: " + intervalMs + " si number: " + this._siNo + " ackReq: " +   this._ackReq);
  this._testBatchGuid = this.getNewGuid();
  this._shouldStopSending = false;
  clearInterval(this._interval);
  this._interval = null;
  clearInterval(this._addPunchInterval);
  this._addPunchInterval = null;
  this._addPunchInterval = setInterval(this.addTestPunch.bind(this), intervalMs);
  callback(this.RESULT_SUCCESS);
};

module.exports = MiscTestPunchesCharacteristic;
