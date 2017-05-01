/* Application */
const log = require('./log.js');
const config = require('./config.js');
const temperatureSensor = require('@euoia/rasp2c/temperature');
const _ = require('lodash');
const ledBackpack = require('@euoia/led-backpack');
const temperatureDisplay = require('@euoia/led-backpack/temperature');

// Show the device index and then the device temperature.
// After completion, call itself with the next index.
function showDeviceTemperature (deviceIdx) {
  if (deviceIdx > config.devices.length) {
    deviceIdx = 0;
  }

  function showTemperature() {
    const device = config.devices[deviceIdx];

    temperatureSensor.readTemperature(device.path)
      .then(celsius => {
        temperatureDisplay.displayTemperature(celsius)

        // After a configurable period, show the next device temperature.
        setTimeout(showDeviceTemperature.bind(this, deviceIdx + 1), config.displayTimeMilliseconds);
      });
  }

  // Show the index.
  ledBackpack.clear();
  ledBackpack.setDigit(0, deviceIdx);

  // Then show the temperature.
  setTimeout(showTemperature, config.displayIndexMilliseconds);
}

log.info(`Displaying temperatures from: ${_.map(config.devices, 'location').join(', ')}.`);
showDeviceTemperature(0);
