import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

let pool=null;

db_config = {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};


async function pingDB()
{
    try{
        let retries = 0;
        
        while(retries<10)
        {
            try{
                const conn = await mysql.createPool(db_config);
                
                await conn.ping();
                await conn.end();

                return 1;

            } catch(err) {
                retries++;
                await new Promise(resolve=>setTimeout(resolve, 3000));
            }
        }

        return 0;

    } catch(err) {
        console.log(err);
        return 0;
    }
}

export async function createPool()
{
    try{
        if(await pingDB()==0) null;

        if(pool==null)
            pool = await mysql.createPool(db_config);

        return pool;
    } catch(err)
    {
        console.log(err);
        return null;
    }
}