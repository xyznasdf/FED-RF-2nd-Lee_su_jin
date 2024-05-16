// 메인 페이지에서 서브 컨텐츠 띄우는 구현코드 ////

// 데이터 셋팅 불러오기 //////
import * as dkbData from "../data/dkb_data.js";

export default function showSubBox() {
  // console.log("나를 부르면 서브가 보여~!");

  // 1. 서브 컨텐츠 보이기 기능 구현 ///
  // (1) 대상 선정
  // (1-1)이벤트 대상 :
  // 미리보기 : .preview-box li
  // 현장포토 : .live-box li
  // 대표포스터 : .poster-box li
  // 최신동영상 : .clip-box li
  const subViewBox = $(`
        .preview-box li,
        .live-box li,
        .poster-box li,
        .clip-box li
    `);

  // (1-2) 변경대상 : .sub-cont
  const subContBox = $(".sub-cont");

  // console.log(subViewBox);

  // 2. 이벤트 설정 및 함수구현하기 ////
  subViewBox.click(function () {
    // let confPrt = $(this).parent().parent().is(".preview-box");
    // parent() 바로 위 상위 요소로 이동
    // 두번 위로 이동해서 li위 ul위 div
    // 그 div박스의 클래스가 preview-box인가?
    // is(클래스명) 메서드로 알아봄

    let db = $(this).parent().attr("data-db");

    // JS문법에서는 아래와 같음!
    // this.parentElement.parentElement
    // .classList.contains(클래스명)

    console.log("나야나!", this, db, dkbData[db]);

    // if (confPrt) {
    // 1. 키 속성값 읽어오기
    let idx = $(this).attr("data-idx");
    // attr(속성명) -> 속성값 읽어오기 메서드
    // attr(속성명,속성값) -> 속성값 넣기 메서드

    console.log("idx:", idx);

    // [ 배열순회 메서드 비교 : forEach / find ]
    // forEach() 는 모두 순회한다!
    // find() 는 조건에 맞을 때 return true하면
    // 해당 배열값이 변수에 할당된다!
    // 만약 일치하는 데이터가 없으면 undefined됨!

    // dkbData.previewData.forEach(v=>{

    // dkbData[db] -> 해당 데이터 매칭하기
    let selData = dkbData[db].find((v) => {
      if (v.idx == idx) {
        // console.log("찾았다!",v);
        return true;
      } /// if ///

      console.log("돌아!");
    }); /// selData ///

    console.log("검색 결과:", selData);

    // 서브박스에 내용 넣기
    // 제이쿼리는 innerHTML 할당대신 html() 메서드를 사용한다!
    subContBox
      .html(
        `
                <button class="cbtn">×</button>
                <div class="sub-inbox inbox">
                    <h1>${selData.title}</h1>
                    <div class="sub-item">
                        ${selData.story}
                    </div>
                </div>
            `
      )
      .show();
    // show() 는 display를 보여주는 메서드
    // hide() 는 display를 숨기는 메서드
    // toggle() 는 display를 토글하는 메서드

    // 닫기 버튼 이벤트 설정하기
    $(".cbtn").click(() => subContBox.hide());
    // } /// if ///
  });
} /////////// showSubBox 함수 ///////////////
