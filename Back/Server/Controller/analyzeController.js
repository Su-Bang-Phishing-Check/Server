import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

const AI_server = axios.create({
    baseURL: "http://ai_server:4100/",
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

        return res.status(201).json(result.data);

    } catch(err) {
        console.error("error: ", err);
        return res.status(404).json({
            message: "error"
        });
    }
}

export async function analyse_image(req, res)
{
    try{
        let form = new FormData();

        const images = req.files;
        let num = 1;

        for(const image of images)
        {
            form.append('images', image.buffer, {
                filename: `${Date.now()}_${num++}${path.extname(image.originalname)}`,
                contentType: image.mimetype
            });
        }
        

        const ai_res = await AI_server.request({
            headers: form.getHeaders(),
            url: 'image',
            data: form,
            method: 'post'
        });

        console.log("upload success!");

        const ai_res_data = ai_res.data;

        return res.status(201).json(data);
        
    } catch(err) {
        console.log(err);
        return res.status(401).json({
            error: err
        });
    }
}