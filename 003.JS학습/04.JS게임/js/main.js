// Racing PJ 메인 JS - main.js

// DOM 메서드 모듈
import myFn from './dom.js';

// 메시지 json 파일 불러오기
// -> 어서써 타입 제이슨!!!
// -> 내가 지은 변수명으로 import 후 맨 끝에 assert {type:'json'} 씀
// import msgTxt from './data_racing.json' assert {type:'json'};

// 'assert' is deprecated in import statements and support will be removed in V8 v12.6 and Chrome 126; use 'with' instead
// -> assert 키워드 지원 중단됨(사용은 가능) 대신 with 키워드 권장!
// -> 같이써 타입 제이슨!!!
import msgTxt from './data_racing.json' with {type:'json'};

// 불러온 것 확인
// console.log(myFn,msgTxt);


/********************************************** 
            [ 게임 기능 정의 ]
    _________________________________

    1. 게임룰: 거북 버튼 클릭하여 거북을
        왼쪽에서 오른쪽으로 이동함
        이때 토끼는 자동으로 이동하여
        결승선에 먼저 도달하는 레이서가 승리함
    2. 토끼의 이동속도는 레벨로 설정함
    3. 결승선 도착은 둘 중 하나가 먼저
        도착할 경우 판별함수에서 결과를
        화면에 출력한다.
    4. 포커스가 버튼에 갈 경우 마우스가
        아닌 키보드 버튼으로 조작할 수 없게 함
        (마우스만 사용하도록 함!)
    5. 기본적으로 거북이동 버튼 클릭시
        토끼는 자동으롤 작동됨!
    6. 토끼이동 버튼은 토끼만 미리 작동 가능
    7. 처음으로 버튼은 전체를 리셋함
    
**********************************************/

// 1. 대상선정 ///////////////////
// (1) 거북 : #t1
const t1=myFn.qs('#t1');

// (2) 토끼 : #r1
const r1=myFn.qs('#r1');

// (3) 버튼 : #btns a
const btns=myFn.qsa('#btns a');

// (4) 레벨 : #level
const level=myFn.qs('#level');

// (5) 메시지박스 : #msg
const msg=myFn.qs('#msg');

// (6) 토끼, 거북 위치값 변수
// 토끼위치 : r1pos / 거북위치 : t1pos
let r1pos=0, t1pos=0;

// console.log('대상:',t1,r1,btns,level,msg);

// (7) 거북 이동값 상수
const T1_NUM=16;

// (8) 결승선 위치 상수
const FINAL_NUM=650;

// (9) 거북 작동멈춤 상태 변수
let t1Stop=false;

// 2. 이벤트 설정하기 ////////////
btns.forEach(ele=>{
    myFn.addEvt(ele,'click',goGame);
}); /// forEach ///

/*********************************** 
    함수명: goGame
    기능: 버튼별 기능분기
***********************************/

function goGame(){
    // 1. 버튼 글자 읽기
    let btxt=this.innerText;
    console.log('고고씽~!',btxt);

    // 2. 버튼별 기능 분기하기
    if(btxt==='토끼출발'){
        goR1(); // 인터발 호출 함수
    } /// if ///
    else if(btxt==='거북출발'){
        // (1) 거북 멈춤상태값이 true이면 함수 나가! 
        if(t1Stop) return;

        // (2) 거북의 설정된 값만큼 이동하기
        t1pos+=T1_NUM;
        t1.style.left = ++t1pos + 'px';

        // (3) 거북 버튼 클릭 후 포커스로 인해 엔터 버튼을 사용할 수 있으므로
        // 이를 막기 위해 포커스 해제
        // 즉, blur() 메서드로 처리하기
        this.blur();
        // 초점이 들어가게 하는 메서드 => focus();
        // 초점을 빠지게 하는 메서드 => blur();

        // 토끼 자동 출발
        goR1(); 
    } /// else if ///
    else if(btxt==='처음으로'){ // 페이지 리로드하기
        location.reload();
    } /// else if ///

} /////////// goGame 함수 ////////////

