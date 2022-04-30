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
  HttpHelper.getHttpGetResponse('/api/testpunches/gettestpunches/' + testBatchGuid + '/' + (includeAll ? "true":"false") + '/', function(status, body) {
    console.log('HttpHelper - getTestPunches: ' + body);
    callback(status, body == null ? null : body);
  });
};

HttpHelper.addTestPunch = function(testBatchGuid, siNo, callback) {
  console.log('HttpHelper - addTestPunch');
  HttpHelper.getHttpGetResponse('/api/testpunches/addtestpunch/' + testBatchGuid + '/' + siNo + '/', function(status, body) {
    console.log('HttpHelper - addTestPunch: ' + body);
    callback(status, body == null ? null : JSON.parse(body).Status);
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
	console.log('HttpHelper - getSetProperty status: ' + status);
	if (status == "CONNECTION ERROR") {
		callback(status,'');
	}
	else 
	{
		callback(status, body == null ? null : propName + '\t' + JSON.parse(body).Value);
	}
  });
};

module.exports = HttpHelper;
