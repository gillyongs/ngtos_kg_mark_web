import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRoundDescription } from "../util/getRoundDescription";

const ScoreButtonRow = ({ setTeamCount, selectedCells, nextPlayerData, teamCount, params, isSaveFinal, maxCount, totalScore }) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree, category } = params;
  const navigate = useNavigate();
  const holdIntervalRef = useRef(null);

  const handleMaxCheck = (nextLink) => {
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      window.confirm("인원수가 입력되지 않았습니다.");
      return;
    }
    if (selectedCells !== maxCount) {
      window.confirm("채점하지 않은 항목이 존재합니다.");
      return;
    }

    if (nextLink) {
      navigate(nextLink);
    }
  };

  const startHold = (operation) => {
    holdIntervalRef.current = setInterval(() => {
      setTeamCount((prev) => {
        const safe = isNaN(prev) || prev === null ? 0 : prev;
        return operation(safe);
      });
    }, 100);
  };

  const stopHold = () => clearInterval(holdIntervalRef.current);

  return (
    <table>
      <tbody>
        <tr>
          <td colSpan={1} style={{ fontSize: "30px", verticalAlign: "middle" }}>
            총점 {totalScore} / 100
          </td>

          {/* 팀 인원수 라벨 + input 수직 정렬 */}
          <td style={{ padding: "0px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px" }}>팀 인원수</label>
              <input
                type="number"
                value={teamCount}
                onChange={(e) => setTeamCount(parseInt(e.target.value))}
                onKeyPress={(e) => {
                  if (isNaN(parseInt(e.key))) {
                    e.preventDefault();
                  }
                }}
                style={{
                  width: "80px",
                  height: "40px", // 정사각형 input
                  textAlign: "center",
                  fontSize: "16px",
                }}
              />
            </div>
          </td>

          {/* +1 버튼 */}
          <td style={{ padding: "0px" }}>
            <button
              onMouseDown={() => startHold((v) => v + 1)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => startHold((v) => v + 1)}
              onTouchEnd={stopHold}
              onTouchCancel={stopHold}
              onClick={() => setTeamCount((prev) => (isNaN(prev) || prev === null ? 0 : prev) + 1)}
              style={{
                width: "80%",
                height: "60px",
                fontSize: "18px",
                cursor: "pointer",
                userSelect: "none", // ← 텍스트 선택 비활성화!
              }}>
              +1
            </button>
          </td>

          <td style={{ padding: "0px" }}>
            <button
              onMouseDown={() => startHold((v) => Math.max(0, v - 1))}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => startHold((v) => Math.max(0, v - 1))}
              onTouchEnd={stopHold}
              onTouchCancel={stopHold}
              onClick={() => setTeamCount((prev) => Math.max(0, (isNaN(prev) || prev === null ? 0 : prev) - 1))}
              style={{
                width: "80%",
                height: "60px",
                fontSize: "18px",
                cursor: "pointer",
                userSelect: "none", // ← 텍스트 선택 비활성화!
              }}>
              -1
            </button>
          </td>
        </tr>

        <tr className="button-row">
          <td colSpan={7}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}>
              {/* 좌측: 채점 항목 */}
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

              {/* 우측: 버튼 */}
              {nextPlayerData.index !== null &&
              (rh_cd === nextPlayerData.rh_cd || // 같은 라운드의 선수거나
                nextPlayerData.rh_cd !== "899000") ? ( // 예선 1조에서 2조로 넘어가거나 (899000은 결승전)
                <button
                  onClick={handleMaxCheck.bind(null, nextPlayerData.link)}
                  className="nav-button"
                  style={{
                    flex: "1",
                    textAlign: "center",
                    backgroundColor: isSaveFinal === true ? "green" : "gray",
                    color: "white",
                  }}>
                  <div>다음 {parseInt(detail_class_cd) % 2 === 0 ? "팀" : "선수"}</div>
                  {nextPlayerData.name} ({getRoundDescription(nextPlayerData.rh_cd)})
                </button>
              ) : (
                <button
                  className="nav-button"
                  style={{
                    flex: "1",
                    textAlign: "center",
                    backgroundColor: isSaveFinal === true ? "green" : "gray",
                    color: "white",
                  }}>
                  <div>채점이 끝났습니다.</div>
                  수고하셨습니다.
                </button>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ScoreButtonRow;
