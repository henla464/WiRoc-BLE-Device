var exec = require('child_process').exec;
var util = require('util');
var bleno = require('@ubnt/bleno');
var httphelper = require('./http-helper');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var MiscDatabaseCharacteristic = function() {


  MiscDatabaseCharacteristic.super_.call(this, {
    uuid: 'FB880906-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: 'Perform operations on the database'
      }),
      // presentation format: 0x19=utf8 string, 0x01=exponent 1, 0x00 0x27=unit less, 0x01=namespace, 0x00 0x00 description
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x19, 0x01, 0x00, 0x27, 0x01, 0x00, 0x00 ])
      })
    ]
  });
  this.settings = null;
};

util.inherits(MiscDatabaseCharacteristic, Characteristic);


MiscDatabaseCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('MiscDatabaseCharacteristic - onWriteRequest');
  var thisObj = this;
  var operation = data.toString('utf-8')
  if (operation == "deletepunches") {
    httphelper.deletePunches(function(status, retWebServiceStatus) {
      console.log('MiscDatabaseCharacteristic - onWriteRequest, delete punches: status = "' + status + '" value = ' + (retWebServiceStatus != null ? retWebServiceStatus : 'null'));
      if (status == 'OK' && retWebServiceStatus == 'OK') {
        callback(thisObj.RESULT_SUCCESS);
      } else {
        callback(thisObj.RESULT_UNLIKELY_ERROR);
      }
    });
  } else if (operation == "dropalltables") {
    // stop WiRoc-Python service
    child = exec("systemctl stop WiRocPython.service", function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
        callback(thisObj.RESULT_UNLIKELY_ERROR);
      } else {
            httphelper.dropAllTables(function(status, retWebServiceStatus) {
              console.log('MiscDatabaseCharacteristic - onWriteRequest, drop tables: status = "' + status + '" value = ' + (retWebServiceStatus != null ? retWebServiceStatus : 'null'));
              if (status == 'OK' && retWebServiceStatus == 'OK') {
                // start WiRoc-Python service
                child2 = exec("systemctl start WiRocPython.service", function (error, stdout, stderr) {
                  if (error !== null) {
                    callback(thisObj.RESULT_UNLIKELY_ERROR);
                  } else {
                    callback(thisObj.RESULT_SUCCESS);
                  }
                });
              } else {
                // start WiRoc-Python service
                child2 = exec("systemctl start WiRocPython.service", function (error, stdout, stderr) {
                  callback(thisObj.RESULT_UNLIKELY_ERROR);
                });
              }
            });
      }
    });
  } else {
    callback(thisObj.RESULT_UNLIKELY_ERROR);
  }
};

module.exports = MiscDatabaseCharacteristic;
