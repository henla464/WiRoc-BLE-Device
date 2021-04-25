var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var PropertiesCharacteristic = require('./properties-characteristic');
var PunchesCharacteristic = require('./punches-characteristic');
var TestPunchesCharacteristic = require('./test-punches-characteristic');

function ApiService() {
	ApiService.super_.call(this, {
      uuid: 'FB880900-4AB2-40A2-A8F0-14CC1C2E5608',
      characteristics: [
	new PropertiesCharacteristic(),
	new PunchesCharacteristic(),
	new TestPunchesCharacteristic()
      ]
  });
}

util.inherits(ApiService, BlenoPrimaryService);

module.exports = ApiService;
