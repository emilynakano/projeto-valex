import { Router } from "express";

const cardRouter = Router();

cardRouter.post('/test', async (req, res) => {
    res.send("oi")
});

export default cardRouter