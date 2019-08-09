var util = require('util');

var bleno = require('@henla464/bleno');

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
var MiscLogArchivesCharacteristic = require('./misc-logarchives-characteristic');
var MiscUpgradeCharacteristic = require('./misc-upgrade-characteristic');
var MiscLogToServerCharacteristic = require('./misc-log-to-server-characteristic');
var MiscLoggingServerHostCharacteristic = require('./misc-logging-server-host-characteristic');
var MiscLoggingServerPortCharacteristic = require('./misc-logging-server-port-characteristic');
var MiscForce4800BaudRateCharacteristic = require('./misc-force-4800-baud-rate-characteristic');
var MiscOneWayReceiveCharacteristic = require('./misc-one-way-receive-characteristic');

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
	new MiscDeviceNameCharacteristic(),
	new MiscLogArchivesCharacteristic(),
	new MiscUpgradeCharacteristic(),
	new MiscLogToServerCharacteristic(),
	new MiscLoggingServerHostCharacteristic(),
	new MiscLoggingServerPortCharacteristic(),
	new MiscForce4800BaudRateCharacteristic(),
	new MiscOneWayReceiveCharacteristic()
      ]
  });
}

util.inherits(MiscService, BlenoPrimaryService);

module.exports = MiscService;
