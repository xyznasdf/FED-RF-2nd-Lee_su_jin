// 쇼핑몰 배너 JS - 01.가로방향 배너 슬라이드 //

// DOM 선택함수
const qs = (x) => document.querySelector(x);
const qsa = (x) => document.querySelectorAll(x);

// addEvent 함수
// ele - 요소, evt - 이벤트, fn - 함수
const addEvt = (ele, evt, fn) => ele.addEventListener(evt, fn);

// HTML태그 로딩후 loadFn함수 호출! ///
addEvt(window, "DOMContentLoaded", loadFn);

/***************************************************** 
    [ 슬라이드 이동 기능 정의 ]
    1. 이벤트 종류: click
    2. 이벤트 대상: 이동 버튼(.abtn)
    3. 변경 대상: 슬라이드 박스(#slide)
    4. 기능 설계:

        (1) 오른쪽 버튼 클릭시 다음 슬라이드가
            나타나도록 슬라이드 박스의 left값을
            -100%로 변경시킨다.
            -> 슬라이드 이동 후!!! 
            바깥에 나가있는 첫번째 슬라이드
            li를 잘라서 맨 뒤로 보낸다!
            동시에 left값을 0으로 변경한다!

        (2) 왼쪽 버튼 클릭시 이전 슬라이드가
            나타나도록 하기 위해 우선 맨 뒤 li를
            맨 앞으로 이동하고 동시에 left값을
            -100%로 변경한다.
            그 후 left값을 0으로 애니메이션하여
            슬라이드가 왼쪽에서 들어온다.

        (3) 공통 기능: 슬라이드 위치 표시 블릿
            - 블릿 대상: .indic li
            - 변경 내용: 슬라이드 순번과 같은 순번의
            li에 클래스 "on"주기(나머진 빼기->초기화!)

*****************************************************/

// 전역변수구역 //////////
/* 
    (참고: JS에서 이름 짓는 일반 규칙)
    1. 변수/함수 : 캐믈케이스(첫 단어 소문자 뒷 단어 대문자 시작)
    2. 생성자함수/클래스 : 파스칼케이스(모든 첫 글자 대문자)
    3. 상수 : 모든 글자 대문자(연결은 언더스코어-스네이크 케이스)
*/

/****************************************** 
    함수명: loadFn
    기능: 로딩 후 버튼 이벤트 및 기능 구현
******************************************/
function loadFn() {
  console.log("로딩 완료!");

  // 1. 대상 선정
  // 이동 버튼 대상: .abtn
  const abtn = qsa(".abtn");

  // 변경 대상: #slide
  const slide = qs("#slide");

  // console.log(abtn,slide);

  // 슬라이드 순번 전역 변수
  let snum = 0;

  // 2. 버튼 모두 이벤트 설정하기
  for (let x of abtn) {
    x.onclick = goSlide;
  } /// for of ///

  ///////////////////////////////////////////
  // 광클 금지 변수 //////
  let prot=false;

  /****************************************** 
        함수명: goSlide
        기능: 슬라이드 이동
    ******************************************/
  function goSlide() {

    // 광클 금지 설정하기 //////
    // 클릭 신호를 막아서 못 들어오게 하고
    // 일정 시간 후 다시 열어준다!
    if(prot) return; // 돌아가!(함수 나감!)
    prot=true; // 잠금 (뒤에 호출 막기!)
    setTimeout(() => {
        prot=false; // 0.6초 후 해제
    }, 600);
    ///////////////////////////////////////////

    // 1. 오른쪽 버튼인 .ab2인가?
    let isRbtn = this.classList.contains("ab2");
        // -> 해당 요소의 특정 클래스인지 여부를 리턴함
        // 해당 클래스가 있으면 true, 없으면 false

    // 함수 호출 확인
    console.log("나 슬라이드야", this, isRbtn);
    // this는 호출한 버튼 자신

    // 2. 버튼별 구분하기
    // 2-1. 오른쪽 버튼일 경우
    if (isRbtn) {
      // (1) 먼저 왼쪽으로 이동하기
      slide.style.left = "-100%";
      slide.style.transition = ".6s ease-in-out";

      // (2) 이동하는 시간 0.6초간 기다림!
      setTimeout(() => {
        // (2-1) 맨 앞 li 맨 뒤로 이동
        slide.appendChild(slide.querySelectorAll("li")[0]);
        // 슬라이드 left값이 -100%이므로
        // (2-2) left값을 0으로 변경
        slide.style.left="0";
        // (2-3) left 트랜지션 없애기
        slide.style.transition = "none";
      }, 600);

      // 맨 앞 li 맨 뒤로 이동하기
      // appendChild(요소)
      // -> 원래 뒤에 요소 추가 기능임
      // -> 기존 있는 요소를 선택시 맨 뒤로 이동함
      // 맨 앞 요소를 선택하여 맨 뒤로 보냄
    } /// if ///

    // 2-2. 왼쪽 버튼일 경우
    else{
        // 하위 li 수집
        let list = slide.querySelectorAll('li');

        // (1) 맨 뒤 li 맨 앞으로 이동하기
        // 놈놈놈 시리즈!
        // insertBefore(넣을 놈,넣을 놈,전 놈)
        // insertBefore(맨 뒤 li,맨 앞 li)
        
        slide.insertBefore(list[list.length-1],list[0]);

        // (2) left값을 -100%로 변경하여
        // 맨 뒤 li가 맨 앞으로 온 것을 숨긴다
        // 왼쪽에서 슬라이드 들어오 준비!
        slide.style.left="-100%";
        // 트랜지션이 한 번 버튼 클릭 후 생기므로 없애줌
        slide.style.transition = "none";
        
        // 같은 left값을 변경하기 때문에 코드 처리 구역을 분리해야 함!
        // 이때 사용되는 메서드는 setTimeout()!
        // 시간차는 어쩌죠?
        // -> 0을 줘도 코드를 분리하여 처리하므로 동시처리가 아니고
        // 비동기 처리하기 때문에 코드가 잘 작동한다!
        setTimeout(() => {
            // (3) left값을 0으로 트랜지션하여 들어옴
            slide.style.left="0";
            slide.style.transition = ".6s ease-in-out";
        }, 0);

    } /// else ///


  } /////////// goSlide 함수 ///////////
} //////////////// loadFn 함수 ///////////////
/////////////////////////////////////////////
