const secp256k1 = require("@noble/secp256k1");

const { hashMessage } = require("./hashMessage");

async function recoverKey(message, signature, recoveryBit) {
  const hashedMessage = hashMessage(message)

  return secp256k1.recoverPublicKey(hashedMessage,signature,recoveryBit)
}

module.exports = { recoverKey };
