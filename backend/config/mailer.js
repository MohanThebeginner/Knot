// config/mailer.js
const https = require("https");

const sendEmail = async (toEmail, subject, htmlContent) => {
    const data = JSON.stringify({
        sender:      { email: process.env.EMAIL_USER, name: "Knots" },
        to:          [{ email: toEmail }],
        subject,
        htmlContent
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.brevo.com",
            path:     "/v3/smtp/email",
            method:   "POST",
            headers: {
                "Content-Type":  "application/json",
                "api-key":       process.env.BREVO_API_KEY
            }
        };

        const req = https.request(options, (res) => {
            let body = "";
            res.on("data", chunk => body += chunk);
            res.on("end", () => {
                console.log("Brevo response:", body); // ← add this
                resolve(body);
            });
        });

        req.on("error", (err) => {
            console.error("Brevo error:", err); // ← add this
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