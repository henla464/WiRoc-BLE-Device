var util = require('util');

var bleno = require('@ubnt/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var NetworkListWifiCharacteristic = require('./network-list-wifi-characteristic');
var NetworkConnectWifiCharacteristic = require('./network-connect-wifi-characteristic');
var NetworkDisconnectWifiCharacteristic = require('./network-disconnect-wifi-characteristic');
var NetworkIPCharacteristic = require('./network-ip-characteristic');

function NetworkService() {
  NetworkService.super_.call(this, {
      uuid: 'F5EA6200-BCC5-4406-A981-89C6C5FC09CF',
      characteristics: [
          new NetworkListWifiCharacteristic(),
          new NetworkConnectWifiCharacteristic(),
          new NetworkDisconnectWifiCharacteristic(),
          new NetworkIPCharacteristic()
      ]
  });
}

util.inherits(NetworkService, BlenoPrimaryService);

module.exports = NetworkService;
