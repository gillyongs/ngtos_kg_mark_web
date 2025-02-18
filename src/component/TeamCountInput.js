import React from "react";

const TeamCountInput = ({ teamCount, setTeamCount }) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>팀 인원수</td>
            <td>
              <input
                type="number"
                value={teamCount}
                onChange={(e) => setTeamCount(parseInt(e.target.value))}
                onKeyPress={(e) => {
                  if (isNaN(parseInt(e.key))) {
                    e.preventDefault();
                  }
                }}
                className="input-field"
              />
            </td>
            <td>
              <button
                onClick={() =>
                  setTeamCount(
                    (prev) => (isNaN(prev) || prev === null ? 0 : prev) + 1
                  )
                }
              >
                +1
              </button>
            </td>
            <td>
              <button
                onClick={() =>
                  setTeamCount((prev) =>
                    Math.max(0, (isNaN(prev) || prev === null ? 0 : prev) - 1)
                  )
                }
              >
                -1
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="empty_space"></div>
    </div>
  );
};

export default TeamCountInput;
