var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var SportIdentForce4800BaudRateCharacteristic = require('./sportident-force-4800-baud-rate-characteristic');
var SportIdentOneWayReceiveCharacteristic = require('./sportident-one-way-receive-characteristic');

function SportIdentService() {
	SportIdentService.super_.call(this, {
      uuid: '24E54C05-F1E1-4BFE-9083-A27455C01101',
      characteristics: [
	new SportIdentForce4800BaudRateCharacteristic(),
	new SportIdentOneWayReceiveCharacteristic()
      ]
  });
}

util.inherits(SportIdentService, BlenoPrimaryService);

module.exports = SportIdentService;
