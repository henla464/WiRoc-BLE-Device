var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var MiscPropertiesCharacteristic = require('./misc-properties-characteristic');
var MiscCommandCharacteristic = require('./misc-command-characteristic');

function MiscService() {
	MiscService.super_.call(this, {
      uuid: 'FB880900-4AB2-40A2-A8F0-14CC1C2E5608',
      characteristics: [
	new MiscPropertiesCharacteristic(),
	new MiscCommandCharacteristic(),
      ]
  });
}

util.inherits(MiscService, BlenoPrimaryService);

module.exports = MiscService;
