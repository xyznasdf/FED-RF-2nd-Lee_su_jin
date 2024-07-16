// 오피니언 페이지 컴포넌트 ///
import { Fragment, useContext, useEffect, useRef, useState } from "react";

// 컨텍스트 API를 사용하기 위한 생성자
import { dCon } from "../modules/dCon";

// 사용자 기본 정보 생성 함수
import { initData } from "../func/mem_fn";

// 로컬스토리지 게시판 기본 데이터 JSON
// import baseData from "../data/board.json"; -> 로컬스로 대체!!!
// 리액트 웹팩에서 제이슨은 이름을 지어서 불러오면 된다!
// 제이슨 파일 처리는 다르므로 확장자를 반드시 써야 함!

// 제이쿼리
import $ from "jquery";

// CSS 불러오기
import "../../css/board.scss";
import "../../css/board_file.scss";

// 로컬 스토리지 확인 JS
import { initBoardData } from "../func/board_fn";

export default function Board() {
  // 컨텍스트 사용하기
  const myCon = useContext(dCon);

  // 전역 로그인 상태 변수 확인하기
  const sts = myCon.loginSts;
  // console.log(myCon.loginSts);

  // 로컬 스토리지 게시판 데이터 정보 확인
  initBoardData();

  // 로컬스 데이터 변수 할당하기
  const baseData = JSON.parse(localStorage.getItem("board-data"));

  // 원본 데이터에 정렬 적용하기 : 내림차순
  baseData.sort((a, b) =>
    Number(a.idx) > Number(b.idx) ? -1 : Number(a.idx) < Number(b.idx) ? 1 : 0
  );

  ////// [ 상태 관리 변수 ] //////
  // [1] 페이지 번호
  const [pageNum, setPageNum] = useState(1);

  // [2] 기능 모드
  const [mode, setMode] = useState("L");
  // (1) 리스트 모드(L) : List Mode
  // (2) 글보기 모드(R) : Read Mode
  // (3) 글쓰기 모드(W) : Write Mode
  // (4) 수정 모드(M) : Modify Mode (삭제 포함)

  ////// [ 참조 변수 ] //////
  // [1] 전체 개수 - 매번 계산하지 않도록 참조변수로!
  const totalCount = useRef(baseData.length);

  // console.log("전체 개수:", totalCount);

  // [2] 선택 데이터 저장
  const selRecord = useRef(null);
  // -> 특정 리스트 글 제목 클릭시 데이터 저장함

  // 페이지당 개수
  const unitSize = 8;

  /********************************************* 
    함수명: bindList
    기능: 페이지별 리스트를 생성하여 바인딩함
  *********************************************/
  const bindList = () => {
    // // console.log(baseData);

    // 1. 전체 원본 데이터 선택
    const orgData = baseData;

    // 2. 정렬 적용하기 : 내림차순
    orgData.sort((a, b) =>
      Number(a.idx) > Number(b.idx) ? -1 : Number(a.idx) < Number(b.idx) ? 1 : 0
    );

    // 3. 일부 데이터만 선택
    // 예시로 0번부터 9번까지만 선택
    // 한 페이지당 10개라면...
    // 페이지 번호와 연관시켜 본다!
    // 1, 2, 3, 4, ...
    // 시작번호 = (페이지 번호-1)*단위수
    let sNum = (pageNum - 1) * unitSize;

    // 끝번호 = 페이지 번호*단위수
    let eNum = pageNum * unitSize;

    // console.log("첫번호:", sNum, "/끝번호:", eNum);

    // 결과 배열
    const selData = [];
    for (let i = sNum; i < eNum; i++) {
      // 끝번호가 전체 개수보다 크면 나가라!
      if (i >= totalCount.current) break;
      // 대상 배열값 추가
      selData.push(orgData[i]);
    } /// for ///

    // console.log("일부 데이터:", selData);

    return selData.map((v, i) => (
      <tr key={i}>
        {/* 시작번호를 더하여 페이지별 순번을 변경 */}
        <td>{i + 1 + sNum}</td>
        <td>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // 읽기 모드로 변경!
              setMode("R");
              // 해당 데이터 저장하기
              selRecord.current = v;
            }}
          >
            {v.tit}
          </a>
        </td>
        <td>{v.uid}</td>
        <td>{v.date}</td>
        <td>{v.cnt}</td>
      </tr>
    ));
  }; ////////// bindList //////////

  /********************************************* 
      함수명: pagingList
      기능: 게시판 리스트의 페이징 기능 목록
  *********************************************/
  const pagingList = () => {
    // 전체 페이징 개수: 전체 레코드 수/페이지당 개수
    // 유의점: 나머지가 있는지 검사해서 있으면 +1

    // 1. 페이징 개수
    let pagingCount = Math.floor(totalCount.current / unitSize);

    // 나머지가 있으면 다음 페이지가 필요함!
    // 나머지가 0이 아니라면 1 더하기
    if (totalCount.current % unitSize > 0) {
      pagingCount++;
    }

    // console.log(
    //   "페이징 개수:",
    //   pagingCount,
    //   "나머지 개수:",
    //   totalCount.current % unitSize
    // );

    // 링크 코드 만들기
    const pgCode = [];

    // 1부터 페이지 끝번호까지 돌면서 코드 만들기
    for (let i = 1; i <= pagingCount; i++) {
      pgCode.push(
        <Fragment key={i}>
          {
            // 페이징 번호와 현재 페이지 번호 일치시 b요소
            i === pageNum ? (
              <b>{i}</b>
            ) : (
              // 불일치시 모드 링크 코드
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPageNum(i);
                }}
              >
                {i}
              </a>
            )
          }
          {/* 사이에 바 넣기 */}
          {i !== pagingCount && " | "}
        </Fragment>
      );
    } /// for ///

    /// 코드 리턴 ///
    return pgCode;
  }; ////////// pagingList //////////

  // 버튼 클릭시 변경 함수 ///////////
  const clickButton = (e) => {
    e.preventDefault();

    // 버튼 글자 읽기
    let btnText = e.target.innerText;
    // console.log(btnText);

    // 버튼별 분기
    switch (btnText) {
      // 글쓰기 모드로 변경
      case "Write":
        setMode("W");
        break;
      // 리스트 모드로 변경
      case "List":
        setMode("L");
        break;
      // 서브밋일 경우 함수 호출
      case "Submit":
        submitFn();
        break;
      // 수정일 경우 수정 모드로 변경
      case "Modify":
        setMode("M");
        break;
      // 삭제일 경우 삭제 함수 호출
      case "Delete":
        deleteFn();
        break;
    }
  }; ///////// clickButton /////////

  // 삭제 처리 함수 ///////////////
  const deleteFn = () => {
    // 삭제 여부 확인
    if (window.confirm("Are you sure you want to delete?")) {
      // 1. 해당 항목 idx 담기
      let currIdx = selRecord.current.idx;

      // 2. some()로 순회하여 해당 항목 삭제하기
      // find()와 달리 some()은 결과값을 bollean값으로 리턴하여 처리한다!
      // 이것을 이용하여 코드 처리해보자!
      baseData.some((v, i) => {
        if (v.idx == currIdx) {
          // 해당 순번 배열값을 삭제하자!
          // 배열 삭제는 splice(순번,1)
          baseData.splice(i, 1);
          return true;
        } /// if ///
      }); ////// some 메서드 //////

      // 3. 로컬스에 업데이트하기 //////
      localStorage.setItem("board-data", JSON.stringify(baseData));

      // 4.
      totalCount.current=baseData.length;

      // 5. 리스트로 돌아가기 /////
      // -> 모드변경! "L"
      setMode("L");
    } /// if ///
  }; ///////// deleteFn /////////

  // 서브밋 처리 함수 ///////////////
  const submitFn = () => {
    // 제목 입력 항목
    let title = $(".subject").val().trim();
    // 내용 입력 항목
    let cont = $(".content").val().trim();
    // trim()으로 앞뒤 공백 제거 후 검사!

    // 1. 공통 유효성 검사
    // 제목, 내용 모두 비었으면 return
    if (title == "" || cont == "") {
      alert("Insert Title or Content!");
      return; // 서브밋 없이 함수 나가기!
    } /// if ///

    // 2. 글쓰기 서브밋 (mode=="W")
    if (mode == "W") {
      // 현재 로그인 사용자 정보 파싱하기
      let person = JSON.parse(sts);

      // [ 1. 오늘 날짜 생성하기 ]
      let today = new Date();
      // yyyy-mm-dd 형식으로 구하기
      // 제이슨 날짜 형식 : toJSON()
      // ISO 표준형식 : toISOString()
      // -> 시간까지 나오므로 앞에 10자리만 가져간다
      // -> 문자열.substr(0,10)

      // [ 2. 글 번호 만들기 ]
      // (1) 전체 데이터 중 idx만 모아서 배열 만들기
      let arrIdx = baseData.map((v) => parseInt(v.idx));
      // console.log(arrIdx);
      // (2) 최대값 찾기 : 스프레드 연산자로 배열값만 넣음!
      let maxNum = Math.max(...arrIdx);
      // console.log(maxNum);

      // [ 3. 입력 데이터 객체형식으로 구성하기 ]
      let data = {
        idx: maxNum + 1,
        tit: title,
        cont: cont,
        att: "",
        date: today.toJSON().substr(0, 10),
        uid: person.uid,
        unm: person.unm,
        cnt: "0",
      };

      // [ 4. 로컬스에 입력하기 ]
      // (1) 로컬스 파싱
      let locals = localStorage.getItem("board-data");
      locals = JSON.parse(locals);
      // (2) 파싱 배열에 push
      locals.push(data);
      // (3) 새 배열을 문자화하여 로컬스에 넣기
      localStorage.setItem("board-data", JSON.stringify(locals));

      // console.log(localStorage.getItem("board-data"));

      // [ 5. 리스트로 돌아가기 -> 모드 변경 "L" ]
      setMode("L");
    } /// if ///

    // 3. 수정모드 서브밋 (mode=="M")
    else if (mode == "M") {
      // 현재 로그인 사용자 정보 파싱하기
      let person = JSON.parse(sts);

      // [ 1. 오늘 날짜 생성하기 ]
      // -> 수정시 수정 날짜 항목을 새로 만들고 입력함!
      let today = new Date();
      // yyyy-mm-dd 형식으로 구하기
      // 제이슨 날짜 형식 : toJSON()
      // ISO 표준형식 : toISOString()
      // -> 시간까지 나오므로 앞에 10자리만 가져간다
      // -> 문자열.substr(0,10)

      // 현재 데이터 idx값
      let currIdx = selRecord.current.idx;

      // [ 2. 기존 데이터로 찾아서 변경하기 : 로컬스 데이터 -> baseData ]
      // find()는 특정 항목을 찾아서 리턴하여 데이터를 가져오기도 하지만
      // 업데이트 등 작업도 가능하다!
      baseData.find((v) => {
        console.log(v, selRecord);
        if (v.idx == currIdx) {
          // 업데이트 작업하기
          // 기존 항목 변경 : tit, cont
          v.tit = title;
          v.cont = cont;
          // 새 항목 추가 : mdate
          // (원래는 확정된 DB스키마에 따라 입력해야 하지만
          // 우리가 사용하는 로컬스토리지의 확장성에 따라 필요한
          // 항목을 추가하여 넣는다!)
          // (3) 수정일: mdate
          v.mdate = today.toJSON().substr(0, 10);

          // 해당 항목을 찾으면 끝남!
          return true;
        } /// if ///
      }); ////// find 메서드 //////

      // [ 4. 로컬스에 업데이트하기 ]
      localStorage.setItem("board-data", JSON.stringify(baseData));

      // [ 5. 리스트로 돌아가기 -> 모드 변경 "L" ]
      setMode("L");
    } /// else if ///
  }; ///////// submitFn /////////

  //// 코드 리턴 구역 //////////////
  return (
    <>
      <main className="cont">
        <h1 className="tit">OPINION</h1>
        {
          // 1. 리스트 모드일 경우 리스트 출력하기
          mode == "L" && (
            <ListMode bindList={bindList} pagingList={pagingList} />
          )
        }
        {
          // 2. 읽기 모드일 경우 리스트 출력하기
          mode == "R" && <ReadMode selRecord={selRecord} />
        }
        {
          // 3. 쓰기 모드일 경우 리스트 출력하기
          // sts값은 문자열이르모 파싱하여 객체로 보냄
          mode == "W" && <WriteMode sts={JSON.parse(sts)} />
        }
        {
          // 4. 수정 모드일 경우 상세보기 출력하기
          // sts값은 문자열이르모 파싱하여 객체로 보냄
          mode == "M" && <ModifyMode selRecord={selRecord} />
        }
        <br />
        {/* 모드별 버튼 출력 */}
        <table className="dtbl btngrp">
          <tbody>
            <tr>
              <td>
                {
                  // 1. 글쓰기 버튼은 로그인 상태이고, L이면 출력
                  mode == "L" && <button onClick={clickButton}>Write</button>
                }
                {
                  // 2. 읽기 상태 "R"일 경우
                  <>
                    {mode == "R" && <button onClick={clickButton}>List</button>}
                    {/* {console.log("비교",JSON.parse(sts).uid,"==?",selRecord.current.uid)} */}
                    {
                      // 로그인한 상태이고 글쓴이와 일치할 때 수정 보드 이동 버튼이 노출됨!
                      // 현재 글은 selRecord 참조변수에 저장됨
                      // 글 정보 항목중 uid가 사용자 아이디임
                      // 로그인 상태정보 하위의 sts.uid와 비교함
                      mode == "R" &&
                        sts &&
                        JSON.parse(sts).uid == selRecord.current.uid && (
                          <button onClick={clickButton}>Modify</button>
                        )
                    }
                  </>
                }
                {
                  // 3. 쓰기 상태 "W"일 경우
                  mode == "W" && (
                    <>
                      <button onClick={clickButton}>Submit</button>
                      <button onClick={clickButton}>List</button>
                    </>
                  )
                }
                {
                  // 4. 수정 상태 "M"일 경우
                  mode == "M" && (
                    <>
                      <button onClick={clickButton}>Submit</button>
                      <button onClick={clickButton}>List</button>
                      <button onClick={clickButton}>Delete</button>
                    </>
                  )
                }
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
} ////////////////// Board //////////////////

