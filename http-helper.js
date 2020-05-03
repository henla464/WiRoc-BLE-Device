var http = require('http');

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






HttpHelper.getSetProperty = function(propName, propValue, callback) {
  console.log('HttpHelper - getSetProperty');
  var uri = '/api/' + propName + '/';
  if (propValue != null && propValue.length > 0) {
    uri += propValue + '/';
  }
  console.log('HttpHelper - getSetProperty: ' + uri);
  HttpHelper.getHttpGetResponse(uri, function(status, body) {
    callback(status, body == null ? null : propName + ';' + JSON.parse(body).Value);
  });
};


////
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
////
module.exports = HttpHelper;
