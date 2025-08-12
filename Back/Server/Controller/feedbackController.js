import { createPool } from "../DB/noticeDB.js";

const db = await createPool();

export async function add_feedback(req, res)
{
    try{
        const data = req.body;
        await db.execute(`
            INSERT INTO feedbacks
            (feedback), (?)`, [data.text]);

        return res.status(201).json({
            success: true
        });

    } catch(err) {
        console.log(err);
        return res.status(404).json({
            success: false
        });
    }
}