import React from "react";
import { useNavigate } from "react-router-dom";
import { getRoundDescription } from "../util/getRoundDescription";

const ScoreButtonRow = ({ selectedCells, nextPlayerData, teamCount, params, isSaveFinal, maxCount, totalScore, keyboardState, end, setEnd, yn1, yn2 }) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree, category, index } = params;
  const navigate = useNavigate();

  const handleMaxCheck = (nextLink) => {
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      window.confirm("인원수가 입력되지 않았습니다.");
      return false;
    }
    if (selectedCells !== maxCount) {
      window.confirm("채점하지 않거나 0점인 항목이 존재합니다.");
      return false;
    }

    if (refree === "0" && yn1 !== true && yn1 !== false) {
      window.confirm("표준시간이 확인되지 않았습니다.");
      return false;
    }
    if (refree === "0" && yn2 !== true && yn2 !== false) {
      window.confirm("대회복장이 확인되지 않았습니다.");
      return false;
    }

    if (nextLink) {
      const confirmResult = window.confirm(`다음 ${parseInt(detail_class_cd) % 2 === 0 ? "팀" : "선수"}으로 넘어가시겠습니까?`);
      if (confirmResult) {
        navigate(nextLink);
      }
    }

    return true;
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td style={{ fontSize: "30px" }}>총점 {totalScore} / 100</td>
          </tr>

          <tr className="button-row">
            <td colSpan={2} className="button-container1">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}>
                {/* 좌측: 채점 항목 */}
                {end === false || end === null ? (
                  <span
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "30px",
                    }}>
                    채점 항목 ({selectedCells}/{maxCount})
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      const valid = handleMaxCheck(); // ✅ 1차 조건 검증
                      if (!valid) return;

                      const confirmResult = window.confirm("채점완료를 해제하시겠습니까?");
                      if (confirmResult) {
                        localStorage.setItem(`end/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, false);
                        setEnd(false);
                      }
                    }}
                    className="nav-button"
                    style={{
                      flex: "1",
                      textAlign: "center",
                      backgroundColor: isSaveFinal === true ? "green" : "gray",
                      color: "white",
                      fontSize: "30px",
                    }}>
                    <div>채점 완료 해제</div>
                  </button>
                )}

                {/* 우측: 버튼 조건 */}
                {end === false || end === null ? (
                  <button
                    onClick={() => {
                      const valid = handleMaxCheck(); // ✅ 1차 조건 검증
                      if (!valid) return;

                      const confirmResult = window.confirm("채점을 완료하시겠습니까?");
                      if (confirmResult) {
                        localStorage.setItem(`end/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, true);
                        setEnd(true);
                      }
                    }}
                    className="nav-button"
                    style={{
                      flex: "1",
                      textAlign: "center",
                      backgroundColor: isSaveFinal === true ? "green" : "gray",
                      color: "white",
                      fontSize: "30px",
                    }}>
                    <div>채점 완료</div>
                  </button>
                ) : (
                  <button
                    onClick={() => handleMaxCheck(nextPlayerData.link)}
                    className="nav-button"
                    style={{
                      flex: "1",
                      textAlign: "center",
                      backgroundColor: isSaveFinal === true ? "green" : "gray",
                      color: "white",
                      fontSize: "30px",
                    }}>
                    다음 {parseInt(detail_class_cd) % 2 === 0 ? "팀" : "선수"} ({nextPlayerData.name}팀 / {getRoundDescription(nextPlayerData.rh_cd)})
                  </button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        className="score-wrapper"
        style={{
          paddingBottom: keyboardState.show ? "250px" : "0px", // 키보드 높이만큼
          transition: "padding 0.3s ease",
        }}></div>
    </>
  );
};

export default ScoreButtonRow;
