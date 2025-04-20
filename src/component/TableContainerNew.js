import React from "react";
import { saveNsrResultMark } from "../util/saveHandlers";
import Keyboard from "./Keyboard";

const TableContainer = ({ fontSize, keyboardState, setKeyboardState, nsrResult, category, setNsrResult, params, playerData, onNext, onPrev, end }) => {
  const getCategory = (category) => {
    switch (parseInt(category)) {
      case 1:
        return "기술성";
      case 2:
        return "예술성";
      case 3:
        return "완성도";
      default:
        return 0;
    }
  };

  const handleKeyboardInput = (inputValue) => {
    // 유효한 입력 패턴: 1 ~ 10 또는 1.0 ~ 9.9
    const validPattern = /^$|^\d$|^\d{2}$|^\d\.$|^\d\.\d$/;
    let value;
    const prevValue = String(keyboardState.value);

    if (inputValue === "backspace") {
      value = keyboardState.state === "focus" ? "" : prevValue.slice(0, -1);
      if (keyboardState.state === "focus") {
        setKeyboardState((prev) => ({ ...prev, state: "edit" }));
      }
    } else {
      value = keyboardState.state === "focus" ? inputValue : prevValue + inputValue;
      if (keyboardState.state === "focus") {
        setKeyboardState((prev) => ({ ...prev, state: "edit" }));
      }
    }

    const dotCount = (value.match(/\./g) || []).length;
    const digitCount = (value.match(/\d/g) || []).length;

    if (dotCount >= 2 || digitCount >= 3) return;

    // 입력값 숫자 변환 후 1 미만이면 리턴
    const numericValue = parseFloat(value);
    if (numericValue < 1) alert("최저 점수는 1점입니다.");
    if (!isNaN(numericValue) && numericValue < 1) return;

    // 10점 예외 처리
    if (value === "10") {
      handleCellClick(keyboardState.targetId, value, nsrResult.selectedCells);
      setKeyboardState((prev) => ({ ...prev, value }));
      return;
    }

    // 두 자리 숫자 → 자동 소수점 환산 (예: 87 → 8.7)
    if (value.match(/^\d{2}$/)) {
      let num = parseFloat((parseFloat(value) / 10).toFixed(1));
      if (num < 1) return; // 자동 변환 후 1 미만이면 무효
      value = num;
      handleCellClick(keyboardState.targetId, num, nsrResult.selectedCells);
      setKeyboardState((prev) => ({ ...prev, value }));
      return;
    }

    // 더 이상 "."이나 ".5" 같은 보정은 제거
    // if (value === ".") value = "0.";
    // if (value.match(/^\.\d$/)) value = "0" + value;

    if (!validPattern.test(value)) {
      setKeyboardState({ show: false, targetId: null, value });
      return;
    }

    if (!isNaN(numericValue) && numericValue < 1) return;

    setKeyboardState((prev) => ({ ...prev, value }));
    handleCellClick(keyboardState.targetId, value, nsrResult.selectedCells);
  };

  const handleCellClick = (rowId, value, selectedCells) => {
    const newSelectedCells = { ...selectedCells, [rowId]: value ? Number(value) : value };

    let point = (value * nsrResult.markData[rowId - 1].MAX_POINT) / 10;
    point = Math.round(point * 10) / 10 || -1;

    setNsrResult((prev) => ({ ...prev, selectedCells: newSelectedCells, isSave: 0 }));

    saveNsrResultMark({
      params,
      playerData,
      nsrResult,
      rowId,
      value: point,
    });

    const count = Object.values(newSelectedCells).filter((v) => typeof v === "number" && v > 0).length;
    if (count === nsrResult.maxCount) {
      setNsrResult((prev) => ({ ...prev, isSave: 1 }));
    }
  };

  const handleScoreCellClick = (index) => {
    if (end) return;
    setKeyboardState((prev) => {
      const isSame = prev.targetId === index + 1 && prev.category === category;

      // 이미 선택된 셀을 다시 클릭한 경우 => 닫기
      if (isSame) {
        return {
          show: false,
          targetId: null,
          category: null,
          value: null,
          state: null,
        };
      }

      // 새로 선택된 셀 => 열기
      return {
        show: true,
        category,
        targetId: index + 1,
        value: nsrResult.selectedCells[index + 1]?.toString() || "",
        state: "focus",
      };
    });
  };

  return (
    <>
      {nsrResult.categories.length > 1 &&
        nsrResult.categories.map((categories, index) => {
          const isActiveRow = keyboardState.targetId === index + 1 && keyboardState.category === category;
          const filteredData = nsrResult.markData.filter((item) => item.CATEGORY === categories);
          const totalMaxPoint = filteredData.reduce((sum, item) => sum + Number(item.MAX_POINT), 0);

          return (
            <tr
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleScoreCellClick(index);
              }}>
              {index === 0 && (
                <td className={`table-category-label ${isActiveRow ? "active" : ""}`} rowSpan={nsrResult.categories.length} style={{ fontSize: `${fontSize}px` }}>
                  {getCategory(category)} <br /> ({nsrResult.allPoint}점)
                </td>
              )}
              <td className={`table-subcategory ${isActiveRow ? "active" : ""}`} style={{ fontSize: `${fontSize}px` }}>
                {categories} <br /> ({totalMaxPoint}점)
              </td>
              <td className={`table-content ${isActiveRow ? "active" : ""}`} style={{ fontSize: `${fontSize}px` }}>
                {filteredData.map((item, i) => (
                  <div key={i}>
                    {item.MARK_CONTENT.split(/\r\n|\n|\r/).map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                ))}
              </td>
              <td className={`table-maxscore ${isActiveRow ? "active" : ""}`} style={{ fontSize: `${fontSize}px` }}>
                10
              </td>
              <td
                className={`table-score-cell ${isActiveRow ? "active" : ""}`}
                style={{ fontSize: `${fontSize}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (end) {
                    alert("채점이 완료되어 점수를 수정할 수 없습니다.");
                    return;
                  }
                  handleScoreCellClick(index);
                }}>
                <div
                  className="cell-wrapper"
                  style={{
                    display: "flex",
                    alignItems: "center", // 세로 가운데 정렬
                    justifyContent: "center", // 가로 가운데 정렬
                    minHeight: `${fontSize * 3.7}px`,
                  }}>
                  {" "}
                  {isActiveRow ? (
                    <>
                      {keyboardState.value}
                      {keyboardState.state === "edit" && <div className="blinking-cursor">I</div>}
                    </>
                  ) : (
                    nsrResult.selectedCells[index + 1] ?? ""
                  )}
                </div>
              </td>
            </tr>
          );
        })}

      {nsrResult.categories.length === 1 &&
        nsrResult.markData.map((item, index) => {
          const isActiveRow = keyboardState.targetId === index + 1 && keyboardState.category === category;

          return (
            <tr
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleScoreCellClick(index);
              }}>
              {index === 0 && (
                <td className={`table-category-label ${isActiveRow ? "active" : ""}`} rowSpan={nsrResult.markData.length} style={{ fontSize: `${fontSize}px` }}>
                  {getCategory(category)} <br /> ({nsrResult.allPoint}점)
                </td>
              )}
              <td className={`table-single-content ${isActiveRow ? "active" : ""}`} colSpan={2} style={{ fontSize: `${fontSize}px` }}>
                {item.MARK_CONTENT}
              </td>
              <td className={`table-maxscore ${isActiveRow ? "active" : ""}`} style={{ fontSize: `${fontSize}px` }}>
                10
              </td>
              <td
                className={`table-score-cell ${isActiveRow ? "active" : ""}`}
                style={{ fontSize: `${fontSize}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (end) {
                    alert("채점이 완료되어 점수를 수정할 수 없습니다.");
                    return;
                  }
                  handleScoreCellClick(index);
                }}>
                <div
                  className="cell-wrapper"
                  style={{
                    display: "flex",
                    alignItems: "center", // 세로 가운데 정렬
                    justifyContent: "center", // 가로 가운데 정렬
                    minHeight: `${fontSize * 3.7}px`,
                  }}>
                  {" "}
                  {isActiveRow ? (
                    <>
                      {keyboardState.value}
                      {keyboardState.state === "edit" && <div className="blinking-cursor">I</div>}
                    </>
                  ) : (
                    nsrResult.selectedCells[index + 1] ?? ""
                  )}
                </div>
              </td>
            </tr>
          );
        })}

      {keyboardState.show && keyboardState.category === category && (
        <div onClick={(e) => e.stopPropagation()}>
          <Keyboard
            onClick={(e) => e.stopPropagation()}
            onInput={handleKeyboardInput}
            onClose={() =>
              setKeyboardState({
                show: false,
                targetId: null,
                category: null,
                value: null,
              })
            }
            onNext={onNext}
            onPrev={onPrev}
          />
        </div>
      )}
    </>
  );
};

export default TableContainer;
