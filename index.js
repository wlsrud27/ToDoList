document.addEventListener('DOMContentLoaded', function () {

    let addPossibleYn = true;  // 추가 가능 여부
    let todoCnt = 1;

    // 항목추가하기(콜백함수 이용)

    document.querySelector('.add').addEventListener('click', addElement)

    // 콜백함수(add 클릭할 때)

    function addElement(e) {

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
        img.src = '/ToDoList/image/trash-solid.svg';
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





    // 오늘 날짜 기록하기

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = today.getDate();


    // 오른쪽 화살표를 클릭했을 때 다음 날짜로 저장하기

    // 1. 오른쪽 화살표를 클릭한다.
    document.querySelector('.right_arr').addEventListener('click', function () {

        let lastDate = new Date(year, month, 0).getDate()   // 이번 달의 마지막 일자

        // 2. 다음 날 날짜를 구한다.
        day++;

        // 3. 날짜를 .date에 반영한다.

        document.querySelector('#datepicker').value = `${year}.${month}.${day}`

        // 4. list의 값을 초기화한다.
        document.querySelector('.list_wrap').innerHTML = " ";

        // 5. 해당 달에 마지막 날일 때 그에 맞게 날짜 변경하기

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

            document.querySelector('#datepicker').value = `${year}.${month}.${day}`



        }
    })

    // 왼쪽 화살표를 클릭했을 때 이전 날짜로 저장하기

    // 1. 왼쪽 화살표를 클릭한다.
    document.querySelector('.left_arr').addEventListener('click', function () {

        // 2. 이전 날짜를 구한다.
        day--;

        // 3. 날짜를 .date에 반영한다.
        document.querySelector('#datepicker').value = `${year}.${month}.${day}`

        // 4. list의 값을 초기화한다.
        document.querySelector('.list_wrap').innerHTML = " ";

        // 5. 해당 달에 일자에 맞춰 반영하기
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
            document.querySelector('#datepicker').value = `${year}.${month}.${day}`
        }
    })


    // 날짜를 클릭했을 때 달력이 뜨며 선택한 날짜로 이동하기

    // 달력만들기

    // input태그 만들기 및 속성추가
    let datePicker = document.createElement('input');
    datePicker.type = "text";
    datePicker.setAttribute('id', 'datepicker');
    datePicker.value = `${year}.${month}.${day}`

    document.querySelector('.date').appendChild(datePicker)

    $('#datepicker').datepicker({
        language: 'ko',
        dateFormat: "yyyy.mm.dd"
    })


    // datepicker 클릭한 value값을 기준으로 화살표 클릭해서 날짜 변경하기

    document.querySelector('#datepicker').addEventListener('dblclick', function (e) {
        let dateVal = e.target.value;
        console.log('선택한 날짜:' + dateVal);
    })

});







