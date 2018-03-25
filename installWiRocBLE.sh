#!/bin/bash

WiRocBLEVersion=${1/v/}
systemctl stop WiRocBLE
wget -O WiRoc-BLE-Device.tar.gz https://github.com/henla464/WiRoc-BLE-Device/archive/v$WiRocBLEVersion.tar.gz
rm -rf WiRoc-BLE-Device
tar xvfz WiRoc-BLE-Device.tar.gz WiRoc-BLE-Device-$WiRocBLEVersion
mv WiRoc-BLE-Device-$WiRocBLEVersion WiRoc-BLE-Device
systemctl start WiRocBLE

