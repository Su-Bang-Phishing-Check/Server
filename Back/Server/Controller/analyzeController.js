import axios from 'axios';

const AI_server = axios.create({
    baseURL: "http://ai_server:3100/",
    timeout: 3000
})

export async function analyse_text(req, res)
{
    try{
        
        if(!req.body)
        {
            console.log("no body");
            
            return res.status(404).json({
                message: "no text"
            });
        }

        const text = req.body.text;
        console.log(text);

        const result = await AI_server.request({
            url: "text",
            method: "post",
            data: {
                text: text
            }
        });

        console.log("done!")

        return res.status(201).json({
            result: result.data.result
        });

    } catch(err) {
        console.error("error: ", err);
        return res.status(404).json({
            message: "error"
        });
    }
}