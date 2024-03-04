// not used in app.js --> it gives error that middleware function is required
// const { morgan } = require("./npmPackages");
// const logger = require("../logging/index");

// exports.morganLogger = async (req, res, next) => {
//   morgan("tiny", {
//     stream: {
//       write: (message) => logger.http(message.trim()),
//     },
//   });
//   next();
// };
