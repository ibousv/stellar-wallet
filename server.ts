import { wallet, horizon, anchor,authToken,sep10,authKey,keypair, sep12,sep6,watcher} from "./config";

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

        "/api/v1/deposit": {
            POST: async (req: Request) => {
                const { account, asset_code } = await req.json();
        
                if (!account || !asset_code) {
                    return new Response(JSON.stringify({ error: "Missing account or asset_code" }), { status: 400 });
                }
        
                const deposit = await sep6.deposit({
                    authToken,
                    params: {
                        asset_code,
                        account,
                    },
                });
         
                return new Response(JSON.stringify(deposit), {
                    headers: { "Content-Type": "application/json" },
                });
            },
        },
        
        "/api/v1/withdraw": {
    POST: async (req: Request) => {
        try {
            const { asset_code, account, type, dest, dest_extra, authToken } = await req.json();

            if (!asset_code || !account || !type || !dest || !authToken) {
                return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
            }

            const resp = await sep6.withdraw({
                authToken,
                params: {
                    asset_code,
                    account,
                    type,
                    dest,
                    dest_extra,
                },
            });

            return new Response(JSON.stringify(resp), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });

        } catch (error) {
            console.error("Error processing withdrawal:", error);
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    },
        },

        "/api/v1/deposit-exchange": {
    POST: async (req: Request) => {
        try {
            // Récupérer les paramètres de la requête JSON
            const { destination_asset, source_asset, amount, authToken } = await req.json();

            // Vérifier que tous les paramètres requis sont fournis
            if (!destination_asset || !source_asset || !amount || !authToken) {
                return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
            }

            // Appel à sep6.depositExchange
            const resp = await sep6.depositExchange({
                authToken,
                params: {
                    destination_asset,
                    source_asset,
                    amount,
                },
            });

            // Retourner la réponse réussie
            return new Response(JSON.stringify(resp), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });

        } catch (error) {
            console.error("Error processing deposit exchange:", error);
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    },
        },

        "/api/v1/withdraw-exchange": {
    POST: async (req: Request) => {
        try {
            // Récupérer les paramètres de la requête JSON
            const { destination_asset, source_asset, amount, type, authToken } = await req.json();

            // Vérifier que tous les paramètres requis sont fournis
            if (!destination_asset || !source_asset || !amount || !type || !authToken) {
                return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
            }

            // Appel à sep6.withdrawExchange
            const resp = await sep6.withdrawExchange({
                authToken,
                params: {
                    destination_asset,
                    source_asset,
                    amount,
                    type,
                },
            });

            // Retourne la réponse normale de l’ancre SEP-6
            return new Response(JSON.stringify(resp), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });

        } catch (error) {
            console.error("Error processing withdraw exchange:", error);
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    },
        },

        "/api/v1/watch-transaction": {
    POST: async (req: Request) => {
        try {
            // Récupérer les paramètres de la requête JSON
            const { authToken, assetCode, txId } = await req.json();

            // Vérifier que les paramètres requis sont fournis
            if (!authToken || !assetCode || !txId) {
                return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
            }

            // Création du watcher pour suivre la transaction SEP-6
            const { stop, refresh } = watcher.watchOneTransaction({
                authToken,
                assetCode,
                id: txId,
                onSuccess: (tx) => {
                    console.log("Transaction successful:", tx);
                },
                onMessage: (message) => {
                    console.log("Transaction update:", message);
                },
                onError: (error) => {
                    console.error("Transaction error:", error);
                },
            });

            return new Response(JSON.stringify({ message: "Watcher started", txId }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });

        } catch (error) {
            console.error("Error starting watcher:", error);
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    },
        },
    
    
}})
console.log("The server is running on port 3003");