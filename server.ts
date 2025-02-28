import { wallet, horizon, anchor } from "./config";

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
    }
}})
console.log("The server is running on port 3003");