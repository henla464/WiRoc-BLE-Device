var http = require('http');
var helper = require('./helper');

var HttpHelper = HttpHelper || {}

HttpHelper.getHttpGetResponse = function(thePath, callback) {
 return http.get({
    host: '127.0.0.1',
    port: 5000,
    path: thePath
  }, function(response) {
    var body = '';
   // Continuously update stream with data
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // Data reception is done, do whatever with it!
      callback('OK', body);
    });
    if (response.statusCode != 200) {
      console.log("non-200 response status code:");
      console.log(response.statusCode);
      console.log("for url:");
      console.log(thePath);
      callback('CONNECTION ERROR', null);
      return;
    }
  }).on("error", function (){console.log("GET request error");  callback('CONNECTION ERROR', ''); });
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


HttpHelper.getRange = function(callback) {
  console.log('HttpHelper - getRange');
  HttpHelper.getHttpGetResponse('/radioconfiguration/lorarange/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).LoraRange);
  });
};

HttpHelper.setRange = function(range, callback) {
  console.log('HttpHelper - setRange');
  HttpHelper.getHttpGetResponse('/radioconfiguration/lorarange/' + range + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).LoraRange);
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

HttpHelper.getSendToSirapEnabled = function(callback) {
  console.log('HttpHelper - getSendToSirapEnabled');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosenabled/', function(status, body) {
    console.log(body);
    console.log(JSON.parse(body).SendToMeosEnabled);
    callback(status, body == null ? null : JSON.parse(body).SendToMeosEnabled);
  });
};

HttpHelper.setSendToSirapEnabled = function(enabled, callback) {
  console.log('HttpHelper - setSendToSirapEnabled');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosenabled/' + enabled + '/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).SendToMeosEnabled);
  });
};


HttpHelper.getSendToSirapIP = function(callback) {
  console.log('HttpHelper - getSendToSirapIP');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosip/', function(status, body) {
    var sendToSirapIP = (body == null ? '' : JSON.parse(body).SendToMeosIP)
    callback(status, sendToSirapIP == null ? '' : sendToSirapIP);
  });
};

HttpHelper.setSendToSirapIP = function(ip, callback) {
  console.log('HttpHelper - setSendToSirapIP');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosip/' + ip + '/', function(status, body) {
    var sendToSirapIP = (body == null ? '' : JSON.parse(body).SendToMeosIP)
    callback(status, sendToSirapIP == null ? '' : sendToSirapIP);
  });
};

HttpHelper.getSendToSirapIPPort = function(callback) {
  console.log('HttpHelper - getSendToSirapIPPort');
  HttpHelper.getHttpGetResponse('/meosconfiguration/sendtomeosipport/', function(status, body) {
    callback(status, body == null ? null : JSON.parse(body).SendToMeosIPPort);
  });
};

