const Valid = require("../models/validModel");

exports.addValidObject = async (validObject) => {
  try {
    const current_item = new Valid({
      valid_object: validObject,
    });
    const response = await current_item.save();
    return response;
  } catch (err) {
    throw Error("Error while adding item");
  }
};
