var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var PunchesCharacteristic = require('./punches-characteristic');
var DebugCharacteristic = require('./debug-characteristic');

function MiscService() {
	MiscService.super_.call(this, {
      uuid: 'FB880900-4AB2-40A2-A8F0-14CC1C2E5608',
      characteristics: [
          new PunchesCharacteristic(),
          new DebugCharacteristic()
      ]
  });
}

util.inherits(MiscService, BlenoPrimaryService);

module.exports = MiscService;
