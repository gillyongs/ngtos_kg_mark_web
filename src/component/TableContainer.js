// import React from "react";
import React, { useState, useEffect } from "react";
import { saveNsrResultMark, saveNsrResult } from "../util/saveHandlers";

const TableContainer = ({
  nsrResult,
  category,
  setNsrResult,
  params,
  playerData,
}) => {
  const getCategory = (category) => {
    // 필요한 글자 하드코딩
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

  const handleCellClick = (rowId, value, selectedCells) => {
    // 셀 클릭 이벤트 처리

    if (
      value === "-" ||
      (value === 0.5 &&
        (!selectedCells[rowId] ||
          selectedCells[rowId] ===
            Number(nsrResult.markData[rowId - 1].MAX_POINT)))
    ) {
      return;
    } // '-'는 클릭되지 않음 + 0.5는 이미 선택된 셀이 있을때 (그리고 그 셀이 최대값 셀이 아닐때) 만 클릭됨
    let newSelectedCells = { ...selectedCells };
    if (value === 0.5) {
      newSelectedCells[rowId] =
        selectedCells[rowId] % 1 === 0.5
          ? selectedCells[rowId] - 0.5
          : selectedCells[rowId] + 0.5;
      value = newSelectedCells[rowId];
    } else {
      newSelectedCells[rowId] =
        value === Math.floor(selectedCells[rowId]) ? null : value;
      value = newSelectedCells[rowId];
    }
    const numericValuesCount = Object.values(newSelectedCells).filter(
      (value) => typeof value === "number" && value > 0
    ).length;

    setNsrResult((prevState) => ({
      ...prevState,
      selectedCells: newSelectedCells,
      isSave: 0,
    }));
    if (value == null || value == undefined) {
      value = -1;
    }
    saveNsrResultMark({
      params: params,
      playerData: playerData,
      nsrResult: nsrResult,
      rowId: rowId,
      value: value,
    });

    if (numericValuesCount === nsrResult.maxCount) {
      const totalCounts = Object.values(newSelectedCells).reduce(
        (total, value) => total + (value ? value : 0),
        0
      );
      saveNsrResult({ params, playerData, score: totalCounts });
      setNsrResult((prevState) => ({
        ...prevState,
        isSave: 1,
      }));
    }
  };

  const generateCellValueArray = (getMaxpoint, currentMaxPoint) => {
    const cellValues = [];
    for (let i = 1; i <= currentMaxPoint; i++) {
      cellValues.push(i);
    }
    for (let i = currentMaxPoint + 1; i <= getMaxpoint; i++) {
      cellValues.push("-");
    }
    if (category !== "3") {
      cellValues.push(0.5);
    }

    return cellValues;
  };

  const calculateTotal = (selectedCells) => {
    //선택된 셀들의 총합
    return Object.values(selectedCells).reduce(
      (total, value) => total + (value ? value : 0),
      0
    );
  };
  return (
    <div className="table-container">
      <table className="mark-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>항목</th>
            <th style={{ width: "80%" }}>채점포인트</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">
              {getCategory(category)} <br /> ({nsrResult.allPoint}점)
            </td>

            <td>
              {nsrResult.categories.map((category, catIndex) => {
                const categoryItems = nsrResult.markData.filter(
                  (item) => item.CATEGORY === category
                );
                const rowSpan = categoryItems.length;

                return categoryItems.map((item, index) => (
                  <tr key={`${category}-${index}`}>
                    {nsrResult.categories.length !== 1 && index === 0 && (
                      <td rowSpan={rowSpan} className="category">
                        {category} <br /> (
                        {categoryItems.reduce(
                          (acc, cur) => acc + Number(cur.MAX_POINT),
                          0
                        )}
                        점)
                      </td>
                    )}
                    <td className="content">{item.MARK_CONTENT}</td>
                    <td
                      className="score-cells d"
                      style={{ padding: 0, margin: 0 }}
                    >
                      {generateCellValueArray(
                        nsrResult.maxPoint,
                        item.MAX_POINT
                      ).map((value, idx) => (
                        <td
                          key={`${item.SEQ_NO}-${value}-${idx}`}
                          className={`score-cell
                            ${
                              Math.floor(
                                nsrResult.selectedCells[item.SEQ_NO]
                              ) === value
                                ? "selected"
                                : ""
                            } 
                            ${
                              value === 0.5 &&
                              nsrResult.selectedCells[item.SEQ_NO] % 1 === 0.5
                                ? "selected"
                                : ""
                            }`}
                          onClick={() =>
                            handleCellClick(
                              item.SEQ_NO,
                              value,
                              nsrResult.selectedCells
                            )
                          }
                        >
                          {value}
                        </td>
                      ))}
                    </td>
                    {nsrResult.categories.length !== 1 && index === 0 && (
                      <td rowSpan={rowSpan} className="category">
                        {categoryItems.reduce(
                          (acc, cur) =>
                            acc +
                            (nsrResult.selectedCells[Number(cur.SEQ_NO)] || 0),
                          0
                        )}
                        점
                      </td>
                    )}
                    {nsrResult.categories.length === 1 && (
                      <>
                        <td></td>
                        <td className="score-sans">
                          {nsrResult.selectedCells[item.SEQ_NO] || 0}점
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })}
            </td>
          </tr>

          <tr className="total-row">
            <td colSpan={11}>
              평점 합계: {calculateTotal(nsrResult.selectedCells)}
              {nsrResult.isSave === 1 && " (저장됨)"}
              {nsrResult.isSave === 0 && " (저장되지 않음)"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;
