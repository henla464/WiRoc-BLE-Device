#!/bin/bash

echo "start update wiroc ble"
WiRocBLEVersion=${1/v/}
sleep 2
systemctl stop WiRocBLE
echo "after stop WiRocBLE"
wget -O WiRoc-BLE-Device.tar.gz https://github.com/henla464/WiRoc-BLE-Device/archive/v$WiRocBLEVersion.tar.gz
sleep 5
rm -rf WiRoc-BLE-Device
echo "after rm"
tar xvfz WiRoc-BLE-Device.tar.gz WiRoc-BLE-Device-$WiRocBLEVersion
echo "after tar"
mv WiRoc-BLE-Device-$WiRocBLEVersion WiRoc-BLE-Device
echo "after mv"
systemctl start WiRocBLE
echo "after start WiRocBLE"

