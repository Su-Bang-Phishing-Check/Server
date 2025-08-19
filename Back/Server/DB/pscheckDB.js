import mysql from 'mysql2/promise'
import axios from 'axios'
import * as cheerio from 'cheerio'
import dotenv from 'dotenv'

dotenv.config();

let pool=null;

const db_config = {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const FSS_info =  axios.create({
    baseURL: 'https://fss.or.kr/',
    timeout: 5000
});

const params = {
    menuNo: 200204,
    bbsId:null,
    viewType:null,
    cl1Cd:null,
    pageIndex: null,
    sdate: null,
    edate: null,
    searchCnd: null,
    searchWSrd: null
};




async function pingDB()
{
    try{
        let retries = 0;
        if(pool!=null) return;
        
        while(retries<10)
        {
            try{
                const conn = await mysql.createConnection(db_config);
                
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
        if(pool!=null) return pool;
        
        if(await pingDB()==0){
            console.log("pool creation failed");
            return null;
        }

        if(pool==null)
            pool = await mysql.createPool(db_config);

        if(pool!=null)
            console.log("pool creation succeeded");

        return pool;
    } catch(err)
    {
        console.log(err);
        return null;
    }
}

export async function sync_db()
{
    try{
        const db = await createPool();
        if(db==null){
            console.log("no pool");
            return;
        }

        
        let input = params;
        input.pageIndex=1;
        const ret = await FSS_info.request({
            url: 'fss/bbs/B0000175/list.do',
            method: 'get',
            params: input
        });

        //console.log(ret.data)

        const $res = cheerio.load(ret.data);
        let max_page = $res('.count-total').text();
        max_page = max_page.match(/\/\s*(\d+)\s*페이지/);
        max_page = parseInt(max_page[1]);
        let arr = [];
        console.log(max_page);

        for(let i =1; i<=max_page; i++)
        {
            input.pageIndex=i;
            const ret2 = await FSS_info.request({
                url: 'fss/bbs/B0000175/list.do',
                method: 'get',
                params: input
            });
            const $data = cheerio.load(ret2.data);
            //console.log(ret2.data);

            const rows = $data('div.bd-list table tbody tr').toArray();

            for(const row of rows){
                const number = $data(row).find('td.num').text().trim();
                const titleTag = $data(row).find('td.title a');
                const title = titleTag.text().trim();
                const link = 'https://fss.or.kr' + titleTag.attr('href');
                const date = $data(row).find('td').eq(3).text().trim();

                arr.push({number, title, link, date});
            }
        
        }

        for(const obj of arr)
        {
            await db.execute(`
                insert into notices
                VALUES(?,?,?,str_to_date(?,'%Y-%m-%d'))
                on duplicate key update title=?, created_at=str_to_date(?, '%Y-%m-%d'), link=?`,
                [obj.number, obj.title, obj.link, obj.date, obj.title, obj.date, obj.link]);
        }

        console.log('sync complete!');

        return;

    } catch(err) {
        console.log(err);
        return;
    }
}