var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var MiscAllCharacteristic = require('./misc-all-characteristic');
var MiscPropertiesCharacteristic = require('./misc-properties-characteristic');

function MiscService() {
	MiscService.super_.call(this, {
      uuid: 'FB880900-4AB2-40A2-A8F0-14CC1C2E5608',
      characteristics: [
	new MiscAllCharacteristic(),
	new MiscPropertiesCharacteristic()
      ]
  });
}

util.inherits(MiscService, BlenoPrimaryService);

module.exports = MiscService;
