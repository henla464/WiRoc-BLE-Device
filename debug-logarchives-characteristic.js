var util = require('util');
var bleno = require('@henla464/bleno');
var httphelper = require('./http-helper');
var helper = require('./helper');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DebugLogArchivesCharacteristic = function() {


  DebugLogArchivesCharacteristic.super_.call(this, {
    uuid: 'FB88090B-4AB2-40A2-A8F0-14CC1C2E5608',
    properties: ['write'],
    descriptors: [
      // User description
      new Descriptor({
        uuid: '2901',
        value: '' //Upload log archive to web server
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

util.inherits(DebugLogArchivesCharacteristic, Characteristic);

DebugLogArchivesCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('DebugLogArchivesCharacteristic - onWriteRequest');

  helper.getBTAddress(function(status, btAddress) {
    if (status == 'OK') {
      var dateNow = new Date();
      var zipFilePath = helper.getZipFilePath(btAddress, dateNow);
      helper.zipLogArchive(zipFilePath, function(status2) {
        if (status2 == 'OK') {
          httphelper.getApiKey(function(status3, apiKey) {
            if (status3 == 'OK') {
              httphelper.getWebServerUrl(function(status4, serverUrl) {
                if (status4 == 'OK') {
                  httphelper.getWebServerHost(function(status5, serverHost) {
                    if (status5 == 'OK') {
                      helper.uploadLogArchive(apiKey, zipFilePath, serverUrl, serverHost, function(status6) {
                        if (status6 == 'OK') {
                          console.log('DebugLogArchivesCharacteristic - uploadLogArchive status == OK');
                        } else {
                          console.log('DebugLogArchivesCharacteristic - uploadLogArchive status != OK');
                        }
                      });
                    } else {
                      console.log('DebugLogArchivesCharacteristic - getWebServerHost status != OK');
                    }
                  });
                } else {
                  console.log('DebugLogArchivesCharacteristic - getWebServerUrl status != OK');
                }
              });
            } else {
               console.log('DebugLogArchivesCharacteristic - getApiKey status != OK');
            }
          });
        } else {
          console.log('DebugLogArchivesCharacteristic - zipLogArchive status != OK');
        }
      });
    } else {
      console.log('DebugLogArchivesCharacteristic - getBTAddress status != OK');
    }
  });
};

module.exports = DebugLogArchivesCharacteristic;
