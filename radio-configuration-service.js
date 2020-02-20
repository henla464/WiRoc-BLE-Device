var util = require('util');

var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var RadioConfigurationChannelCharacteristic = require('./radio-configuration-channel-characteristic');
var RadioConfigurationAcknowledgementCharacteristic = require('./radio-configuration-acknowledgement-characteristic');
var RadioConfigurationDataRateCharacteristic = require('./radio-configuration-data-rate-characteristic');
var RadioConfigurationRangeCharacteristic = require('./radio-configuration-range-characteristic');
var RadioConfigurationPowerCharacteristic = require('./radio-configuration-power-characteristic');

function RadioConfigurationService() {
  RadioConfigurationService.super_.call(this, {
      uuid: 'DC57FFAA-D960-4202-82FD-5492696B02F6',
      characteristics: [
          new RadioConfigurationChannelCharacteristic(),
          new RadioConfigurationAcknowledgementCharacteristic(),
          new RadioConfigurationDataRateCharacteristic(),
          new RadioConfigurationRangeCharacteristic(),
          new RadioConfigurationPowerCharacteristic()
      ]
  });
}

util.inherits(RadioConfigurationService, BlenoPrimaryService);

module.exports = RadioConfigurationService;
