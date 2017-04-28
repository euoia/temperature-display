/* Application configuation (can be loaded from .env) */
const _ = require('lodash');

// Load environment variables with the -r option, e.g.
// node -r dotenv/config app.js

module.exports = {
  displayIndexMilliseconds: process.env.DISPLAY_IDX_MS,
  displayTimeMilliseconds: process.env.DISPLAY_TIME_MS,
  log: {
    level: process.env.LOG_LEVEL,
    dir: process.env.LOG_DIR,
    loggly_token: process.env.LOG_LOGGLY_TOKEN,
    loggly_subdomain: process.env.LOG_LOGGLY_SUBDOMAIN
  },
  // devices are listed as path, value pairs. We convert to an array of objects.
  devices: _.chunk(process.env.DEVICES.split(' '), 2)
    .map(values => {return {path: values[0], location: values[1]}})
}
