document.addEventListener('DOMContentLoaded', function () {

    let addPossibleYn = true;  // 추가 가능 여부
    let todoCnt = 1;
    let selectedDate // 날짜 저장할 변수 선언
    let year;     // 연도 
    let month;    // 월
    let day;     // 일

    // 항목추가하기(콜백함수 이용)

    document.querySelector('.add').addEventListener('click', addElement)

    // 콜백함수(add 클릭할 때)
    init();
    function init() {
    // 오늘 날짜 기록하기

        let today = new Date();
        year = today.getFullYear();
        month = String(today.getMonth() + 1).padStart(2, '0');
        day = String(today.getDate()).padStart(2, '0');


        // 날짜를 클릭했을 때 달력이 뜨며 선택한 날짜로 이동하기

        // 달력만들기

        // input태그 만들기 및 속성추가
        let datePicker = document.createElement('input');
        datePicker.type = "text";
        datePicker.setAttribute('id', 'datepicker');
        datePicker.value = `${year}.${month}.${day}`

        document.querySelector('.date').appendChild(datePicker)



        // datepicker 클릭한 value값을 기준으로 화살표 클릭해서 날짜 변경하기


        // 1. datepicker에서 클릭한 value값 가져오기
        let currentDate =
            $('#datepicker').datepicker({
                language: 'ko',
                dateFormat: "yyyy.mm.dd",
                onSelect: function (dateText) {
                    selectedDate = dateText
                    // console.log('선택한 날짜:', selectedDate);
                    let partDate = selectedDate.split('.')
                    year = partDate[0]      // 연도 
                    month = partDate[1]     // 월
                    day = partDate[2]       // 일
                    // console.log(year)
                    // console.log(month)
                    // console.log(day)
                    getTodoList()
                }
            })
        getTodoList()
    }
    function getTodoList() {
        document.querySelector('.list_wrap').innerHTML = "";
        let stdYmd = document.querySelector('#datepicker').value.replace(/\./g, ''); // 날짜 포맷 변경
        fetch('http://localhost:3000/api/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },      
            
            body: JSON.stringify({
                stdYmd: stdYmd // 날짜
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); 
            if (data && data.length > 0) {
                data.forEach(item => {
                    addElement(null,item);
                });
            }
        });
    }
    // ToDo 수정하기
    function modifyTodo(e,p1,type) {
        const li = e.target.closest('li'); // input의 가장 가까운 li 부모 찾기
        let todoNo = li.getAttribute('todoNo');   // li의 todoNo 속성값 가져오기
        let stdYmd = document.querySelector('#datepicker').value.replace(/\./g, ''); // 날짜 포맷 변경
        // input 수정 시
        if(type == 'input') {
            let inputValue = e.target.value.trim();
            
            // ajax를 통해서 /api/insert 실행
            if (inputValue !== '' && inputValue !== null && inputValue !== undefined) {
                fetch('http://localhost:3000/api/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },      
                    
                    body: JSON.stringify({
                        stdYmd: stdYmd, // 날짜
                        finishYn: p1.classList.contains('cked') ? 1 : 0, // 체크 여부
                        todoText: inputValue,
                        createUser : 'jinKyoung' ,
                        todoNo: todoNo === undefined ? null : todoNo
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Insert successful:', data);
                    } else {
                        console.error('Insert failed:', data);
                    }
                });
            }
        }
        // 체크박스 수정 시 UPDATE 수행 
        else {
            let checkYn = e.target.classList.contains('cked') ==  true ? 1 : 0; // 체크 여부
            fetch('http://localhost:3000/api/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },      
                
                body: JSON.stringify({
                    stdYmd: stdYmd, // 날짜
                    finishYn: checkYn, // 체크 여부
                    createUser : 'jinKyoung' ,
                    todoNo: todoNo === undefined ? null : todoNo
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Update successful:', data);
                } else {
                    console.error('Update failed:', data);
                }
            });
        }

    }

    // 항목 추가하기
    function addElement(e,data) {

        // 추가 가능여부가 false 일 때 처음으로 돌아가기
        if (!addPossibleYn) {
            return;
        }

        let ul = document.querySelector('.list_wrap');
        let li = document.createElement('li');   // 태그 추가

        // p태그 - 1

        let p1 = document.createElement('p');
        p1.classList.add('ck');   // 클래스 추가
        p1.setAttribute('index', todoCnt);   // 클래스 추가

        // p태그 - 2

        let p2 = document.createElement('p');
        let input = document.createElement('input');
        input.type = 'text';   // 태그에 요소추가
        input.classList.add('list');
        input.classList.add('list' + todoCnt);
        // input.name = '리스트';

        let span = document.createElement('span');
        span.classList.add('alert')
        span.classList.add('alert' + todoCnt);

        p2.appendChild(input);
        p2.appendChild(span);

        // p태그 - 3

        let p3 = document.createElement('p');
        let img = document.createElement('img');
        img.src = './image/trash-solid.svg';
        img.alt = '쓰레기통';
        img.classList.add('remove');

        p3.appendChild(img);


        li.appendChild(p1);
        li.appendChild(p2);
        li.appendChild(p3);
        ul.appendChild(li);

        document.querySelector('main').appendChild(ul);

        applyCnt();  // task 개수 반영

        todoCnt++;   // index 숫자 증가


        // 버튼 클릭하면 자동포커스 맞추기

        input.focus();

        // 기존 데이터 불러오는 방식이라면 setting 해주기
        if(data !== undefined && data !== null) {
            input.value = data.TODO_TEXT; // 기존 데이터 설정
            p1.classList.toggle('cked', data.FINISH_YN === 1); // 체크 여부 설정
            input.disabled = data.FINISH_YN === 1; // 체크된 경우 input 비활성화
            input.classList.toggle('input_color', data.FINISH_YN === 1); // 체크된 경우 색상 변경
            li.setAttribute('todoNo', data.TODO_NO); // todoNo 속성 추가
        }
        else {
            li.setAttribute('todoNo', todoCnt); // todoNo 속성 추가
        }
        // input태그가 빈 칸이면 경고창 띄우기

        input.addEventListener('input', function (e) {
            let res = e.target.value.trim();

            if (res === '') {
                addPossibleYn = false  // 추가가능여부 -> false(add 못하게 return함)
                span.innerText = '* 글을 적어주세요'
                input.focus();
                p1.classList.remove('cked');  // input이 빈 칸일 때 체크되지 않게 하기
            } else {
                addPossibleYn = true
                span.innerText = ''
            }
        })
        // input 창에 글 작성이 끝나고 포커스가 벗어났을 경우 저장처리
        input.addEventListener('change', function (e) {
            modifyTodo(e,p1,'input');
        });
    }   

    // 항목 지우기

    document.querySelector('.list_wrap').addEventListener('click', function (e) {
        if (e.target.classList.contains('remove')) {
            let li = e.target.closest('li');
            if (li) {
                li.remove();
                todoCnt--;   // index 숫자 감소
                applyCnt(false);
                addPossibleYn = true;
            }

            // ajax를 통해서 /api/delete 실행
            let todoNo = li.getAttribute('todoNo');
            let stdYmd = document.querySelector('#datepicker').value.replace(/\./g, ''); // 날짜 포맷 변경
            fetch('http://localhost:3000/api/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    todoNo: todoNo,
                    stdYmd: stdYmd
                })  
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Delete successful:', data);
                } else {
                    console.error('Delete failed:', data);
                }
            })
            .catch(err => {
                console.error('Error deleting todo:', err);
            });
        }


        // 체크했을 때 체크박스 이벤트

        if (e.target.classList.contains('ck')) {

            let clickIndex = e.target.getAttribute('index')  // index 속성값 가져오기 => getAttribute()
            let indexInput = document.querySelector('.list' + clickIndex)  // list 지정
            let inputVal = indexInput.value; // input값 가져오기
            let indexSpan = document.querySelector('.alert' + clickIndex)  // 경고문구 지정

            if (inputVal === '') {
                indexSpan.innerText = '* 글을 적어주세요'
                return;
            }
            else {
                indexSpan.innerText = ''
            }

            /* 체크 처리 되고 , 카운터 하는 부분 */

            e.target.classList.toggle('cked') // 체크박스 회색 처리 

            // 체크 됐을 시에는 수정 못하도록 변경
            if (e.target.classList.contains('cked')) {
                indexInput.disabled = true;
                indexInput.classList.add('input_color')
                // element.disabled = true       =>   비활성화(input)
            }
            else {
                indexInput.disabled = false;
                // element.disabled = false       =>   활성화(input)
                indexInput.classList.remove('input_color')
            }

            applyCnt();

            modifyTodo(e,null,"check"); // 체크 상태 변경 시에도 저장 처리


        }



    })


    // task 개수 반영


    // applyCnt 함수 실행 시 아무것도 안넣으면 기본 true다.
    function applyCnt(finishEventYn = true) {
        let num = document.querySelectorAll('.list_wrap li').length;
        let checkLength = document.querySelectorAll('.cked').length;
        // console.log(num);
        let add = document.querySelector('.total');
        let add2 = document.querySelector('.num');

        add.textContent = num;
        add2.textContent = num - checkLength;

        // 전부 체크가 되었을 시
        let card = document.querySelector('.card');
        let remove = document.querySelector('.remove');


        if (num == checkLength) {
            // fade-out 클래스를 가지고 있다면 제거
            if (card.classList.contains('fade-out')) {
                card.classList.remove('fade-out');
            }

            // 애니메이션 효과 주기

            if (finishEventYn) {
                card.classList.add('card_ani');
                document.getElementById('finish_card').style.display = 'block';
                // 3초후 사라지게!!
                setTimeout(() => {
                    card.classList.add('fade-out');
                    document.getElementById('finish_card').style.display = 'none';
                }, 3000);
            }
        }
    }

    // 오른쪽 화살표를 클릭했을 때 다음 날짜로 저장하기

    // 1. 오른쪽 화살표를 클릭한다.
    document.querySelector('.right_arr').addEventListener('click', function () {

        let lastDate = new Date(year, month, 0).getDate()   // 이번 달의 마지막 일자

        // 2. 다음 날 날짜를 구한다.
        day++;

        // 3. 해당 달에 마지막 날일 때 그에 맞게 날짜 변경하기

        //  해당 달의 마지막 일자일 때 => 다음 달로 변경 , 일자는 1일로 지정
        //  해당 달의 마지막 일자 구하기

        // lastDate < day  => day값은 1,  month값은 +1
        if (lastDate < day) {
            // console.log('lastDate값'+lastDate)
            // console.log('day값'+day)
            day = 1;
            if (day = 1) {
                month++;
                if (month > 12) {
                    month = 1;
                    year++;
                }
            }
        }

        // 4. 날짜를 .date에 반영한다.
        month = String(month).padStart(2, '0')   // 다시 number -> string으로 변환
        day = String(day).padStart(2, '0')

        document.querySelector('#datepicker').value = `${year}.${month}.${day}`


        // 5. list의 값을 초기화한다.
        document.querySelector('.list_wrap').innerHTML = " ";
        getTodoList(); // 새로고침 시 해당 날짜의 todo 리스트를 가져오기

    })

    // 왼쪽 화살표를 클릭했을 때 이전 날짜로 저장하기

    // 1. 왼쪽 화살표를 클릭한다.
    document.querySelector('.left_arr').addEventListener('click', function () {

        // 2. 이전 날짜를 구한다.
        day--;

        // 3. 해당 달에 일자에 맞춰 반영하기
        // day < 1 => lastDate , month -1

        if (day < 1) {
            month--;
            let lastDate = new Date(year, month, 0).getDate()   // 이번 달의 마지막 일자    
            day = lastDate;
            // console.log('month.day값:'+month+day)
            // console.log('month.lastDate값:'+month+lastDate)
            if (day = lastDate) {
                if (month < 1) {
                    month = 12;
                    year--;
                }
            }
        }

        // 4. 날짜를 .date에 반영한다.
        month = String(month).padStart(2, '0')   // 다시 number -> string으로 변환
        day = String(day).padStart(2, '0')
        document.querySelector('#datepicker').value = `${year}.${month}.${day}`


        // 5. list의 값을 초기화한다.
        document.querySelector('.list_wrap').innerHTML = " ";
        getTodoList(); // 새로고침 시 해당 날짜의 todo 리스트를 가져오기
    })
});







