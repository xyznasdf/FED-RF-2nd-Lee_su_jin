// CGV 인트로 페이지 JS - intro.js

// 요구사항 : 비디오 플레이가 끝나면 첫 페이지인 main.html로 자동 이동하기

// 대상 : #myvid
const myvid=document.querySelector('#myvideo');

// 이벤트 : timeupdate -> 동영상 재생중 발생 이벤트
myvid.addEventListener('timeupdate',()=>{
    // 1. 동영상 멈춤 여부 알아내기
    // -> 비디오요소.pause => 멈춤 상태면 true, 아니면 false

    let isStop=myvid.paused;

    // 호출 확인
    console.log('재생중!',isStop);

    // 2. 멈춤상태(true)이면 페이지 이동
    // -> JS에서 페이지 이동은 location.href = 주소 or 페이지
    if(isStop){
        location.href='main.html';
    } /// if ///


}); ////// timeupdate 이벤트 함수 //////
