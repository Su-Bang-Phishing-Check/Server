import questions from './list.json' with {type: 'json'};



export async function chatbot(req, res)
{
    try{
        const data = req.body;

        let new_data = {};
        new_data.temp = {};
        new_data.temp.next=[];
        new_data.options = [];

        if(data.state==false)  //처음 시작
        {
            new_data.state=1;
            new_data.question = questions[0].question;

            for(const option of questions[0].options)
                new_data.options.push(option.label);
                
            new_data.temp.cur_question = 0;
            new_data.temp.has_followup = 0;
            new_data.temp.is_on_followup = 0;

            return res.status(201).json(new_data);
        }

        const prev_question = data.temp.cur_question;  //이전 문제 번호 가져오기
        const selected = data.select;   //선택한 옵션 가져오기
        let has_followup = data.temp.has_followup; //하위 질문이 있는지
        let is_on_followup = data.temp.is_on_followup;  //현재 하위 질문에 있는지
        let temp = data.temp.next;  //다음 질문 목록

        //응답 처리 (구현중)

        if(is_on_followup==0)   //상위 질문에서 하위 질문으로 넘어 갈 때 다음 문제 배열 초기화하기
        {
            for(const sel_option of selected){
                if(questions[prev_question].options[sel_option].has_followup==true)
                    temp.push(sel_option)
            }
            is_on_followup=1;
        }

        if(is_on_followup && data.temp.length!=0)  //현재 하위 질문에 있고, 다음 하위 질문이 있을 때
        {
            const next_followup = temp.shift();
            console.log(next_followup);
            new_data.question = questions[prev_question].options[next_followup].label;
            for(const option of questions[prev_question.options[next_followup].options])
                new_data.options.push(option.label);
            new_data.temp.is_on_followup=1;
            new_data.temp.has_followup=0;
            new_data.temp.next = data.temp;
            new_data.temp.cur_question = prev_question;
        
            return res.status(201).json(new_data);
        }

        //다음 상위 질문

        const next_question = prev_question+1;
        if(next_question>3) //질문이 끝났으면
        {
            new_data.state=0;
            new_data.message="설문 끝!";
            res.status(201).json(new_data);
        }

        new_data.state=1;
        new_data.question=questions[next_question].question;  //질문 넣기
        for(const option of questions[next_question].options)  //옵션 넣기
            new_data.options.push(option.label);
        //new_data.temp = {};
        new_data.temp.cur_question=next_question;  //현재 질문 번호 저장
        //new_data.temp.next=[];
        new_data.temp.has_followup= questions[next_question].options.has_followup;  //하위 질문 존재 여부 표기
        new_data.temp.is_on_followup=false; //현재 하위 질문에 있는지

        return res.status(201).json({new_data});

    } catch(err){
        console.log(err);
        return res.status(404).json({
            error: err
        });
    }
}


console.log(questions[0].question);
for(const option of questions[0].options)
    console.log(option.label);