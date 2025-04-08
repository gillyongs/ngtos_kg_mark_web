import React, { useState } from "react";
import { saveNsrResultMark } from "../util/saveHandlers";
import Keyboard from "./Keyboard";
const TableContainer = ({ keyboardState, setKeyboardState, nsrResult, category, setNsrResult, params, playerData }) => {
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
    const validPattern = /^$|^\.$|^\.\d$|^\d$|^\d{2}$|^\d\.$|^\d\.\d$/;

    let value;
    const prevValue = String(keyboardState.value);
    if (inputValue === "backspace") {
      if (keyboardState.state === "focus") {
        value = "";
        setKeyboardState((prev) => ({
          ...prev,
          state: "edit",
        }));
      } else {
        value = prevValue.slice(0, -1); // 마지막 글자 제거
      }
    } else {
      if (keyboardState.state === "focus") {
        value = inputValue;
        setKeyboardState((prev) => ({
          ...prev,
          state: "edit",
        }));
      } else {
        value = prevValue + inputValue;
      }
    }

    const dotCount = (value.match(/\./g) || []).length;
    const digitCount = (value.match(/\d/g) || []).length;

    if (dotCount >= 2 || digitCount >= 3) {
      return; // 조건에 맞으면 아무 작업도 하지 않음
    }

    if (value === "10") {
      //10일 경우 우선 처리
      handleCellClick(keyboardState.targetId, value, nsrResult.selectedCells);
      setKeyboardState((prev) => ({
        ...prev,
        value: value,
      }));
      return;
    }

    if (value.match(/^\d{2}$/)) {
      // 숫자 두자리 입력시 자동 소수점 반영
      let num = parseFloat(value);
      num = parseFloat((num / 10).toFixed(1));
      value = num;
      handleCellClick(keyboardState.targetId, num, nsrResult.selectedCells);
      setKeyboardState((prev) => ({
        ...prev,
        value: value,
      }));
      return;
    }

    if (value === ".") value = "0."; //.부터 입력한 경우
    if (value.match(/^\.\d$/)) value = "0" + value;

    if (!validPattern.test(value)) {
      setKeyboardState({ show: false, targetId: null, value: value });
      return;
    }

    setKeyboardState((prev) => ({
      ...prev,
      value: value,
    }));

    handleCellClick(keyboardState.targetId, value, nsrResult.selectedCells);

    // console.log("e");

    // handleCellClick(keyboardState.targetId, value, nsrResult.selectedCells);
    // setKeyboardState({ show: false, targetId: null, value: value });
  };

  const handleCellClick = (rowId, value, selectedCells) => {
    let newSelectedCells = { ...selectedCells };
    if (!value) {
      newSelectedCells[rowId] = value;
    } else {
      newSelectedCells[rowId] = Number(value);
    }

    let point = (value * nsrResult.markData[rowId - 1].MAX_POINT) / 10;
    point = Math.round(point * 10) / 10;

    if (point === null || point === undefined || point === "") {
      point = -1;
    }

    setNsrResult((prevState) => ({
      ...prevState,
      selectedCells: newSelectedCells,
      isSave: 0,
    }));

    saveNsrResultMark({
      params: params,
      playerData: playerData,
      nsrResult: nsrResult,
      rowId: rowId,
      value: point,
    });

    const numericValuesCount = Object.values(newSelectedCells).filter((value) => typeof value === "number" && value > 0).length;
    if (numericValuesCount === nsrResult.maxCount) {
      setNsrResult((prevState) => ({
        ...prevState,
        isSave: 1,
      }));
    }
  };

  return (
    <>
      {nsrResult.categories.length > 1 &&
        nsrResult.categories.map((categories, index) => {
          const filteredData = nsrResult.markData.filter((item) => item.CATEGORY === categories);
          const totalMaxPoint = filteredData.reduce((sum, item) => sum + Number(item.MAX_POINT), 0);

          return (
            <tr key={index}>
              {index === 0 && (
                <td className="text-center" rowSpan={nsrResult.categories.length} style={{ width: "8vw", verticalAlign: "middle" }}>
                  {getCategory(category)} <br /> ({nsrResult.allPoint}점)
                </td>
              )}
              <td className="text-center" style={{ width: "12vw" }}>
                {categories} <br /> ({totalMaxPoint}점)
              </td>
              <td style={{ textAlign: "left", width: "60vw" }}>
                {filteredData.map((item, i) => (
                  <div key={i}>
                    {item.MARK_CONTENT.split(/\r\n|\n|\r/).map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                ))}
              </td>
              <td style={{ width: "5vw" }}>10</td>
              <td
                style={{
                  width: "10vw",
                  textAlign: "center",
                  fontSize: "20px",
                  cursor: "pointer",
                  minHeight: "50px",
                  padding: "4px",
                  backgroundColor: keyboardState.targetId === index + 1 && keyboardState.category === category ? "#e0f7fa" : "#ffffff",
                  border: "1px solid",
                  borderColor: keyboardState.targetId === index + 1 && keyboardState.category === category ? "#00acc1" : "#777",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setKeyboardState((prev) => {
                    const isSameTarget = prev.targetId === index + 1 && prev.category === category;
                    const newState = isSameTarget && prev.state === "focus" ? "edit" : "focus";

                    return {
                      show: true,
                      category,
                      targetId: index + 1,
                      value: nsrResult.selectedCells[index + 1]?.toString() || "",
                      state: newState,
                    };
                  });
                }}>
                {keyboardState.targetId === index + 1 && keyboardState.category === category ? (
                  <>
                    {keyboardState.value}
                    {keyboardState.state === "edit" && <div className="blinking-cursor">I</div>}
                  </>
                ) : (
                  nsrResult.selectedCells[index + 1] ?? ""
                )}
              </td>
            </tr>
          );
        })}

      {nsrResult.categories.length === 1 &&
        nsrResult.markData.map((item, index) => (
          <tr key={index} className="mark-table-body-tr" style={{ height: "10px" }}>
            {index === 0 && (
              <td className="text-center" rowSpan={nsrResult.markData.length} style={{ width: "8vw", verticalAlign: "middle" }}>
                {getCategory(category)} <br /> ({nsrResult.allPoint}점)
              </td>
            )}
            <td className="text-left" colSpan={2} style={{ textAlign: "left", width: "72vw" }}>
              {item.MARK_CONTENT}
            </td>
            <td style={{ width: "5vw" }}>10</td>
            <td style={{ width: "10vw", padding: 0, border: "none" }}>
              <div
                onClick={(e) => {
                  e.stopPropagation();

                  setKeyboardState((prev) => {
                    const isSameTarget = prev.targetId === index + 1 && prev.category === category;
                    const newState = isSameTarget && prev.state === "focus" ? "edit" : "focus";

                    return {
                      show: true,
                      category,
                      targetId: index + 1,
                      value: nsrResult.selectedCells[index + 1]?.toString() || "",
                      state: newState,
                    };
                  });
                }}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "20px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  minHeight: "70px",
                  backgroundColor: keyboardState.targetId === index + 1 && keyboardState.category === category ? "#e0f7fa" : "#ffffff", // ← 기본 흰색
                  borderTop: "1px solid #999",
                  borderRight: "1px solid #999",
                  borderBottom: "1px solid #999",
                  borderLeft: "none", // 왼쪽 테두리 제거
                  borderColor: keyboardState.targetId === index + 1 && keyboardState.category === category ? "#00acc1" : "#999", // ← 기본 검정 테두리
                  boxSizing: "border-box",
                }}>
                {keyboardState.targetId === index + 1 && keyboardState.category === category ? (
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
        ))}

      {keyboardState.show && keyboardState.category === category && (
        <div
          onClick={(e) => e.stopPropagation()} // 클릭 이벤트 상위 전파 방지!
        >
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
          />
        </div>
      )}
    </>
  );
};

export default TableContainer;