/*********************************** 
    함수명: goR1
    기능: 토끼 자동이동 (인터발 함수)
 ***********************************/

// 인터발 지우기용 변수
let autoI;
function goR1(){
    // 호출이 한번만 되도록
    // autoI 할당 전엔 undefined이므로 if문에서 false처리됨! 이것을 이용하자!
    if(!autoI){ // false일 때만 들어가게 함
        console.log('토끼 인터발!',level.value);
        autoI=setInterval(() => {
            // 토끼 위치 이동 (1px씩)
            r1.style.left = ++r1pos + 'px';
            // 승자 판별함수 호출 (인터발내 계속 호출)
            whoWinner();
        }, level.value);
        // level.value는 선택박스의 선택된 값이다
        // 원래 option요소의 value값은 문자형이므로
        // 숫자여도 숫자형으로 형 변환해야하지만
        // 요즘 브라우저는 자동형 변환해준다!

    } /// if ///
} ///////// goR1함수 //////////////////

/***************************************** 
    함수명: whoWinner
    기능: 기준값 보다 레이서 위치값이 큰 경우
        승자를 판별하여 메시지를 보여준다!
*****************************************/

function whoWinner(){
    // console.log('토끼 위치:',r1pos,'거북 위치:',t1pos);

    // 1. 토끼/거북 위치값이 기준값 이상일 때
    // 토끼 인터발 함수 멈추기 + 거북 클릭 작동 막기
    if(r1pos>=FINAL_NUM || t1pos>=FINAL_NUM){
        // (1) 토끼야 멈춰라!
        clearInterval(autoI);
        // (2) 거북아 멈춰라! (거북 멈춤상태값 true)
        t1Stop=true;

        // 승자 변수 (메시지 때문에 씀: 토끼/거북/비김)
        let winner;

        // (3) 승자 판별하기
        if(r1pos>t1pos) winner = '토끼';
        else if(r1pos<t1pos) winner = '거북';
        else winner = '비김';

        // (4) 랜덤수 만들기
        // Math.floor(Math.random()*배열개수)
        // 배열 개수는 .length
        // 0부터 배열 끝번호 사이 수가 랜덤으로 생성됨
        let rdmNum=Math.floor(Math.random()*msgTxt[winner].length);
        console.log('랜덤수:',rdmNum);

        // (5) 메시지 할당하기 (랜덤수로 불러오기)
        msg.innerText=msgTxt[winner][rdmNum];
        // 메시지 박스 보이기
        msg.style.display='block';
        // 커버보다 위로
        msg.style.zIndex='100';

        // (6) 전체 반투명 커버 암전주기
        myFn.qs('.cover').style.cssText=`
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            background-color:#000;
            opacity:0.5;
            z-index:99;
        `;

        // (7) 버튼 박스 위로 올리기
        myFn.qs('#btns').style.zIndex='200';

    } /// if ///

} ///////// whoWinner 함수 ////////////////

/****************************************************** 
    [ 내가 원하는 랜덤수 만들기]
    1. Math.random()
        -> 0~1 사이 소수점 16자리 랜덤수 생성
    2. 내가 원하는 1~몇까지의 랜덤수 만들기
        (1) Math.random() * 원하는 최대수
        -> 0~원하는 수보다 1 작은 수까지 랜덤수 발생
        (2) 올림 처리하여 1~원하는 수를 만들어준다!
        -> Math.ceil(Math.random() * 원하는 최대수)
        -> 만약 0부터 1 작은 최대수를 만들고 싶으면
        내림 처리하면 된다! Math.floor()
        (3) 중간 범위의 랜덤수를 만들고자 할 때에는
        1부터 최대수를 구하고, 특정 시작수를 구해주면 된다
        예) 4~12는 Math.ceil(Math.random()*8)+3
******************************************************/
// console.log('Math.random:',Math.random());
// console.log('Math.random*8:',Math.random()*8);
// console.log('Math.ceil(Math.random*8):',Math.ceil(Math.random()*8));
// console.log('4~12 사이 랜덤수:',Math.ceil(Math.random()*8)+3);
