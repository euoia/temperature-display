/* Application */
const log = require('./log.js');
const config = require('./config.js');
const temperatureSensor = require('@euoia/rasp2c/temperature');
const _ = require('lodash');
const ledBackpack = require('@euoia/led-backpack');
const temperatureDisplay = require('@euoia/led-backpack/temperature');
const process = require('process');

function exitHandler() {
  log.info('temperature-display shutting down');
  ledBackpack.clear();
  process.exit();
}

// Ensure the display is cleared when this process exits.
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

// Show the device index and then the device temperature.
// After completion, call itself with the next index.
function showDeviceTemperature (deviceIdx) {
  if (deviceIdx >= config.devices.length) {
    deviceIdx = 0;
  }

  function showTemperature() {
    const device = config.devices[deviceIdx];

    temperatureSensor.readTemperature(device.path)
      .then(celsius => {
        log.info(`Displaying ${celsius}°C for ${device.location}.`);

        // TODO: Add enableColon to temperatureDisplay.
        ledBackpack.enableColon();
        temperatureDisplay.displayTemperature(celsius)

        // After a configurable period, show the next device temperature.
        setTimeout(showDeviceTemperature.bind(this, deviceIdx + 1), config.displayTimeMilliseconds);
      });
  }

  // Show the index.
  ledBackpack.clear();
  ledBackpack.disableColon();
  ledBackpack.setDigit(4, deviceIdx + 1);

  // Then show the temperature.
  setTimeout(showTemperature, config.displayIndexMilliseconds);
}

ledBackpack.init(() => {
  log.info(`Displaying temperatures from: ${_.map(config.devices, 'location').join(', ')}.`);
  ledBackpack.enableColon();
  ledBackpack.setBrightness(ledBackpack.MAX_BRIGHTNESS);
  ledBackpack.setBlinkRate(ledBackpack.BLINKRATE_OFF);
  showDeviceTemperature(0);
});

