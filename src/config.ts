// Main configuration
import { Wallet } from "@stellar/typescript-wallet-sdk";

const wallet = Wallet.TestNet();

const horizon = wallet.stellar();

const anchor = wallet.anchor({ homeDomain: "testanchor.stellar.org" });

const sep10 = await anchor.sep10();

export { wallet, horizon, anchor, sep10 };
