import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BackBar = ({ url, text, sentialDigit }) => {
  const backBarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottom: "1px solid #ccc",
  };

  const arrowStyle = {
    margin: "0",
    padding: "0",
    cursor: "pointer",
    fontSize: "50px", // 줄여서 높이 맞춤
    lineHeight: "1", // 높이 맞춤
    display: "flex",
    alignItems: "center",
    marginLeft: "20px", // ← 왼쪽 여백 추가
  };

  const refreeNameStyle = {
    textAlign: "center",
    flexGrow: 1,
    marginRight: "75px",
    fontSize: "25px", // 기존보다 키움
    fontWeight: "600",
    color: "#2c3e50",
  };

  const navigate = useNavigate();
  const handleResetMove = (nextLink) => {
    if (sentialDigit) {
      const isConfirmed = window.confirm("채점이 완료되지 않았습니다. 이동하시겠습니까?");
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
