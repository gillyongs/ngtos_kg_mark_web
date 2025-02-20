import React from "react";
import { useNavigate } from "react-router-dom";
import { getRoundDescription } from "../util/getRoundDescription";

const ScoreButtonRow = ({
  selectedCells,
  nextPlayerData,
  teamCount,
  params,
  isSaveFinal,
  maxCount,
}) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree, category } =
    params;
  const navigate = useNavigate();

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

  return (
    <table>
      <tbody>
        <tr className="button-row">
          <td colSpan={2} className="button-container1">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* 좌측: 채점 항목 */}
              <span
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "30px",
                }}
              >
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
                  }}
                >
                  <div>
                    다음 {parseInt(detail_class_cd) % 2 === 0 ? "팀" : "선수"}
                  </div>
                  {nextPlayerData.name} (
                  {getRoundDescription(nextPlayerData.rh_cd)})
                </button>
              ) : (
                <button
                  className="nav-button"
                  style={{
                    flex: "1",
                    textAlign: "center",
                    backgroundColor: isSaveFinal === true ? "green" : "gray",
                    color: "white",
                  }}
                >
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
