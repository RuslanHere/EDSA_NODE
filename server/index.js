const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const app = express();
const cors = require("cors");
const port = 3042;

const { hashMessage } = require("./scripts/hashMessage");

app.use(cors());
app.use(express.json());

const balances = {
  "03d6c12e82b6e06b6480a75b03da185364ae83140ce5e769e6932add828a78f621": 100,
  "02ff17d3ee03025ba36ec78b4135e177365279d9b8c830a25e4196ff6e018b8733": 50,
  "035e16eb08570bcb9ec4f5f23beeee2a6e587cbd81c2bf44558d2cf9c7e1933e51": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const { sender, recipient, amount, privateKey } = req.body;
  const hashedMessage = hashMessage(`${amount}`);

  const signature = secp256k1.sign(hashedMessage, privateKey);
  const publicKey = secp256k1.getPublicKey(privateKey);
  const isValid = secp256k1.verify(signature, hashedMessage, publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);
  if (isValid) {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
