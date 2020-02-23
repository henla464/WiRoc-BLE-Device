var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var PunchesPunchesCharacteristic = require('./punches-punches-characteristic');
var PunchesTestPunchesCharacteristic = require('./punches-test-punches-characteristic');

function PunchesService() {
	PunchesService.super_.call(this, {
      uuid: '02D249A5-E318-4B46-8218-3FF2101A333C',
      characteristics: [
        new PunchesPunchesCharacteristic(),
	new PunchesTestPunchesCharacteristic()
      ]
  });
}

util.inherits(PunchesService, BlenoPrimaryService);

module.exports = PunchesService;

