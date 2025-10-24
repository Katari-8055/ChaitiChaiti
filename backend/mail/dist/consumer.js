import ampq from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const startSendOtpConsumer = async () => {
    try {
        const connection = await ampq.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
        });
        const channel = await connection.createChannel();
        const queueName = "send-otp";
        await channel.assertQueue(queueName, { durable: true });
        console.log("💦 Mail service Consumer started, listening for otp emails");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const transpoter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD,
                        },
                    });
                    await transpoter.sendMail({
                        from: "Chaiti Chaiti",
                        to,
                        subject,
                        text: body,
                    });
                    console.log(`Email sent to ${to}`);
                    channel.ack(msg);
                }
                catch (error) {
                    console.log("Failed to Send OTP", error);
                }
            }
        });
    }
    catch (error) {
        console.log("Failed to start rabbitmq consumer", error);
    }
};
//# sourceMappingURL=consumer.js.map