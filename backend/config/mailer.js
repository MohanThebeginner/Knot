const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host:   "smtp.gmail.com",
    port:   587,
    secure: false,
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

module.exports.sendVerificationEmail = async(toEmail, token)=> {
    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;
    await transporter.sendMail({
        from: `"Knots" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Verify your email",
        html: `
            <h2>Welcome!</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${link}">${link}</a>
            <p>This link expires in 24 hours.</p>`
    });
};

module.exports.sendPasswordResetEmail = async (toEmail, token) => {
    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
        from:    `"Knots" <${process.env.EMAIL_USER}>`,
        to:      toEmail,
        subject: "Reset your password",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${link}">${link}</a>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, ignore this email.</p>
        `
    });
};

