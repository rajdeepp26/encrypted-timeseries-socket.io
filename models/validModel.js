const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema({
    timestamp: {
      type: Date,
      default: Date.now,
    },
    valid_object: {
      name: String,
      origin: String,
      destination: String,
    },
  },
  {
    timeseries: {
      timeField: "timestamp",
      granularity: "minutes",
    },
  }
);

const Valid = mongoose.model("Valid", objectSchema);

module.exports = Valid;