HttpHelper.setSendToSirapIPPort = function(port, callback) {
  console.log('HttpHelper - setSendToSirapIPPort');
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


HttpHelper.getVersions = function(callback) {
  console.log('HttpHelper - getVersions');
  HttpHelper.getHttpGetResponse('/misc/versions/', function(status, body) {
    console.log('HttpHelper - getVersions: ' + body);
    callback(status, body == null ? null : JSON.parse(body).Versions);
  });
};

HttpHelper.setWiRocDeviceName = function(deviceName, callback) {
  console.log('HttpHelper - setWiRocDeviceName');
  HttpHelper.getHttpGetResponse('/misc/wirocdevicename/' + deviceName + '/', function(status, body) {
    var wirocDeviceName = (body == null ? '' : JSON.parse(body).WirocDeviceName)
    callback(status, wirocDeviceName == null ? '' : wirocDeviceName);
  });
};


HttpHelper.getLogToServer = function(callback) {
  console.log('HttpHelper - getLogToServer');
  HttpHelper.getHttpGetResponse('/misc/logtoserver/', function(status, body) {
    console.log('HttpHelper - getLogToServer: ' + body);
    callback(status, body == null ? null : JSON.parse(body).LogToServer);
  });
};

HttpHelper.setLogToServer = function(logToServer, callback) {
  console.log('HttpHelper - setLogToServer');
  HttpHelper.getHttpGetResponse('/misc/logtoserver/' + logToServer + '/', function(status, body) {
    var logToServerRet = (body == null ? '' : JSON.parse(body).LogToServer)
    callback(status, logToServerRet == null ? null : logToServerRet);
  });
};


HttpHelper.getLoggingServerHost = function(callback) {
  console.log('HttpHelper - getLoggingServerHost');
  HttpHelper.getHttpGetResponse('/misc/loggingserverhost/', function(status, body) {
    console.log('HttpHelper - getLoggingServerHost: ' + body);
    callback(status, body == null ? null : JSON.parse(body).LoggingServerHost);
  });
};

HttpHelper.setLoggingServerHost = function(loggingServerHost, callback) {
  console.log('HttpHelper - setLoggingServerHost');
  HttpHelper.getHttpGetResponse('/misc/loggingserverhost/' + loggingServerHost + '/', function(status, body) {
    var loggingServerHostRet = (body == null ? '' : JSON.parse(body).LoggingServerHost)
    callback(status, loggingServerHostRet == null ? null : loggingServerHostRet);
  });
};

HttpHelper.getLoggingServerPort = function(callback) {
  console.log('HttpHelper - getLoggingServerPort');
  HttpHelper.getHttpGetResponse('/misc/loggingserverport/', function(status, body) {
    console.log('HttpHelper - getLoggingServerPort: ' + body);
    callback(status, body == null ? null : JSON.parse(body).LoggingServerPort);
  });
};

HttpHelper.setLoggingServerPort = function(loggingServerPort, callback) {
  console.log('HttpHelper - setLoggingServerPort');
  HttpHelper.getHttpGetResponse('/misc/loggingserverport/' + loggingServerPort + '/', function(status, body) {
    var loggingServerPortRet = (body == null ? '' : JSON.parse(body).LoggingServerPort)
    callback(status, loggingServerPortRet == null ? null : loggingServerPortRet);
  });
};


HttpHelper.getOneWayReceive = function(callback) {
  console.log('HttpHelper - getOneWayReceive');
  HttpHelper.getHttpGetResponse('/misc/onewayreceive/', function(status, body) {
    console.log('HttpHelper - getOneWayReceive: ' + body);
    callback(status, body == null ? null : JSON.parse(body).OneWayReceive);
  });
};

HttpHelper.setOneWayReceive = function(oneWayReceiveEnabled, callback) {
  console.log('HttpHelper - setOneWayReceive');
  HttpHelper.getHttpGetResponse('/misc/onewayreceive/' + oneWayReceiveEnabled + '/', function(status, body) {
    var oneWayReceiveRet = (body == null ? '' : JSON.parse(body).OneWayReceive)
    callback(status, oneWayReceiveRet == null ? null : oneWayReceiveRet);
  });
};

HttpHelper.getForce4800BaudRate = function(callback) {
  console.log('HttpHelper - getForce4800BaudRate');
  HttpHelper.getHttpGetResponse('/misc/force4800baudrate/', function(status, body) {
    console.log('HttpHelper - getForce4800BaudRate: ' + body);
    callback(status, body == null ? null : JSON.parse(body).Force4800BaudRate);
  });
};

HttpHelper.setForce4800BaudRate = function(force4800BaudRate, callback) {
  console.log('HttpHelper - setForce4800BaudRate');
  HttpHelper.getHttpGetResponse('/misc/force4800baudrate/' + force4800BaudRate + '/', function(status, body) {
    var force4800BaudRateRet = (body == null ? '' : JSON.parse(body).Force4800BaudRate)
    callback(status, force4800BaudRateRet == null ? null : force4800BaudRateRet);
  });
};


HttpHelper.getAll = function(callback) {
  console.log('HttpHelper - getAll');
  HttpHelper.getHttpGetResponse('/misc/allmainsettings/', function(status, body) {
    if (status != 'OK') { callback(status, ''); return;}
    var all = (body == null ? null : JSON.parse(body).All);
    helper.getBatteryLevel(function(status, intPercent) {
      if (status != 'OK') { callback(status, null); return;}
      helper.getIP(function(status, data) {
        if (status != 'OK') { callback(status, data); return;}
        var ipAddress = data;
        all = all.replace('%ipAddress%', ipAddress).replace('%batteryPercent%', intPercent);
        callback(status, all);
      });
    });
  });
};

module.exports = HttpHelper;
