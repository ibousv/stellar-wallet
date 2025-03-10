import { wallet, horizon, anchor,authToken,sep10,authKey,keypair, sep12} from "./config";

console.log("Public Key:", keypair.publicKey());
console.log("Secret Key:", keypair.secret());

Bun.serve({
    port: 3003,
    routes:{

        "/api/v1/info" :{
            GET: async () => {
                
                let resp = await anchor.sep1(true);
                const jsonBody = JSON.stringify(resp);

                return new Response(jsonBody,{
                    headers: { "Content-Type": "application/json" }
                  })
        }
    },

    //http://localhost:3003/api/v1/auth?account=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        "/api/v1/auth": {
            GET: async (req: Request) => {
                try {
                const url = new URL(req.url);
                const account = url.searchParams.get("account");

                if (!account) {
                    return new Response(JSON.stringify({ error: "Missing 'account' parameter" }), { status: 400 });
                }

                return new Response(JSON.stringify({ transaction: authToken}), {
                    headers: { "Content-Type": "application/json" },
                });
              } catch (err) {
                return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
              }
            },
        },

    /*  fetch("http://localhost:3003/api/v1/validate", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction: "SIGNED_TRANSACTION_XDR" })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
    */
        "/api/v1/validate": {
            POST: async (req: Request) => {
                try {
                    const { transaction } = await req.json();
                    if (!transaction) {
                        return new Response(JSON.stringify({ error: "Missing transaction" }), { status: 400 });
                    }

                    return new Response(JSON.stringify({ token: authToken }), {
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (err) {
                    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
                }
            },
        },
/*
fetch("http://localhost:3003/api/v1/kyc", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({})
})
.then(response => response.json())
.then(data => console.log("✅ Réponse du serveur:", data))
.catch(error => console.error("❌ Erreur:", error));
*/
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
                            bank_account_number: "8025468"
                        },
                        sep9BinaryInfo: {
                            photo_id_front: Buffer.from("BASE64_ENCODED_IMAGE_FRONT", "base64"),
                            photo_id_back: Buffer.from("BASE64_ENCODED_IMAGE_BACK", "base64"),
                        },
                    });

                    return new Response(JSON.stringify({ success: true, response: response }), {
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (err) {
                    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
                }
            },
        },
    
}})
console.log("The server is running on port 3003");