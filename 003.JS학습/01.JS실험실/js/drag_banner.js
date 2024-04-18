// JS실험실 : 07.드래그배너 JS - drag_banner.js

// [1] 모듈 함수 불러오기 //////////////////////
// 슬라이드 기능 함수 불러오기
import setSlide from "./slide_fn.js";

// 드래그 기능 함수 불러오기
import setDrag from "./slide_drag.js";


// [2] 기능 구현 파트 //////////////////////
// 슬라이드 기능 함수 호출하기
setSlide('banbx');

// 2. 드래그 기능 함수 호출하기
setDrag('slide');
