import React from "react";

const Keyboard = ({ onInput, onClose }) => {
  const row1 = ["1", "2", "3", "4", "5", "←"];
  const row2 = ["6", "7", "8", "9", "0", "."];

  const handleClick = (btn) => {
    if (btn === "←") {
      onInput("backspace");
    } else {
      onInput(btn);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#ccc", // ✅ 바탕 회색
        padding: "12px",
        borderTop: "1px solid #aaa",
        zIndex: 1000,
      }}>
      {[row1, row2].map((row, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "10px",
          }}>
          {row.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              style={{
                fontSize: "20px",
                padding: "14px 0",
                minWidth: "50px",
                borderRadius: "6px",
                border: "1px solid #999",
                backgroundColor: "#007BFF", // ✅ 버튼 파랑
                color: "#fff", // ✅ 숫자 흰색
                cursor: "pointer",
              }}>
              {btn}
            </button>
          ))}
        </div>
      ))}

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onClose}
          style={{
            fontSize: "16px",
            padding: "6px 16px",
            backgroundColor: "#fff", // ✅ 닫기 버튼도 파랑
            color: "#007BFF", // ✅ 닫기 글자도 흰색
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          키보드 닫기
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
