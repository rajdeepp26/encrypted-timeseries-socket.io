const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const listenerDB = require("../db-access/listenerDB");

exports.saveToDb = async (validObject) => {
  try {
    const dbResponse = await listenerDB.addValidObject(validObject);
    if (Object.keys(dbResponse).length <= 2) {
      throw Error("Object was not saved in Db");
    }
    let validData = dbResponse.valid_object;
    return validData;
  } catch (err) {
    throw Error("Error while getting all decrypted Data");
  }
};

exports.getDecryptedObject = async (encryptedData) => {
  try {
    let dataArray = encryptedData.split(':');
    let iv = dataArray.shift();
    let key = process.env.SECRET_KEY;

    const decrypter = crypto.createDecipheriv("aes-256-ctr", key, iv);
    let decryptedData = decrypter.update(dataArray[0].toString(), "hex", "utf-8");
    return decryptedData;
  } catch (err) {
    throw Error("Error while adding decrypting object");
  }
};

exports.validateObject = async (decryptedData) => {
  try {
    let receivedObject = JSON.parse(decryptedData);

    const testData = {
      name: receivedObject.name,
      origin: receivedObject.origin,
      destination: receivedObject.destination,
    };

    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(testData));
    let testHashedValue = hash.digest("hex");
    if (testHashedValue == receivedObject.secret_key) {
      return testData;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};
