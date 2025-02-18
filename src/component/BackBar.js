import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BackBar = ({ url, text, sentialDigit }) => {
  const backBarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "5px",
    borderBottom: "1px solid #ccc",
  };

  const arrowStyle = {
    margin: "0",
    marginTop: "-5px",
    cursor: "pointer",
    transform: "scale(0.9)", // 크기를 0.9배로 줄임
    transformOrigin: "center", // 크기 조정 기준점 (중앙 기준)
  };

  const refreeNameStyle = {
    textAlign: "center", // 가운데 정렬
    flexGrow: 1, // h2 요소가 가운데로 오도록 flexGrow 추가
    marginRight: "27px", // 오른쪽 마진 추가
  };

  const navigate = useNavigate();
  const handleResetMove = (nextLink) => {
    if (sentialDigit) {
      const isConfirmed = window.confirm(
        "평점 합계나 인원수가 저장되지 않았습니다. 이동하시겠습니까?"
      );
      if (!isConfirmed) {
        return;
      }
    }
    if (nextLink) {
      navigate(nextLink);
    }
  };

  // sentialDigit 값이 true인 경우 Link를 렌더링하지 않음 (경고창을 띄운 다음 이동하게)
  if (sentialDigit) {
    return (
      <div style={backBarStyle} onClick={() => handleResetMove(url)}>
        <h1 style={arrowStyle}>{"←"}</h1>
        {text && (
          <h3 style={refreeNameStyle}>
            {text}
            {sentialDigit}
          </h3>
        )}
      </div>
    );
  }

  // sentialDigit 값이 false인 경우 Link를 렌더링
  return (
    <div style={backBarStyle}>
      <Link to={url}>
        <h1 style={arrowStyle}>{"←"}</h1>
      </Link>
      {text && (
        <h3 style={refreeNameStyle}>
          {text}
          {sentialDigit}
        </h3>
      )}
    </div>
  );
};

export default BackBar;
