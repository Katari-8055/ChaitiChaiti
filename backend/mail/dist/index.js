import expree from "express";
import dotenv from "dotenv";
dotenv.config();
const app = expree();
app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map