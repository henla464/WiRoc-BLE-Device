var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var DeviceStatusStatusCharacteristic = require('./devicestatus-status-characteristic');
var DeviceStatusSettingsCharacteristic = require('./devicestatus-settings-characteristic');
var DeviceStatusServiceCharacteristic = require('./devicestatus-service-characteristic');
var DeviceStatusBatteryCharacteristic = require('./devicestatus-battery-characteristic');
var DeviceStatusDeviceNameCharacteristic = require('./devicestatus-devicename-characteristic');
var DeviceStatusUpgradeCharacteristic = require('./devicestatus-upgrade-characteristic');

function DeviceStatusService() {
	DeviceStatusService.super_.call(this, {
      uuid: 'D5A27219-F64E-4283-BD66-6E6231D5DAED',
      characteristics: [
	new DeviceStatusStatusCharacteristic(),
	new DeviceStatusSettingsCharacteristic(),
	new DeviceStatusServiceCharacteristic(),
	new DeviceStatusBatteryCharacteristic(),
	new DeviceStatusDeviceNameCharacteristic(),
	new DeviceStatusUpgradeCharacteristic()
      ]
  });
}

util.inherits(DeviceStatusService, BlenoPrimaryService);

module.exports = DeviceStatusService;
