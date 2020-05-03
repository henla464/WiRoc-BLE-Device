var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var DebugDatabaseCharacteristic = require('./debug-database-characteristic');
var DebugLogArchivesCharacteristic = require('./debug-logarchives-characteristic');
var DebugLogToServerCharacteristic = require('./debug-log-to-server-characteristic');
var DebugLoggingServerHostCharacteristic = require('./debug-logging-server-host-characteristic');
var DebugLoggingServerPortCharacteristic = require('./debug-logging-server-port-characteristic');

function DebugService() {
	DebugService.super_.call(this, {
      uuid: 'A0A5A3C7-1A36-4EBE-B293-953CF7126E56',
      characteristics: [
	new DebugDatabaseCharacteristic(),
	new DebugLogArchivesCharacteristic(),
	new DebugLogToServerCharacteristic(),
	new DebugLoggingServerHostCharacteristic(),
	new DebugLoggingServerPortCharacteristic()
      ]
  });
}

util.inherits(DebugService, BlenoPrimaryService);

module.exports = DebugService;

