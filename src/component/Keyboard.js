import React from "react";

const Keyboard = ({ onInput, onClose, onNext, onPrev }) => {
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
        width: "98%",
        background: "linear-gradient(to top, #f0f3f7, #dce3eb)",
        padding: "16px 10px",
        borderTop: "2px solid #b0bec5",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.1)",
        zIndex: 1000,
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}>
      {[row1, row2].map((row, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "10px",
            width: "100%",
          }}>
          {row.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              style={{
                flex: 1, // 👈 모든 버튼이 동일 너비로 가득 차게
                fontSize: "22px",
                padding: "20px 0",
                borderRadius: "10px",
                border: "1px solid #b0bec5",
                backgroundColor: "#1976d2",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}>
              {btn}
            </button>
          ))}
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "6px" }}>
        <button
          onClick={onPrev}
          style={{
            fontSize: "18px",
            padding: "14px 28px",
            backgroundColor: "#ffffff",
            color: "#1976d2",
            border: "2px solid #1976d2",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}>
          ←
        </button>
        <span> </span>
        <button
          onClick={onClose}
          style={{
            fontSize: "18px",
            padding: "14px 28px",
            backgroundColor: "#ffffff",
            color: "#1976d2",
            border: "2px solid #1976d2",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}>
          ⌨ 키보드 닫기
        </button>
        <span> </span>
        <button
          onClick={onNext}
          style={{
            fontSize: "18px",
            padding: "14px 28px",
            backgroundColor: "#ffffff",
            color: "#1976d2",
            border: "2px solid #1976d2",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}>
          →
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
