// Main configuration 
import { Keypair, SigningKeypair, Wallet } from "@stellar/typescript-wallet-sdk";

let wallet = Wallet.TestNet();

let horizon = wallet.stellar();

let anchor = wallet.anchor({ homeDomain: "testanchor.stellar.org" });

const keypair = Keypair.random();

const secretKey = (keypair.secret());

const authKey = SigningKeypair.fromSecret(secretKey);

const sep10 = await anchor.sep10();

const authToken = await sep10.authenticate({ accountKp: authKey });

const sep12 = await anchor.sep12(authToken);

export {wallet, horizon, anchor,authToken,sep10,authKey,keypair,sep12} ;
