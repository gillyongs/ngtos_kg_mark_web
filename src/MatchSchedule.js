import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "./MatchSchedule.css"; // Import the MatchSchedule.css file for styling
import BackBar from "./component/BackBar";
import { toNmState, refreeNameState } from "./util/recoild"; // Ensure this path is correct
import { decryptText } from "./util/encryptionUtils";
import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";

function MatchSchedule() {
  const { api, to_cd, phone_number } = useParams();
  const [scheduleData, setScheduleData] = useState([]);
  const refreeName = useRecoilValue(refreeNameState);
  const toNm = useRecoilValue(toNmState);

  useEffect(() => {
    //match_schedule 테이블에서 해당 대회(to_cd)의 경기 일정 목록을 불러온다
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${api}:4000/get-matchschedule/${to_cd}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error("Error fetching match schedule data:", error);
      }
    };

    fetchData();
  }, [to_cd, api]); // 파라미터 받아와 쿼리 요청 보내 데이터 받아옴

  const fetchJidAndRefreeDataOnClick = async (detailClassCd, rhCd) => {
    // 경기 일정 클릭시 현재 로그인한 심판이 해당 경기 심판이 맞는제 체크
    try {
      const checkJidResponse = await fetch(
        `http://${api}:4000/check-jid?phoneNumber=${decryptText(
          phone_number
        )}&to_cd=${to_cd}&detail_class_cd=${detailClassCd}&rh_cd=${rhCd}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const checkJidData = await checkJidResponse.json();
      if (!checkJidData.jidMatch) {
        alert("해당 경기에 심판으로 등록되어 있지 않습니다");
      } else {
        const refreeNumber = checkJidData.refreeNumber;
        const nextLink = `/${api}/${to_cd}/${phone_number}/${detailClassCd}/${rhCd}/${refreeNumber}/${parseInt(
          refreeNumber / 2
        )}`;
        window.location.href = nextLink;
        //해당 경기의 출전 선수/팀 목록 화면으로 이동 (player.js)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTableItemClick = (detailClassCd, rhCd) => {
    fetchJidAndRefreeDataOnClick(detailClassCd, rhCd);
  };

  const individualMatches = scheduleData.filter(
    // 개인전 = detail_class_cd 가 홀수
    (schedule) => schedule.DETAIL_CLASS_CD % 2 !== 0
  );
  const teamMatches = scheduleData.filter(
    // 단체전 = detail_class_cd 가 짝수
    (schedule) => schedule.DETAIL_CLASS_CD % 2 === 0
  );

  return (
    <>
      <BackBar
        url={`/${api}/${to_cd}/login`}
        text={`로그인: ${refreeName}님`}
      />
      <div className="match-schedule-container">
        <h1 class="responsive-title">
          {toNm} <br></br>경기 일정
        </h1>
        <table className="match-schedule-table">
          <tbody>
            {/* 개인전*/}
            {individualMatches.length > 0 && ( //개인전이 존재하면 출력
              <>
                <tr className="bold-text">
                  <td colSpan="2">개인전</td>
                </tr>

                <tr className="bold-text">
                  <th>종별</th>
                  <th>경기</th>
                </tr>
                {Object.values(
                  individualMatches.reduce((acc, schedule) => {
                    // kind_cd를 키로 사용하여 그룹화
                    if (!acc[schedule.KIND_CD]) {
                      acc[schedule.KIND_CD] = [];
                    }
                    acc[schedule.KIND_CD].push(schedule);
                    return acc;
                  }, {})
                ).map((schedules) => {
                  const kindCd = schedules[0].KIND_CD;
                  return schedules.map((schedule, index) => (
                    <tr
                      key={schedule.someUniqueKey}
                      onClick={() =>
                        handleTableItemClick(
                          schedule.DETAIL_CLASS_CD,
                          schedule.RH_CD
                        )
                      }
                    >
                      {/* 첫 번째 항목에 대해서만 kind_cd를 출력 */}
                      {/* 어르신부 - 예선 1조, 2조, 3조가 있으면 어르신부를 가로 3칸으로 출력 */}
                      {index === 0 ? (
                        <td rowSpan={schedules.length}>
                          {/*rowSpan을 늘리면 가로 칸이 늘어난다*/}
                          {getKindDescription(kindCd)}
                        </td>
                      ) : null}
                      <td>{getRoundDescription(schedule.RH_CD)}</td>
                    </tr>
                  ));
                })}
              </>
            )}

            <br />

            {/* 단체전 */}
            {teamMatches.length > 0 && (
              <>
                <tr className="bold-text">
                  <td colSpan="3">단체전</td>
                </tr>
                <tr className="bold-text">
                  <th>종별</th>
                  <th>경기</th>
                  {/* <th>날짜</th> */}
                </tr>
                {teamMatches.map((schedule) => (
                  <tr
                    key={schedule.someUniqueKey}
                    onClick={() =>
                      handleTableItemClick(
                        schedule.DETAIL_CLASS_CD,
                        schedule.RH_CD
                      )
                    }
                  >
                    <td>{getKindDescription(schedule.KIND_CD)}</td>
                    <td>{getRoundDescription(schedule.RH_CD)}</td>
                    {/* <td>{schedule.GM_SDT}</td> */}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MatchSchedule;

const defaultScheduleData = [
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "1", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "2", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "3", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "4", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89201, KIND_CD: "2", RH_CD: "1", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89201, KIND_CD: "2", RH_CD: "2", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89102, KIND_CD: "1", RH_CD: "1", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89202, KIND_CD: "2", RH_CD: "1", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89302, KIND_CD: "3", RH_CD: "1", someUniqueKey: "1" },
  { DETAIL_CLASS_CD: 89402, KIND_CD: "4", RH_CD: "1", someUniqueKey: "1" },
  // 개인전1 단체전2     어르신부1일반부2    예선1조
];
