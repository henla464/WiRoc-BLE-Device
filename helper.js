var exec = require('child_process').exec;
var os = require("os");
var sleep = require('sleep');
var httphelper = require('./http-helper');

var Helper = Helper || {}

Helper.getBatteryLevel = function(callback) {
  console.log('Helper - get battery level');
  var hostname = os.hostname();
  if (hostname == "chip" || hostname == "nanopiair") {
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

Helper.getIP2 = function(commandName, callback) {
  var cmd = "hostname -I";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('error code: "' + error + '"');
      console.log(stderr);
      callback('ERROR', commandName + ';' + stderr);
    }
    stdout = stdout.trim();
    callback('OK', commandName + ';' + stdout);
  });
};

Helper.renewIP = function(commandName, commandValue, callback) {
  var cmd = "nmcli -m multiline -f device,type device status";
  //console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
     if (error) {
       console.log('error code: "' + error + '"');
       console.log(stderr);
       callback('ERROR', commandName);
     }
     var devices = stdout.split(/\r?\n/).slice(0,-1); // remove last empty element
     devices = devices.map(function(s) { return s.slice(40).trim() });
     for (var i = 0; i < devices.length; i+=2) {
       var iface = devices[i];
       var ifaceNetworkType = devices[i+1];
       if (commandValue == ifaceNetworkType){
         var cmd2 = "dhclient -v -1 " + iface + "";
         console.log(cmd2);
         exec(cmd2, function(error2, stdout2, stderr2) {
           if (error2) {
             console.log('error code: "' + error2 + '"');
             console.log(stderr2);
             callback('ERROR', commandName);
             return;
           } else {
             console.log(stdout2);
             callback('OK', commandName);
           }
         });
         return;
       }
     }
     callback('ERROR', commandName);
  });
};


Helper.getServices = function(commandName, callback) {
    var statusServices = [];
    var statusServiceBuffer = null;
    var cmd = "systemctl is-active WiRocPython.service";
    exec(cmd, function(error, stdout, stderr) {
      statusServices.push({ Name: 'WiRocPython', Status: stdout.trim('\n') });
      var cmd = "systemctl is-active WiRocPythonWS.service";
      exec(cmd, function(error, stdout, stderr) {
        statusServices.push({ Name: 'WiRocPythonWS', Status: stdout.trim('\n') });
        var cmd = "systemctl is-active blink.service";
        exec(cmd, function(error, stdout, stderr) {
           statusServices.push({ Name: 'WiRocMonitor', Status: stdout.trim('\n') });
           jsonStr = JSON.stringify({ services: statusServices });
           statusServiceBuffer = new Buffer(jsonStr, "utf-8");
           console.log(jsonStr);
           callback('OK', commandName + ';' + statusServiceBuffer);
        });
      });
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

Helper.getListWifi = function(commandName, callback) {
  // Get new wifi list
  var cmd = 'nmcli -m multiline -f ssid,active,signal device wifi list';
  exec(cmd, function(error, stdout, stderr) {
    var wifiNetworks = stdout.split(/\r?\n/).slice(0,-1); // remove last empty element
    wifiNetworks = wifiNetworks.map(function(s) { return s.slice(40).trim() });
    var wifiDataList = wifiNetworks.join('\n');
    callback('OK', commandName + ';' + wifiDataList);
  });
};

Helper.connectWifi = function(commandName, commandValue, callback) {
  var hostname = os.hostname();
  var wlanIFace = 'wlan0';
  if (hostname.toLowerCase() != 'chip') {
    wlanIFace = 'wlp2s0';
  }
  
  var wifiName = commandValue.split(/\r?\n/)[0];
  var wifiPassword = commandValue.split(/\r?\n/)[1];
  var cmd = "nmcli device wifi connect '" + wifiName + "' password '" + wifiPassword + "' ifname " + wlanIFace;
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
     if (error) {
       console.log('error code: "' + error + '"');
       console.log(stderr);
       callback('ERROR',commandName + ';' + stderr);
     }
     console.log(stdout);
     callback('OK', commandName + ';CONNECTED');
  });
};

Helper.disconnectWifi = function(commandName, callback) {
  var hostname = os.hostname();
  var wlanIFace = 'wlan0';
  if (hostname.toLowerCase() != 'chip') {
    wlanIFace = 'wlp2s0';
  }
  
  var cmd = "nmcli device disconnect " + wlanIFace;
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
     if (error) {
       console.log('error code: "' + error + '"');
       console.log(stderr);
       callback('ERROR', commandName + ';' + stderr);
     }
     console.log(stdout);
     callback('OK', commandName + ';DISCONNECTED');
  });
};

Helper.dropAllTables = function(commandName, callback) {
  // stop WiRoc-Python service
  var child = exec("systemctl stop WiRocPython.service", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
      callback('ERROR', commandName + ';' + error);
    } else {
      httphelper.dropAllTables(function(status, retWebServiceStatus) {
        console.log('Helper.dropAllTables - status = "' + status + '" value = ' + (retWebServiceStatus != null ? retWebServiceStatus : 'null'));
        if (status == 'OK' && retWebServiceStatus == 'OK') {
          // start WiRoc-Python service
          child2 = exec("systemctl start WiRocPython.service", function (error, stdout, stderr) {
            if (error !== null) {
              callback('ERROR', commandName + ';' + error);
            } else {
              callback('OK', commandName);
            }
          });
        } else {
           // start WiRoc-Python service
           child2 = exec("systemctl start WiRocPython.service", function (error, stdout, stderr) {
             callback('ERROR', commandName + ';');
           });
        }
      });
    }
  });
};

