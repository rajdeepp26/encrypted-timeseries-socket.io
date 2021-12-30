const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");

exports.createObjectFromFile = (fileObject) => {
  try {
    let obj = JSON.parse(fileObject);
    let namesLength = obj.names.length;
    let citiesLength = obj.cities.length;

    const transformedObject = {
      name: obj.names[Math.floor(Math.random() * (namesLength - 0) + 0)],
      origin: obj.cities[Math.floor(Math.random() * (citiesLength - 0) + 0)],
      destination:
        obj.cities[Math.floor(Math.random() * (citiesLength - 0) + 0)],
    };
    return transformedObject;
  } catch (err) {
    throw Error("Error while creating object from file");
  }
};

exports.addHashToObject = (transformedObject) => {
  try {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(transformedObject));
    let hashedValue = hash.digest("hex");
    transformedObject.secret_key = hashedValue;

    return transformedObject;
  } catch (err) {
    throw Error("Error while adding hash to the object");
  }
};

exports.encryptObject = (transformedObjectWithHash) => {
  try {
    // const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
    const iv = process.env.IV;
    const key = process.env.SECRET_KEY;
    const message = JSON.stringify(transformedObjectWithHash);

    const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);
    let encryptedMessage = encrypter.update(message, "utf8", "hex");

    return encryptedMessage;
  } catch (err) {
    throw Error("Error while encrypting the object");
  }
};
