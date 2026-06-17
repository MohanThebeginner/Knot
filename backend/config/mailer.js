const https = require("https");

const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        const data = new URLSearchParams({
            client_id:     process.env.GMAIL_CLIENT_ID,
            client_secret: process.env.GMAIL_CLIENT_SECRET,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            grant_type:    "refresh_token"
        }).toString();

        const options = {
            hostname: "oauth2.googleapis.com",
            path:     "/token",
            method:   "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        const req = https.request(options, (res) => {
            let body = "";
            res.on("data", chunk => body += chunk);
            res.on("end", () => {
                const parsed = JSON.parse(body);
                if (parsed.access_token) resolve(parsed.access_token);
                else reject(new Error("Failed to get access token: " + body));
            });
        });

        req.on("error", reject);
        req.write(data);
        req.end();
    });
};

const sendEmail = async (toEmail, subject, htmlContent) => {
    const accessToken = await getAccessToken();

    // Build RFC 2822 email format
    const emailLines = [
        `From: Knots <${process.env.EMAIL_USER}>`,
        `To: ${toEmail}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        htmlContent
    ].join("\n");

    // Base64 encode
    const encodedEmail = Buffer.from(emailLines)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const data = JSON.stringify({ raw: encodedEmail });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: "gmail.googleapis.com",
            path:     "/gmail/v1/users/me/messages/send",
            method:   "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        };

        const req = https.request(options, (res) => {
            let body = "";
            res.on("data", chunk => body += chunk);
            res.on("end", () => {
                console.log("Gmail API response:", body);
                resolve(body);
            });
        });

        req.on("error", (err) => {
            console.error("Gmail API error:", err);
            reject(err);
        });

        req.write(data);
        req.end();
    });
};

module.exports.sendVerificationEmail = async (toEmail, token) => {
    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;
    await sendEmail(
        toEmail,
        "Verify your email",
        `
            <h2>Welcome to Knots!</h2>
            <p>Click below to verify your email:</p>
            <a href="${link}">${link}</a>
            <p>Link expires in 24 hours.</p>
        `
    );
};

module.exports.sendPasswordResetEmail = async (toEmail, token) => {
    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail(
        toEmail,
        "Reset your password",
        `
            <h2>Password Reset</h2>
            <p>Click below to reset your password:</p>
            <a href="${link}">${link}</a>
            <p>Link expires in 1 hour.</p>
        `
    );
};