Helper.uploadLogArchive = function(commandName, callback) {
  console.log('Helper.uploadLogArchive');
  helper.getBTAddress(function(status, btAddress) {
    if (status == 'OK') {
      var dateNow = new Date();
      var zipFilePath = helper.getZipFilePath(btAddress, dateNow);
      Helper.zipLogArchive(zipFilePath, function(status2) {
        if (status2 == 'OK') {
          httphelper.getApiKey(function(status3, apiKey) {
            if (status3 == 'OK') {
              httphelper.getWebServerUrl(function(status4, serverUrl) {
                if (status4 == 'OK') {
                  httphelper.getWebServerHost(function(status5, serverHost) {
                    if (status5 == 'OK') {
                      Helper.uploadLogArchive(apiKey, zipFilePath, serverUrl, serverHost, function(status6) {
                        if (status6 == 'OK') {
                          console.log('Helper.uploadLogArchive - uploadLogArchive status == OK');
                          callback('OK', commandName);
                        } else {
                          console.log('Helper.uploadLogArchive - uploadLogArchive status != OK');
                          callback('ERROR', commandName + ';uploadLogArchive');
                        }
                      });
                    } else {
                      console.log('Helper.uploadLogArchive - getWebServerHost status != OK');
                      callback('ERROR', commandName + ';getWebServerHost');
                    }
                  });
                } else {
                  console.log('Helper.uploadLogArchive - getWebServerUrl status != OK');
                  callback('ERROR', commandName + ';getWebServerUrl');
                }
              });
            } else {
               console.log('Helper.uploadLogArchive - getApiKey status != OK');
               callback('ERROR', commandName + ';getApiKey');
            }
          });
        } else {
          console.log('Helper.uploadLogArchive - zipLogArchive status != OK');
          callback('ERROR', commandName + ';zipLogArchive');
        }
      });
    } else {
      console.log('Helper.uploadLogArchive - getBTAddress status != OK');
      callback('ERROR', commandName + ';getBTAddress');
    }
  });
};

Helper.upgradeWiRocPython = function(commandName, commandValue, callback) {
  console.log('Helper.upgradeWiRocPython - wirocpython, version: ' + commandValue);
  helper.upgradeWiRocPython(commandValue, function (status) {
    if (status == "OK") {
      callback('OK', commandName);
    }
  });
};

Helper.upgradeWiRocBLE = function(commandName, commandValue, callback) {
  console.log('Helper.upgradeWiRocBLE - wirocble, version: ' + commandValue);
  helper.upgradeWiRocBLE(commandValue, function (status) {
    if (status == "OK") {
      callback('OK', commandName);
    }
  });
};

Helper.getZipFilePath = function(btAddress, date) {
	var filePath = "/home/chip/LogArchive/LogArchive_" + btAddress + "_" + date.toISOString() + ".zip";
	return filePath;
};


Helper.zipLogArchive = function(zipFilePath, callback) {
  var cmd = "zip " + zipFilePath + " /home/chip/WiRoc-Python-2/WiRoc.db /home/chip/WiRoc-Python-2/WiRoc.log*";
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
  const fs = require('fs');
  var parentDir = path.resolve(__dirname, '..');
  var logfile = path.join(parentDir, 'installWiRocPython.log');
  const out = fs.openSync(logfile, 'a');
  const err = fs.openSync(logfile, 'a');
  const child = spawn('./installWiRocPython.sh', [version], {
    detached: true,
    stdio: ['ignore', out, err],
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
  const fs = require('fs');
  var parentDir = path.resolve(__dirname, '..');
  var logfile = path.join(parentDir, 'installWiRocBLE.log');
  const out = fs.openSync(logfile, 'a');
  const err = fs.openSync(logfile, 'a');
  const child = spawn('./installWiRocBLE.sh', [version], {
    detached: true,
    stdio: ['ignore', out, err],
    cwd: parentDir
  });
  child.unref();
  console.log("Spawned installWiRocBLE.sh");
  callback('OK');
};

Helper.stopHCI = function(callback) {
  var cmd = "hciconfig hci0 down";
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('Helper.stopHCI: error code: "' + error + '"');
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

Helper.startHCI = function(callback) {
  var cmd = "hciconfig hci0 up";
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('Helper.startHCI: error code: "' + error + '"');
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

Helper.startPatchAP6212 = function(callback) {
  var hostname = os.hostname();
  if (hostname != "nanopiair") {
    callback("OK"); // only nanopiair needs patching
  }
  var cmd = "systemctl start ap6212-bluetooth";
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log('Helper.startPatchAP6212: First try. Error code: "' + error + '"');
      console.log(stderr);
      sleep.sleep(4);
      exec(cmd, function(error, stdout, stderr) {
        if (error) {
          console.log('Helper.startPatchAP6212: Second/last try. Error code: "' + error + '"');
          console.log(stderr);
          callback('ERROR');
        } else {
          if (stdout.length > 0) {
            console.log(stdout);
          }
          callback('OK');
        }
      });
    } else {
      if (stdout.length > 0) {
        console.log(stdout);
      }
      callback('OK');
    }
  });
};

Helper.getAll = function(commandName, callback) {
  console.log('HttpHelper - getAll');
  httphelper.getHttpGetResponse('/api/all/', function(status, body) {
    if (status != 'OK') { callback(status, commandName); return;}
    var all = (body == null ? null : JSON.parse(body).All);
    Helper.getBatteryLevel(function(status, intPercent) {
      if (status != 'OK') { callback(status, commandName); return;}
      Helper.getIP2('getip', function(status, data) {
        if (status != 'OK') { callback(status, commandName + ';' + data); return;}
        var ipAddress = data.split(';')[1];
        all = all.replace('%ipAddress%', ipAddress).replace('%batteryPercent%', intPercent);
        callback(status, commandName + ';' + all);
      });
    });
  });
};

module.exports = Helper;
