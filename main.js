var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var BatteryService = require('./battery-service');
var batteryService = new BatteryService();
var RadioConfigurationService = require('./radio-configuration-service');
var radioConfigurationService = new RadioConfigurationService();
var MiscService = require('./misc-service');
var miscService = new MiscService();
var MeosService = require('./meos-service');
var meosService = new MeosService();
var NetworkService = require('./network-service');
var networkService = new NetworkService();

console.log('bleno - echo');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('WiRoc Device', [batteryService.uuid, radioConfigurationService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
        batteryService,
        radioConfigurationService,
        miscService,
	meosService,
	networkService
      ], function(error) {
        console.log('setServices: '  + (error ? 'error ' + error : 'success'));
      }
    );
  }
});


bleno.on('accept', function(clientAddress) {
	console.log('Connect from: ' + clientAddress);
	
});


