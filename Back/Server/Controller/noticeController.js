import { createPool } from "../DB/noticeDB.js";

const db = await createPool();

export async function mainNotice(req,res){   //메인 화면 공지
    try{


        if(db==null){    //db 풀이 없을 때
            console.log('db is null');
            return res.status(401).json({
                message: "db pool is missing"
            });
        }
        
        //공지 5개 조회
        const [ret] = await db.query(`   
            select id, title, link, DATE_FORMAT(created_at, '%Y년 %m월 %d일')
            from notices
            order by created_at DESC
            LIMIT 5`);

        if(ret.length==0)   //공지가 없으면
        {
            console.log('no notices detected');
            return res.status(401).json({
                message: "No notices"
            });
        }

        return res.status(201).json({
            dataCount: ret.legnth,
            data: ret
        });  //공지가 있으면

    } catch(err){
        console.log(err);
        return res.status(404).json(err);
    }
}


export async function pageNotice(req, res){
    try{
        if(db==null){    //db 풀이 없을 때
            console.log('db is null');
            return res.status(401).json({
                message: "db pool is missing"
            });
        }
        
        let pageNo = req.query.pageNo;
        console.log(pageNo);

        if(!pageNo) pageNo=1;

        pageNo = parseInt(pageNo);  //페이지 번호 추출

        const offset = 10*(pageNo-1);

        const [ret_count] = await db.query(`
            select count(*) as count
            FROM notices`);   //공지 개수 확인 (전체 페이지 띄우기 위한 용도)

        if(ret_count.length==0 || ret_count[0].count==0)  //공지 개수가 0일 때
        {
            console.log('no notices');
            return res.status(401).json({
                message: "no notices"
            });
        }
        //console.log(ret_count);

        let max_page = Math.ceil((parseInt(ret_count[0].count)/10));  //최대 페이지 구하기
        console.log(max_page);

        const [ret] = await db.query(`
            select id, title, link, DATE_FORMAT(created_at, '%Y년 %m월 %d일')
            from notices
            ORDER BY created_at DESC
            LIMIT 10
            OFFSET ?
            `, [offset]);   //현재 페이지에 해당하는 공지사항 구하기

        if(ret.length==0){
            console.log('no page num');
            return res.status(401).json({
                message: "pagenum over MAX page"
            });
        }   //조회된 공지가 없을 때

        return res.status(201).json({
            pageNo: pageNo,
            totalPage: max_page,
            dataCount: ret.length,
            data: ret
        });  //공지 반환하기


    } catch(err) {
        console.log(err);
        return res.status(404).json(err);
    }
}