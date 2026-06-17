const Brevo = require("@getbrevo/brevo");

const client = Brevo.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new Brevo.TransactionalEmailsApi();

module.exports.sendVerificationEmail = async (toEmail, token) => {
    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;

    await transactionalApi.sendTransacEmail({
        sender:  { email: process.env.EMAIL_USER, name: "Knots" },
        to:      [{ email: toEmail }],
        subject: "Verify your email",
        htmlContent: `
            <h2>Welcome to Knots!</h2>
            <p>Click below to verify your email:</p>
            <a href="${link}">${link}</a>
            <p>Link expires in 24 hours.</p>
        `
    });
};

module.exports.sendPasswordResetEmail = async (toEmail, token) => {
    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transactionalApi.sendTransacEmail({
        sender:  { email: process.env.EMAIL_USER, name: "Knots" },
        to:      [{ email: toEmail }],
        subject: "Reset your password",
        htmlContent: `
            <h2>Password Reset</h2>
            <p>Click below to reset your password:</p>
            <a href="${link}">${link}</a>
            <p>Link expires in 1 hour.</p>
        `
    });
};