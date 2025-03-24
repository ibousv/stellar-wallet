import { PublicKeypair, SigningKeypair } from "@stellar/typescript-wallet-sdk";
import { wallet, horizon, anchor, sep10 } from "../config";

Bun.serve({
  port: 3003,
  routes: {
    "/api/info": {
      GET: async () => {
        let resp = await anchor.sep1(true);
        const jsonBody = JSON.stringify(resp);

        return new Response(jsonBody, {
          headers: { "Content-Type": "application/json" },
        });
      },
    },

    "/api/auth": {
      GET: async (req: Request) => {
        try {
          const url = new URL(req.url);
          const account: any = url.searchParams.get("account");

          if (!account) {
            return new Response(
              JSON.stringify({ error: "Missing 'account' parameter" }),
              { status: 400 }
            );
          }
          const authKey = SigningKeypair.fromSecret(
            "SACYSXARZZ4RUPOCXZ4F6IUSRKX7PXDWVWYFRI2EF6IMMUUZR54ZFDIW"
          );
          const authToken = await sep10.authenticate({ accountKp: authKey });

          return new Response(JSON.stringify({ token: authToken.token }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ error: (err as Error).message })
          );
        }
      },
    },
    // Need further review
    /*
    "/api/v1/kyc": {
      POST: async (req: Request) => {
        try {
          // Envoyer les infos KYC à l'anchor via SEP-12
          const response = await sep12.add({
            sep9Info: {
              first_name: "Mohamed",
              last_name: "Camara",
              email_address: "walyfaye@gmail.com",
              bank_number: "22554",
              bank_account_number: "8025468",
            },
            sep9BinaryInfo: {
              photo_id_front: Buffer.from(
                "BASE64_ENCODED_IMAGE_FRONT",
                "base64"
              ),
              photo_id_back: Buffer.from("BASE64_ENCODED_IMAGE_BACK", "base64"),
            },
          });

          return new Response(
            JSON.stringify({ success: true, response: response }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 500 }
          );
        }
      },
    }, */
  },
});
console.log("The server is running on port 3003");
