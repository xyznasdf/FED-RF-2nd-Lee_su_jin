import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";

const AddressInput = ({ changeAddr }) => {
  // changeAddr - 회원가입 양식 체크 전달 함수

  // 상태관리변수
  // [1] 우편번호
  const [zonecode, setZonecode] = useState("");
  // [2] 주소
  const [address, setAddress] = useState("");
  // [3] 주소 찾기 창 보이기 여부
  const [isOpen, setIsOpen] = useState(false);

  // 스타일 객체 ///////////////////
  // [1] 다음 주소창 테마 디자인 객체 (속성은 다음 API)
  const themeObj = {
    bgColor: "#FFFFFF",
    pageBgColor: "#FFFFFF",
    postcodeTextColor: "#C05850",
    emphTextColor: "#222222",
  };

  // [2] 검색창 크기 설정 객체
  const postCodeStyle = {
    width: "40vw",
    height: "60vh",
  };

  // [3] 전체 박스 스타일 객체
  const wholeBoxStyle = {
    display: "inline-block",
    verticalAlign: "top",
  };

  // [4] 팝업 윈도우 스타일 객체
  const popupWindowStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    translate: "-50% -50%",
    backgroundColor: "white",
    padding: "20px",
    border: "4px double #000",
    zIndex: "1",
  };

  // [5] 닫기 버튼 스타일 객체
  const closeButtonStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    fontSize: "40px",
    backgroundColor: "transparent",
    border: "none",
  };

  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setZonecode(zonecode);
    setAddress(address);
  };

  // 기능 처리 함수 //////////////////
  // [1] 주소 선택 완료시 처리 함수
  const closeHandler = (state) => {
    // 강제 닫기
    if (state === "FORCE_CLOSE") {
      setIsOpen(false);
    }
    // 선택 완료시 닫기
    else if (state === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };

  // [2] 주소창 열기/닫기 토글 기능 함수
  const toggleHandler = () => {
    setIsOpen((prevOpenState) => !prevOpenState);
  };

  // 랜더링 구역 : 매번 ////////////
  useEffect(() => {
    // 주소값과 우편번호값을 갱신하는 함수 호출
    changeAddr(); // -> 내가 생성한 함수를 프롭스 다운!
  }); ////// useEffect //////

  // 코드 리턴 구역 //////////////////////
  return (
    <div style={wholeBoxStyle}>
      <div>
        <div style={{ paddingLeft: "20px", lineHeight: "2" }}>
          <button type="button" onClick={toggleHandler}>
            Search Address
          </button>
          <div>
            ZipCode :
            <input
              className="zipcode"
              value={zonecode}
              readOnly
              onClick={toggleHandler}
              placeholder="Click 'Search Address'"
            />
          </div>
        </div>
        {isOpen && (
          <div style={popupWindowStyle}>
            <DaumPostcode
              theme={themeObj}
              style={postCodeStyle}
              onComplete={completeHandler}
              onClose={closeHandler}
            />
            <button style={closeButtonStyle} onClick={toggleHandler}>
              ×
            </button>
          </div>
        )}
        {/* 주소 자동 완성 앞부분 */}
        <input
          className="addr1"
          value={address}
          readOnly
          onClick={toggleHandler}
          style={{ width: "100%" }}
          placeholder="Click 'Search Address'"
        />
        {/* 주소 직접 작성 뒷부분(상세 주소) */}
        <input
          className="addr2"
          placeholder="input detail adress"
          style={{ width: "100%" }}
          onChange={changeAddr}
          onBlur={changeAddr}
        />
      </div>
    </div>
  );
};

export default AddressInput;
