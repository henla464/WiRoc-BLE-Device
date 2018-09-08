var util = require('util');

var bleno = require('@ubnt/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var MeosEnabledCharacteristic = require('./meos-enabled-characteristic');
var MeosIPCharacteristic = require('./meos-ip-characteristic');
var MeosIPPortCharacteristic = require('./meos-ip-port-characteristic');

function MeosService() {
	MeosService.super_.call(this, {
      uuid: '6E30B300-BE1B-401C-8A6D-1A59D5C23C64',
      characteristics: [
          new MeosEnabledCharacteristic(),
          new MeosIPCharacteristic(),
          new MeosIPPortCharacteristic()
      ]
  });
}

util.inherits(MeosService, BlenoPrimaryService);

module.exports = MeosService;
