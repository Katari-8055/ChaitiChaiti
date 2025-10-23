import ampq from "amqplib";

let channel: ampq.Channel;

export const connectToRabbitMQ = async () => {
    try {
        const connection = await ampq.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
        })
        channel = await connection.createChannel();
        console.log("💦Connected to RabbitMQ");
    } catch (error) {
        console.log("Failed to connect to RabbitMQ",error)
    }
}

export const publishToQueue = async (queueName: string, message: any) =>{
    if(!channel){
        console.log("RabbitMQ Channel is not defined");
        return;
    
    }
    await channel.assertQueue(queueName, {durable:true});
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
        persistent:true
    })
    
}