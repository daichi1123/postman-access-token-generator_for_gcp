const navigator = {};
const window = {};

const createAccessToken = async (KJUR) => {
    const pk = pm.environment.get("privateKey").replace(/\\n/g, '\n');
    const ce = pm.environment.get("clientEmail");
    const tokenUri = "https://oauth2.googleapis.com/token"
    const serviceAccount = {
        private_key: pk,
        client_email: ce,
        token_uri: tokenUri,
    }

    const now = Math.floor(Date.now() / 1000);
    const tUrl = pm.environment.get("targetUrl");
    const payload = {
        iss: serviceAccount.client_email,
        sub: serviceAccount.client_email,
        aud: serviceAccount.token_uri,
        scope: tUrl,
        iat: now,
        exp: now + 3600,
    };
    const stringPayload = JSON.stringify(payload);

    const header = {
        alg: "RS256",
        typ: "JWT",
    }
    const stringHeader = JSON.stringify(header);

    let jwt;
    try {
        jwt = KJUR.jws.JWS.sign(
            "RS256",
            stringHeader,
            stringPayload,
            serviceAccount.private_key
        );
    } catch (error) {
        console.log(error)
    }

    let accessToken;
    try {
        const response = await new Promise((resolve, reject) => {
            pm.sendRequest({
                url: serviceAccount.token_uri,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: {
                    mode: "urlencoded",
                    urlencoded: [
                        { key: "grant_type", value: "urn:ietf:params:oauth:grant-type:jwt-bearer" },
                        { key: "assertion", value: jwt }
                    ]
                }
            }, function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        const tokenData = response.json();
        accessToken = tokenData.id_token;
    } catch(error) {
        console.log(error)
    }
    return accessToken;
}

const jsrsasignUrl = "https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.20/jsrsasign-all-min.js"
pm.sendRequest(jsrsasignUrl, async function (err, response) {
    if (err) {
        console.log("Error fetching the script:", err);
    } else {
        eval(response.text());
        const accessToken = await createAccessToken(KJUR)
        pm.environment.set("accessToken", accessToken)
    }
});
