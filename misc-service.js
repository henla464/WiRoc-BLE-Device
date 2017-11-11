var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var MiscPunchesCharacteristic = require('./misc-punches-characteristic');
var MiscDebugCharacteristic = require('./misc-debug-characteristic');
var MiscStatusCharacteristic = require('./misc-status-characteristic');
var MiscSettingsCharacteristic = require('./misc-settings-characteristic');
var MiscServiceCharacteristic = require('./misc-service-characteristic');
var MiscDatabaseCharacteristic = require('./misc-database-characteristic');
var MiscTestPunchesCharacteristic = require('./misc-test-punches-characteristic');
var MiscBatteryCharacteristic = require('./misc-battery-characteristic');
var MiscAllCharacteristic = require('./misc-all-characteristic');
var MiscDeviceNameCharacteristic = require('./misc-devicename-characteristic');

function MiscService() {
	MiscService.super_.call(this, {
      uuid: 'FB880900-4AB2-40A2-A8F0-14CC1C2E5608',
      characteristics: [
        new MiscPunchesCharacteristic(),
	new MiscDebugCharacteristic(),
	new MiscStatusCharacteristic(),
	new MiscSettingsCharacteristic(),
	new MiscServiceCharacteristic(),
	new MiscDatabaseCharacteristic(),
	new MiscTestPunchesCharacteristic(),
	new MiscBatteryCharacteristic(),
	new MiscAllCharacteristic(),
	new MiscDeviceNameCharacteristic()
      ]
  });
}

util.inherits(MiscService, BlenoPrimaryService);

module.exports = MiscService;
