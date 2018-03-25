var exec = require('child_process').exec;
var os = require("os");

var Helper = Helper || {}

Helper.getBatteryLevel = function(callback) {
  console.log('Helper - get battery level');
  var hostname = os.hostname();
  if (hostname == "chip") {
    child = exec("/usr/sbin/i2cget -f -y 0 0x34 0xb9", function (error, stdout, stderr) {
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
        callback('EXEC ERROR', null);
      } else {
        var intPercent = parseInt(stdout.trim());
        console.log('Battery level - onReadRequest: value (dec)=' + intPercent);
        callback('OK', intPercent);
      }
    });
  } else { 
     callback('OK', 75);
  }

};


Helper.getIP = function(callback) {
  var cmd = "hostname -I";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('error code: "' + error + '"');
      console.log(stderr);
      callback('ERROR');
    }
    stdout = stdout.trim();
    callback('OK', stdout);
  });
};

Helper.getBTAddress = function(callback) {
  var cmd = "hcitool dev";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('Helper.getBTAddress: error code: "' + error + '"');
      console.log(stderr);
      callback('ERROR');
    } else {
      stdout = stdout.replace("Devices:","");
      stdout = stdout.trim();
      var btAddress = "NoBTAddress";
      var stdoutWords = stdout.split("\t");
      if (stdoutWords.length > 1 && stdoutWords[1].length == 17) {
         btAddress = stdoutWords[1]
      }
      callback('OK', btAddress);
    }
  });
};

Helper.getZipFilePath = function(btAddress, date) {
	var filePath = "../LogArchive/LogArchive_" + btAddress + "_" + date.toISOString() + ".zip";
	return filePath;
};


Helper.zipLogArchive = function(zipFilePath, callback) {
  var cmd = "zip " + zipFilePath + " ../WiRoc-Python-2/WiRoc.db ../WiRoc-Python-2/WiRoc.log ../WiRoc-Python-2/WiRoc.log.1 ../WiRoc-Python-2/WiRoc.log.2 ../WiRoc-Python-2/WiRoc.log.3";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('Helper.zipLogArchive: error code: "' + error + '"');
      console.log(stderr);
      callback('ERROR');
    } else {
      callback('OK');
    }
  });
};

Helper.uploadLogArchive = function(apiKey, filePath, serverUrl, serverHost, callback) {
  var cmd = "curl -X POST \"" + serverUrl + "/api/v1/LogArchives\" -H \"host: " + serverHost + "\" -H \"accept: application/json\" -H \"Authorization: " + apiKey + "\" -F \"newfile=@" + filePath +"\"";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('Helper.zipLogArchive: error code: "' + error + '"');
      console.log(stderr);
      callback('ERROR');
    } else {
      if (stdout.length > 0) {
        console.log(stdout);
      }
      callback('OK');
    }
  });
};


Helper.upgradeWiRocPython = function(version, callback) {
  console.log("helper.upgradeWiRocPython");
  const spawn = require('child_process').spawn;
  const path = require('path');
  var scriptFolder = path.basename(__dirname);
  var parentDir = path.resolve(scriptFolder, '..');
  const child = spawn('./installWiRocPython.sh', [version], {
    detached: true,
    stdio: ['ignore'],
    cwd: parentDir
  });
  child.unref();
  console.log("Spawned installWiRocPython.sh");
  callback('OK');
};

Helper.upgradeWiRocBLE = function(version, callback) {
  console.log("helper.upgradeWiRocBLE");
  const spawn = require('child_process').spawn;
  const path = require('path');
  var scriptFolder = path.basename(__dirname);
  var parentDir = path.resolve(scriptFolder, '..');
  const child = spawn('./installWiRocBLE.sh', [version], {
    detached: true,
    stdio: ['ignore'],
    cwd: parentDir
  });
  child.unref();
  console.log("Spawned installWiRocBLE.sh");
  callback('OK');
};

module.exports = Helper;
