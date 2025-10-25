import expree from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();
startSendOtpConsumer();
const app = expree();
app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map