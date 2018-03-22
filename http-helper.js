var http = require('http');
var helper = require('./helper');

var HttpHelper = HttpHelper || {}

HttpHelper.getHttpGetResponse = function(thePath, callback) {
 return http.get({
    host: '127.0.0.1',
    port: 5000,
    path: thePath
  }, function(response) {
     if (response.statusCode != 200) {
      console.log("non-200 response status code:");
      console.log(response.statusCode);
      console.log("for url:");
      console.log(thePath);
      callback('CONNECTION ERROR', null);
      return;
    }
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // Data reception is done, do whatever with it!
      callback('OK', body);
    });
  }).on("error", function (){console.log("GET request error");  callback('CONNECTION ERROR', null); });
}


HttpHelper.getChannel = function(callback) {
  console.log('HttpHelper - getChannel');
  HttpHelper.getHttpGetResponse('/radioconfiguration/channel/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).Channel);
  });
};

HttpHelper.setChannel = function(channel, callback) {
  console.log('HttpHelper - setChannel');
  HttpHelper.getHttpGetResponse('/radioconfiguration/channel/' + channel + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).Channel);
  });
};

HttpHelper.getDataRate = function(callback) {
  console.log('HttpHelper - getDataRate');
  HttpHelper.getHttpGetResponse('/radioconfiguration/datarate/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).DataRate);
  });
};

HttpHelper.setDataRate = function(dataRate, callback) {
  console.log('HttpHelper - setDataRate');
  HttpHelper.getHttpGetResponse('/radioconfiguration/datarate/' + dataRate + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).DataRate);
  });
};

HttpHelper.getAcknowledgementRequested = function(callback) {
  console.log('HttpHelper - getAcknowledgementRequested');
  HttpHelper.getHttpGetResponse('/radioconfiguration/acknowledgementrequested/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).AcknowledgementRequested);
  });
};

HttpHelper.setAcknowledgementRequested = function(ackRequested, callback) {
  console.log('HttpHelper - setAcknowledgementRequested');
  HttpHelper.getHttpGetResponse('/radioconfiguration/acknowledgementrequested/' + ackRequested + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).AcknowledgementRequested);
  });
};


HttpHelper.getPower = function(callback) {
  console.log('HttpHelper - getPower');
  HttpHelper.getHttpGetResponse('/radioconfiguration/power/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).Power);
  });
};

HttpHelper.setPower = function(power, callback) {
  console.log('HttpHelper - setPower');
  HttpHelper.getHttpGetResponse('/radioconfiguration/power/' + power + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).Power);
  });
};

HttpHelper.getSendToMeosEnabled = function(callback) {
  console.log('HttpHelper - getSendToMeosEnabled');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosenabled/', function(status, body) {
    console.log(body);
    console.log(JSON.parse(body).SendToMeosEnabled);
    callback(status, body == null ? null : JSON.parse(body).SendToMeosEnabled);
  });
};

HttpHelper.setSendToMeosEnabled = function(enabled, callback) {
  console.log('HttpHelper - setSendToMeosEnabled');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosenabled/' + enabled + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).SendToMeosEnabled);
  });
};


HttpHelper.getSendToMeosIP = function(callback) {
  console.log('HttpHelper - getSendToMeosIP');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosip/', function(status, body) {
    var sendToMeosIP = (body == null ? '' : JSON.parse(body).SendToMeosIP)
    callback(status, sendToMeosIP == null ? '' : sendToMeosIP);
  });
};

HttpHelper.setSendToMeosIP = function(ip, callback) {
  console.log('HttpHelper - setSendToMeosIP');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosip/' + ip + '/', function(status, body) {
    var sendToMeosIP = (body == null ? '' : JSON.parse(body).SendToMeosIP)
    callback(status, sendToMeosIP == null ? '' : sendToMeosIP);
  });
};

HttpHelper.getSendToMeosIPPort = function(callback) {
  console.log('HttpHelper - getSendToMeosIPPort');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosipport/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).SendToMeosIPPort);
  });
};

HttpHelper.setSendToMeosIPPort = function(port, callback) {
  console.log('HttpHelper - setSendToMeosIPPort');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosipport/' + port + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).SendToMeosIPPort);
  });
};

HttpHelper.getStatus = function(callback) {
  console.log('HttpHelper - getStatus');
  HttpHelper.getHttpGetResponse('/misc/status/', function(status, body) {
    callback(status, body == null ? null : body);
  });
};

HttpHelper.getSettings = function(callback) {
  console.log('HttpHelper - getSettings');
  HttpHelper.getHttpGetResponse('/misc/settings/', function(status, body) {
    callback(status, body == null ? null : body);
  });
};

HttpHelper.setSetting = function(keyAndValue, callback) {
  console.log('HttpHelper - setSetting');
  HttpHelper.getHttpGetResponse('/misc/setting/' + encodeURIComponent(keyAndValue) + '/', function(status, body) {
    callback(status, body == null ? null : body);
  });
};

HttpHelper.getPunches = function(callback) {
  console.log('HttpHelper - getPunches');
  HttpHelper.getHttpGetResponse('/misc/punches/', function(status, body) {
    callback(status, body == null ? null : body);
  });
};

HttpHelper.getWiRocDeviceName = function(callback) {
  console.log('HttpHelper - getWiRocDeviceName');
  HttpHelper.getHttpGetResponse('/misc/wirocdevicename/', function(status, body) {
    console.log('HttpHelper - getWiRocDeviceName: ' + body);
    callback(status, body == null ? null : JSON.parse(body).WiRocDeviceName);
  });
};

HttpHelper.deletePunches = function(callback) {
  console.log('HttpHelper - deletePunches');
  HttpHelper.getHttpGetResponse('/misc/database/deletepunches/', function(status, body) {
    console.log('HttpHelper - deletePunches: ' + body);
    callback(status, body == null ? null : JSON.parse(body).Status);
  });
};

