import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRoundDescription } from "../util/getRoundDescription";

const ScoreButtonRow = ({ setTeamCount, selectedCells, nextPlayerData, teamCount, params, isSaveFinal, maxCount, totalScore, end }) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree, category } = params;
  const navigate = useNavigate();
  const holdIntervalRef = useRef(null);

  const handleMaxCheck = (nextLink) => {
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      window.confirm("인원수가 입력되지 않았습니다.");
      return;
    }
    if (selectedCells !== maxCount) {
      window.confirm("채점하지 않거나 0점인 항목이 존재합니다.");
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
  const inputRef = useRef(null);

  const handleTdClick = () => {
    inputRef.current?.focus();
  };
  return (
    <table>
      <tbody>
        <tr>
          <td>팀 인원수</td>

          <td
            onClick={handleTdClick}
            style={{
              cursor: "pointer",
              padding: "8px",
              textAlign: "center",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // 좌우 정렬도 정중앙
                gap: "8px", // input과 "명" 사이 간격
              }}>
              <input
                ref={inputRef}
                type="number"
                value={teamCount}
                onChange={(e) => {
                  if (end) return;
                  setTeamCount(parseInt(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (end || isNaN(parseInt(e.key))) {
                    e.preventDefault();
                  }
                }}
                onClick={(e) => {
                  if (end) return;
                  e.stopPropagation();
                }}
                disabled={end}
                style={{
                  width: "10vw",
                  height: "8vw",
                  textAlign: "center",
                  fontSize: "45px",
                }}
              />

              <span
                style={{
                  fontSize: "30px",
                  lineHeight: 1,
                }}>
                명
              </span>
            </div>
          </td>

          {/* +1 버튼 */}
          <td style={{ padding: "0px" }}>
            <button
              disabled={end}
              onMouseDown={() => {
                if (end) return;
                startHold((v) => v + 1);
              }}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => {
                if (end) return;
                startHold((v) => v + 1);
              }}
              onTouchEnd={stopHold}
              onTouchCancel={stopHold}
              onClick={() => {
                if (end) return;
                setTeamCount((prev) => (isNaN(prev) || prev === null ? 0 : prev) + 1);
              }}
              style={{
                width: "80%",
                height: "60px",
                fontSize: "18px",
                cursor: "pointer",
                userSelect: "none",
              }}>
              +1
            </button>
          </td>

          <td style={{ padding: "0px" }}>
            <button
              disabled={end}
              onMouseDown={() => {
                if (end) return;
                startHold((v) => Math.max(0, v - 1));
              }}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => {
                if (end) return;
                startHold((v) => Math.max(0, v - 1));
              }}
              onTouchEnd={stopHold}
              onTouchCancel={stopHold}
              onClick={() => {
                if (end) return;
                setTeamCount((prev) => Math.max(0, (isNaN(prev) || prev === null ? 0 : prev) - 1));
              }}
              style={{
                width: "80%",
                height: "60px",
                fontSize: "18px",
                cursor: "pointer",
                userSelect: "none",
              }}>
              -1
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ScoreButtonRow;
