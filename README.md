# Temperature Display

Reads temperatures from one or more DS18B20 temperature sensors and displays
them on an i2c LED display.

## Requirements

This JavaScript application runs with Node.js version 6.5.0 or higher.

To configure the application copy `.env.example` to `.env` and run with `npm
start`.

In order to run, the application must have read access to the DS18B20 probes
configured as `DEVICES`.

This program is intended to run on a Raspberry Pi, but may work in other
environments.
