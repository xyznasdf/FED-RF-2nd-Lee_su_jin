// 하단영역 컴포넌트 ///
import { memo } from "react";

// 모듈
import Logo from "../modules/Logo";
import Weather from "../modules/Weather";

// 하단 메뉴 데이터
import { bmData } from "../data/bmenu";

// 하단영역 CSS
import "../../css/footer_area.scss";

// React.memo()를 사용한 컴포넌트 메모이제이션
// -> 컴포넌트를 할당형을 변경한다!
export const FooterArea = memo(() => {  
  console.log("하단영역!!!");
  //// 코드 리턴구역 //////////////
  return (
    <footer className="info">
      <ul>
        {/* 하단로고 컴포넌트 넣기 */}
        <li>
          <Logo logoStyle="bottom" />
        </li>
        <li>
          {/* 하단링크박스 */}
          <ol className="bmenu">
            {bmData.map((v, i) => (
              <li key={i}>
                <a href={v.link} target="_blank">
                  {
                    v.txt.toUpperCase()
                    // toUpperCase() 대문자변환
                    // toLowerCase() 소문자변환
                  }
                </a>
              </li>
            ))}
          </ol>
        </li>
        <li>© & ™ DC. ALL RIGHTS RESERVED</li>
      </ul>
      {/* 날씨정보 컴포넌트 */}
      <Weather />
    </footer>
  );
}); /////////// FooterArea /////////////////////