HttpHelper.dropAllTables = function(callback) {
  console.log('HttpHelper - dropAllTables');
  HttpHelper.getHttpGetResponse('/misc/database/dropalltables/', function(status, body) {
    console.log('HttpHelper - dropAllTables: ' + body);
    callback(status, body == null ? null : JSON.parse(body).Status);
  });
};

HttpHelper.getTestPunches = function(testBatchGuid, includeAll, callback) {
  console.log('HttpHelper - getTestPunches');
  HttpHelper.getHttpGetResponse('/misc/testpunches/gettestpunches/' + testBatchGuid + '/' + (includeAll ? "true":"false") + '/', function(status, body) {
    console.log('HttpHelper - getTestPunches: ' + body);
    callback(status, body == null ? null : body);
  });
};

HttpHelper.addTestPunch = function(testBatchGuid, siNo, callback) {
  console.log('HttpHelper - addTestPunch');
  HttpHelper.getHttpGetResponse('/misc/testpunches/addtestpunch/' + testBatchGuid + '/' + siNo + '/', function(status, body) {
    console.log('HttpHelper - addTestPunch: ' + body);
    callback(status, body == null ? null : JSON.parse(body).Status);
  });
};

HttpHelper.getIsCharging = function(callback) {
  console.log('HttpHelper - getIsCharging');
  HttpHelper.getHttpGetResponse('/misc/ischarging/', function(status, body) {
    console.log('HttpHelper - getIsCharging: ' + body);
    callback(status, body == null ? null : JSON.parse(body).IsCharging);
  });
};

HttpHelper.getApiKey = function(callback) {
  console.log('HttpHelper - getApiKey');
  HttpHelper.getHttpGetResponse('/misc/apikey/', function(status, body) {
    console.log('HttpHelper - getApiKey: ' + body);
    callback(status, body == null ? null : JSON.parse(body).ApiKey);
  });
};


HttpHelper.getWebServerUrl = function(callback) {
  console.log('HttpHelper - getWebServerUrl');
  HttpHelper.getHttpGetResponse('/misc/webserverurl/', function(status, body) {
    console.log('HttpHelper - getWebServerUrl: ' + body);
    callback(status, body == null ? null : JSON.parse(body).WebServerUrl);
  });
};

HttpHelper.getWebServerHost = function(callback) {
  console.log('HttpHelper - getWebServerHost');
  HttpHelper.getHttpGetResponse('/misc/webserverhost/', function(status, body) {
    console.log('HttpHelper - getWebServerHost: ' + body);
    callback(status, body == null ? null : JSON.parse(body).WebServerHost);
  });
};

HttpHelper.getAll = function(callback) {
  console.log('HttpHelper - getAll');
  HttpHelper.getHttpGetResponse('/misc/ischarging/', function(status, body) {
    if (status != 'OK') { callback(status, null); return;}
    var isCharging = (body == null ? null : JSON.parse(body).IsCharging);
    HttpHelper.getHttpGetResponse('/misc/wirocdevicename/', function(status, body) {
      if (status != 'OK') { callback(status, null); return;}
      var wirocDeviceName = (body == null ? null : JSON.parse(body).WiRocDeviceName);
      HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosipport/', function(status, body) {
        if (status != 'OK') { callback(status, null); return;}
        var sentToSirapIPPort = (body == null ? null : JSON.parse(body).SendToMeosIPPort);
        HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosip/', function(status, body) {
          if (status != 'OK') { callback(status, null); return;}
          var sendToSirapIP = (body == null ? '' : JSON.parse(body).SendToMeosIP)
          HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosenabled/', function(status, body) {
            if (status != 'OK') { callback(status, null); return;}
            var sentToSirapEnabled = (body == null ? null : JSON.parse(body).SendToMeosEnabled);
            HttpHelper.getHttpGetResponse('/radioconfiguration/acknowledgementrequested/', function(status, body) {
              if (status != 'OK') { callback(status, null); return;}
              var acknowledgementRequested = (body == null ? null : JSON.parse(body).AcknowledgementRequested);
              HttpHelper.getHttpGetResponse('/radioconfiguration/datarate/', function(status, body) {
                if (status != 'OK') { callback(status, null); return;}
                var dataRate = (body == null ? null : JSON.parse(body).DataRate);
                HttpHelper.getHttpGetResponse('/radioconfiguration/channel/', function(status, body) {
                  if (status != 'OK') { callback(status, null); return;}
                  var channel = (body == null ? null : JSON.parse(body).Channel);
                  HttpHelper.getHttpGetResponse('/radioconfiguration/power/', function(status, body) {
                    if (status != 'OK') { callback(status, null); return;}
                    var power = (body == null ? null : JSON.parse(body).Power);
                    helper.getBatteryLevel(function(status, intPercent) {
                      if (status != 'OK') { callback(status, null); return;}
                      helper.getIP(function(status, data) {
                        if (status != 'OK') { callback(status, data); return;}
                        var ipAddress = data;
                        var all = (isCharging ? '1':'0');
			all += '¤' + (wirocDeviceName == null ? '' : wirocDeviceName);
                        all += '¤' + sentToSirapIPPort;
                        all += '¤' + (sendToSirapIP == null ? '' : sendToSirapIP);
                        all += '¤' + (sentToSirapEnabled ? '1' : '0');
                        all += '¤' + (acknowledgementRequested ? '1' : '0');
                        all += '¤' + dataRate;
                        all += '¤' + channel;
                        all += '¤' + intPercent;
                        all += '¤' + ipAddress;
                        all += '¤' + power;
                        callback(status, all);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

module.exports = HttpHelper;
