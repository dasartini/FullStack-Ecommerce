import nodemailer from "nodemailer";

export const contactUs = async (req, res) => {
    try {
        const { email, message, sender, phoneNumber } = req.body;

        if (!email || !message || !sender || !phoneNumber) {
            throw new Error("All fields are required.");
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.GMAIL_RECEIVER,
            subject: 'New Contact Form Submission',
            text: `${sender} sent you a message:
            ${message}

            Customer email: ${email}
            Customer phone number: ${phoneNumber}
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ error: "Failed to send email." });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Email sent successfully!' });
            }
        });
    } catch (error) {
        console.error("Error handling contact form submission:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
