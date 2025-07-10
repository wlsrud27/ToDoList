document.addEventListener('DOMContentLoaded', function () {


    // 오늘 날짜 기록하기

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    document.querySelector('.date').innerText = `${year}.${month}.${day}`;


    // 항목추가하기(콜백함수 이용)

    document.querySelector('.add').addEventListener('click', addElement)

    // 콜백함수(add 클릭할 때)

    function addElement(e) {
        let ul = document.querySelector('.list_wrap');
        let li = document.createElement('li');   // 태그 추가

        // p태그 - 1

        let p1 = document.createElement('p');
        p1.classList.add('ck');   // 클래스 추가

        // p태그 - 2

        let p2 = document.createElement('p');
        let input = document.createElement('input');
        input.type = 'text';   // 태그에 요소추가
        input.classList.add('list');
        input.name = '리스트';
        let span = document.createElement('span');
        span.classList.add('alert')

        p2.appendChild(input);
        p2.appendChild(span);

        // p태그 - 3

        let p3 = document.createElement('p');
        let img = document.createElement('img');
        img.src = '/image/trash-solid.svg';
        img.alt = '쓰레기통';
        img.classList.add('remove');

        p3.appendChild(img);


        li.appendChild(p1);
        li.appendChild(p2);
        li.appendChild(p3);
        ul.appendChild(li);

        document.querySelector('main').appendChild(ul);

        cnt();


        // 버튼 클릭하면 자동포커스 맞추기

        input.focus();


        // input태그가 빈 칸이면 경고창 띄우기

        input.addEventListener('blur', function (e) {
            let res = e.target.value.trim();
            // console.log(res)

            // 빈 칸이면 li를 제거하기

            // if (res === '') {
            //     let li2 = e.target.closest('li');
            //     console.log(li2);
            //     if (li2) {
            //         li2.remove();
            //         cnt();
            //     }
            // }

            if (res === '') {
                span.innerText = '* 글을 적어주세요'

                document.querySelector('.add').removeEventListener('click', addElement);
                input.focus();
            } else {
                span.innerText = ''
                document.querySelector('.add').addEventListener('click', addElement)
            }
        })
    }

    // 항목 지우기

    document.querySelector('.list_wrap').addEventListener('click', function (e) {
        if (e.target.classList.contains('remove')) {
            let li = e.target.closest('li');
            if (li) {
                li.remove();
                cnt();
            }

            
        }


        // 체크했을 때 체크박스 이벤트

        if (e.target.classList.contains('ck')) {
            e.target.classList.toggle('cked')

            let chk = document.querySelectorAll('.cked').length;
            // console.log('체크 된 항목 개수 : ' + chk)

            let num = document.querySelectorAll('.list_wrap li').length;
            // console.log("총 항목의 개수 : " + num)

            // console.log("체크 안 된 항목 개수 : " + (num - chk))

            if (chk > 0) {
                document.querySelector('.num').innerText = (num - chk);
            } else {
                cnt();
            }

        }

        // 체크했을 때 글자 색상 변경

        let cked = e.target.classList.contains('cked')
        let li = e.target.closest('li')

        if (li) {
            let input = li.querySelector('.list');
            if (input) {
                if (cked) {
                    input.classList.add('input_color')
                } else {
                    input.classList.remove('input_color')
                }
            }
        }

    })


    // task 개수 반영

    function cnt() {
        let num = document.querySelectorAll('.list_wrap li').length;
        // console.log(num);
        let add = document.querySelector('.total');
        let add2 = document.querySelector('.num');

        add.textContent = num;
        add2.textContent = num;
    }


})



