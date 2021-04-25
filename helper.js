var exec = require('child_process').exec;
var os = require("os");
var sleep = require('sleep');
var httphelper = require('./http-helper');

var Helper = Helper || {}

Helper.upgradeWiRocPython = function(commandName, version, callback) {
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
  callback('OK', commandName + '\tOK');
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
    return;
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


module.exports = Helper;
