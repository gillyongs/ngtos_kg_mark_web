import React from "react";

const ComplianceCheck = ({ yn1, yn2, setYn1, setYn2, params, end }) => {
  const detail_class_cd = params.detail_class_cd;
  const kind_cd = params.kind_cd;

  let timeText;
  if (detail_class_cd % 2 === 0) {
    timeText = "단체전: 5분이내";
  } else {
    timeText = kind_cd === 5 ? "개인전 전문부: 5분이내" : "개인전: 기공별 표준시간 이내";
  }

  const checkboxStyle = {
    transform: "scale(1.5)",
    cursor: "pointer",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const tdBaseStyle = {
    fontSize: "25px",
    padding: "10px 20px",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  const tdLeftAlign = {
    ...tdBaseStyle,
    textAlign: "left",
    cursor: "default", // 클릭 없음
  };

  const handleYnChange = (setter, value) => {
    if (end) {
      alert("채점이 완료되어 점수를 수정할 수 없습니다.");
      return;
    }
    setter(value);
  };

  return (
    <table>
      <tbody>
        {/* 표준시간 확인 */}
        <tr>
          <td style={tdLeftAlign}>※ 표준시간 확인 ({timeText})</td>
          <td style={tdBaseStyle} onClick={() => handleYnChange(setYn1, true)}>
            <label style={labelStyle}>
              <input type="checkbox" checked={yn1 === true} onChange={() => handleYnChange(setYn1, true)} style={checkboxStyle} />
              <span>준수</span>
            </label>
          </td>
          <td style={tdBaseStyle} onClick={() => handleYnChange(setYn1, false)}>
            <label style={labelStyle}>
              <input type="checkbox" checked={yn1 === false} onChange={() => handleYnChange(setYn1, false)} style={checkboxStyle} />
              <span>미준수</span>
            </label>
          </td>
        </tr>

        {/* 대회복장 확인 */}
        <tr>
          <td style={tdLeftAlign}>※ 대회복장 확인 (한복 또는 개량 한복)</td>
          <td style={tdBaseStyle} onClick={() => handleYnChange(setYn2, true)}>
            <label style={labelStyle}>
              <input type="checkbox" checked={yn2 === true} onChange={() => handleYnChange(setYn2, true)} style={checkboxStyle} />
              <span>준수</span>
            </label>
          </td>
          <td style={tdBaseStyle} onClick={() => handleYnChange(setYn2, false)}>
            <label style={labelStyle}>
              <input type="checkbox" checked={yn2 === false} onChange={() => handleYnChange(setYn2, false)} style={checkboxStyle} />
              <span>미준수</span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ComplianceCheck;
