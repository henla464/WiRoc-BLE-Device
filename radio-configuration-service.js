var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var RadioConfigurationChannelCharacteristic = require('./radio-configuration-channel-characteristic');
var RadioConfigurationAcknowledgementCharacteristic = require('./radio-configuration-acknowledgement-characteristic');
var RadioConfigurationCustomChannelCharacteristic = require('./radio-configuration-custom-channel-characteristic');
var RadioConfigurationCustomChannelDataRateCharacteristic = require('./radio-configuration-custom-channel-data-rate-characteristic');

function RadioConfigurationService() {
  RadioConfigurationService.super_.call(this, {
      uuid: 'DC57FFAA-D960-4202-82FD-5492696B02F6',
      characteristics: [
          new RadioConfigurationChannelCharacteristic(),
          new RadioConfigurationAcknowledgementCharacteristic(),
          new RadioConfigurationCustomChannelCharacteristic(),
          new RadioConfigurationCustomChannelDataRateCharacteristic()
      ]
  });
}

util.inherits(RadioConfigurationService, BlenoPrimaryService);

module.exports = RadioConfigurationService;
