const nodemailer = require("nodemailer");

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type:         "OAuth2",
            user:         process.env.EMAIL_USER,
            clientId:     process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN
        }
    });
    return transporter;
};

const sendEmail = async (toEmail, subject, htmlContent) => {
    const transporter = await createTransporter();
    const result = await transporter.sendMail({
        from:    `"Knots" <${process.env.EMAIL_USER}>`,
        to:      toEmail,
        subject,
        html:    htmlContent
    });
    console.log("Email sent:", result.messageId);
    return result;
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