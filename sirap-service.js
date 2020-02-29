var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var SirapEnabledCharacteristic = require('./sirap-enabled-characteristic');
var SirapIPCharacteristic = require('./sirap-ip-characteristic');
var SirapIPPortCharacteristic = require('./sirap-ip-port-characteristic');

function SirapService() {
	SirapService.super_.call(this, {
      uuid: '6E30B300-BE1B-401C-8A6D-1A59D5C23C64',
      characteristics: [
          new SirapEnabledCharacteristic(),
          new SirapIPCharacteristic(),
          new SirapIPPortCharacteristic()
      ]
  });
}

util.inherits(SirapService, BlenoPrimaryService);

module.exports = SirapService;
