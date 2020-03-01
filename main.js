var bleno = require('@henla464/bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var httphelper = require('./http-helper');
var helper = require('./helper');
var BatteryService = require('./battery-service');
var batteryService = new BatteryService();
var RadioConfigurationService = require('./radio-configuration-service');
var radioConfigurationService = new RadioConfigurationService();
var MiscService = require('./misc-service');
var miscService = new MiscService();
var SirapService = require('./sirap-service');
var sirapService = new SirapService();
var NetworkService = require('./network-service');
var networkService = new NetworkService();
var DeviceStatusService = require('./devicestatus-service');
var deviceStatusService = new DeviceStatusService();
var DebugService = require('./debug-service');
var debugService = new DebugService();
var SportIdentService = require('./sportident-service');
var sportIdentService = new SportIdentService();
var PunchesService = require('./punches-service');
var punchesService = new PunchesService();

console.log('bleno - echo');

function startAdv() {
    setTimeout(function() {  
       httphelper.getWiRocDeviceName(function (status, deviceName) {
         console.log('WiRocDeviceName: ' + (deviceName != null ? deviceName : 'null') + ' Status: ' + status);
         if (deviceName == null) {
            deviceName = 'WiRoc Device';
         }
         if (bleno.state === 'poweredOn') { // sometimes state has become powered off before reaching here
         	bleno.startAdvertising(deviceName, [radioConfigurationService.uuid]);
         }
       });
      }, 1000);
}

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    startAdv();
  } else {
    bleno.stopAdvertising();
    helper.startPatchAP6212(function (status) {
      if (status == "OK") {
        console.log('startPatchAP6212 OK');
      } else {
        console.log('startPatchAP6212 error');
      }
   });
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
        batteryService,
        radioConfigurationService,
        miscService,
	sirapService,
	networkService,
	deviceStatusService,
	debugService,
	sportIdentService,
	punchesService
      ], function(error) {
        console.log('setServices: '  + (error ? 'error ' + error : 'success'));
      }
    );
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});


bleno.on('accept', function(clientAddress) {
    console.log('Connect from: ' + clientAddress);
    bleno.stopAdvertising();
	
});

if (bleno.state === 'poweredOn') {
    helper.stopHCI(function (status) {
      if (status == "OK") {
        console.log('StopHCI OK');
      }
      helper.startHCI(function (status) {
        if (status == "OK") {
          console.log('StartHCI OK');
        }
        startAdv();
      });
    });
} else {
   helper.startPatchAP6212(function (status) {
      if (status == "OK") {
        console.log('startPatchAP6212 OK');
      } else {
        console.log('startPatchAP6212 error');
      }
   });
}

bleno.on('disconnect', function() {
    helper.stopHCI(function (status) {
      if (status == "OK") {
        console.log('StopHCI OK');
      }
      helper.startHCI(function (status) {
        if (status == "OK") {
          console.log('StartHCI OK');
        }
      });
    });

    startAdv();
});



