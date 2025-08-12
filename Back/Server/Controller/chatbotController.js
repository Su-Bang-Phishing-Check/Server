import questions from './data/list.json' with {type: 'json'};

export async function chatbot(req, res)
{
    try{
        const data = req.body;

        console.log(req.body);

        let new_data = {};
        new_data.temp = {};
        new_data.temp.next=[];
        new_data.temp.next_2=[];
        new_data.options = [];
        new_data.temp.category={};  //카테고리 저장

        if(data.state==false)  //처음 시작 --> O
        {
            new_data.state=1;
            new_data.question = questions[0].question;

            for(const option of questions[0].options)
                new_data.options.push(option.label);
                
            new_data.temp.cur_question = 0;

            return res.status(201).json(new_data);
        }

        let prev_question = data.temp.cur_question;
        let followup = data.temp.followup;
        let next = data.temp.next;
        let selected = data.select;
        let next_2 = data.temp.next_2;
        let selected_category = data.temp.category;
        selected.sort();
        next.sort();
        next_2.sort();
        selected_category =Object.keys(selected_category)   
                            .sort()                             
                            .reduce((obj, key) => {
                                obj[key] = selected_category[key];
                                return obj;
                                }, {});

        console.log(selected_category);

        new_data.state=true;
    
        if(prev_question==0)  //1번 문제에 대한 응답
        {
            //응답 처리 (추후 구현)
            
            new_data.question = questions[1].question; //2번 질문
            for(const option of questions[1].options) //2번 질문 옵션
                new_data.options.push(option.label);

            new_data.temp.cur_question=1;
            new_data.temp.followup = null;

            return res.status(201).json(new_data);
        }

        if(prev_question==1)   //2번 질문에 대한 응답
        {
            if(followup==null)   //상위 문제일 때  --> 하위 문제로 인계
            {
                for(const select of selected)
                {
                    if(questions[1].options[select].has_followup==1)
                        next.push(select);
                    else
                        next_2.push(questions[1].options[select].next_2)   //3번 질문을 위해 저장
                }

                console.log(next);
            }

            else  // 하위 문제일 때 --> 3번 질문을 위해 저장
            {
                for(const select of selected)
                    next_2.push(questions[1].options[followup].followup.options[select].next_2);  //3번 질문을 위해 저장
            }

            if(next.length!=0)  //남아있는 하위 질문이 있으면
            {
                const cur_followup = next.shift();
                console.log(questions[1].options[0]);

                new_data.question = questions[1].options[cur_followup].followup.question;
                for(const option of questions[1].options[cur_followup].followup.options)
                    new_data.options.push(option.label);

                new_data.temp.cur_question =1;
                new_data.temp.followup = cur_followup;
                new_data.temp.next = next;
                new_data.temp.next_2 = next_2;

                return res.status(201).json(new_data);
            }

            prev_question++;
            followup=null;
        }

        if(prev_question==2)
        {
            if(followup != null)  //첫 질문이 아닐 때
            {
                for(const select of selected)  //선택한 옵션에 대해서
                {
                    for(const type of questions[2].options[followup].options[select].category)
                        selected_category[type] = true;
                }
            }

            if(next_2.length!=0) // 하위 질문이 있을 때
            {
                const cur_followup = next_2.shift();

                new_data.question = questions[2].options[cur_followup].question;
                for(const option of questions[2].options[cur_followup].options)
                    new_data.options.push(option.label);

                new_data.temp.cur_question = 2;
                new_data.temp.followup = cur_followup;
                new_data.temp.next_2 = next_2;
                new_data.temp.category = selected_category;

                return res.status(201).json(new_data);
            }

            new_data.question = questions[3].question;
            for(const option of questions[3].options)
                new_data.options.push(option.label);
            
            new_data.temp.cur_question=3;
            new_data.temp.category = selected_category;
            new_data.temp.followup=null;

            return res.status(201).json(new_data);
        }

        if(prev_question==3)
        {
            if(followup==null) //상위 문제에 대한 응답이면
            {
                for(const select of selected)
                {
                    if(questions[3].options[select].has_followup==true)
                        next.push(select);
                    else
                        for(const type of questions[3].options[select].category)
                            selected_category[type] = true;
                }
            }
            else  //followup 문제의 응답이면 점수 처리
            {
                for(const select of selected)  //선택한 옵션에 대해서
                {
                    for(const type of questions[3].options[followup].options[select].category)
                        selected_category[type] = true;
                }
            }

            if(next.length!=0)
            {
                const cur_followup = next.shift();

                new_data.question = questions[3].options[cur_followup].question;
                for(const option of questions[3].options[cur_followup].options)
                    new_data.options.push(option.label);

                new_data.temp.cur_question = 3;
                new_data.temp.followup = cur_followup;
                new_data.temp.next = next;
                new_data.temp.category = selected_category;

                return res.status(201).json(new_data);
            }

            prev_question++;
        }

        return res.status(201).json({
            state: false,
            message: "finished",
            types: data.temp.category
        });

    } catch(err){
        console.log(err);
        return res.status(404).json({
            error: err
        });
    }
}