/******************************************* 
  리스트 모드 서브 컴포넌트
*******************************************/

const ListMode = ({ bindList, pagingList }) => {
  return (
    <>
      <div className="selbx">
        <select name="cta" id="cta" className="cta">
          <option value="tit">Title</option>
          <option value="cont">Contents</option>
          <option value="unm">Writer</option>
        </select>
        <select name="sel" id="sel" className="sel">
          <option value="0">Descending</option>
          <option value="1">Ascending</option>
        </select>
        <input id="stxt" type="text" maxLength="50" />
        <button className="sbtn">Search</button>
      </div>
      <table className="dtbl" id="board">
        <thead>
          <tr>
            <th>Number</th>
            <th>Title</th>
            <th>Writer</th>
            <th>Date</th>
            <th>Hits</th>
          </tr>
        </thead>
        <tbody>{bindList()}</tbody>
        <tfoot>
          <tr>
            <td colSpan="5" className="paging">
              {pagingList()}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}; ////////////////// ListMode //////////////////

/******************************************* 
  읽기 모드 서브 컴포넌트
*******************************************/

const ReadMode = ({ selRecord }) => {
  // 읽기 모드가 호출되었다는 것은 리스트의 제목이 클릭되었다는 것을 의미
  // 따라서, 현재 레코드 값도 저장되었다는 의미
  // console.log("전달된 참조변수:", selRecord.current);
  // 전달된 데이터 객체를 변수에 할당
  const data = selRecord.current;

  return (
    <>
      <table className="dtblview readone">
        <caption>OPINION : Read</caption>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <input
                type="text"
                className="name"
                size="20"
                readOnly
                value={data.unm}
              />
            </td>
          </tr>
          <tr>
            <td>Title</td>
            <td>
              <input
                type="text"
                className="subject"
                size="60"
                readOnly
                value={data.tit}
              />
            </td>
          </tr>
          <tr>
            <td>Content</td>
            <td>
              <textarea
                className="content"
                cols="60"
                rows="10"
                readOnly
                value={data.cont}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td>Attachment</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}; ////////////////// ReadMode //////////////////

/******************************************* 
  쓰기 모드 서브 컴포넌트
*******************************************/

const WriteMode = ({ sts }) => {
  // sts - 로그인 상태 정보
  // 로그인한 사람만 글쓰기 가능

  // console.log(sts);

  return (
    <>
      <table className="dtblview readone">
        <caption>OPINION : Write</caption>
        <tbody>
          <tr>
            <td>Email</td>
            <td>
              <input
                type="text"
                className="email"
                size="40"
                readOnly
                // 로그인한 사람 이름
                value={sts.unm}
              />
            </td>
          </tr>
          <tr>
            <td>Title</td>
            <td>
              <input type="text" className="subject" size="60" />
            </td>
          </tr>
          <tr>
            <td>Content</td>
            <td>
              <textarea className="content" cols="60" rows="10"></textarea>
            </td>
          </tr>
          <tr>
            <td>Attachment</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}; ////////////////// WriteMode //////////////////

/****************************************** 
        수정 모드 서브 컴포넌트
******************************************/
const ModifyMode = ({ selRecord }) => {
  // 수정 모드가 호출되었다는 것은
  // 리스트의 제목이 클릭되었다는 것을 의미!
  // 따라서 현재 레코드 값도 저장되었다는 의미!
  // console.log("전달된 참조변수:", selRecord.current);
  // 전달된 데이터 객체를 변수에 할당
  const data = selRecord.current;

  return (
    <>
      <table className="dtblview readone">
        <caption>OPINION : Modify</caption>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <input
                type="text"
                className="name"
                size="20"
                readOnly
                value={data.unm}
              />
            </td>
          </tr>
          <tr>
            <td>Title</td>
            <td>
              <input
                type="text"
                className="subject"
                size="60"
                defaultValue={data.tit}
              />
            </td>
          </tr>
          <tr>
            <td>Content</td>
            <td>
              <textarea
                className="content"
                cols="60"
                rows="10"
                defaultValue={data.cont}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td>Attachment</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}; ///////////// ModifyMode //////////////////
