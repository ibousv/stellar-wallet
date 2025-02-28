// Main configuration 
import { Wallet } from "@stellar/typescript-wallet-sdk";

let wallet = Wallet.TestNet();

let horizon = wallet.stellar();

let anchor = wallet.anchor({ homeDomain: "testanchor.stellar.org" });

export {wallet, horizon, anchor} ;