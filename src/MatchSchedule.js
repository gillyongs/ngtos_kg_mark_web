import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "./MatchSchedule.css"; // Import the MatchSchedule.css file for styling
import BackBar from "./component/BackBar";
import { toNmState, refreeNameState } from "./util/recoild"; // Ensure this path is correct
import { decryptText } from "./util/encryptionUtils";
import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";

function MatchSchedule() {
  const { api, to_cd, phone_number } = useParams();
  const scheduleData = defaultScheduleData;
  const refreeName = useRecoilValue(refreeNameState);
  const toNm = useRecoilValue(toNmState);
  const setToNmName = useSetRecoilState(toNmState); // 심판명을 recoil에 저장하여 전역변수처럼 사용
  setToNmName("테스트 대회");

  const handleTableItemClick = (detailClassCd, rhCd) => {
    const refreeNumber = phone_number;
    const nextLink = `/${api}/${to_cd}/${phone_number}/${detailClassCd}/${rhCd}/${refreeNumber}/${refreeNumber}
    `;
    window.location.href = nextLink;
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
                      {index === 0 ? (
                        <td rowSpan={schedules.length}>
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

            {teamMatches.length > 0 && (
              <>
                <tr className="bold-text">
                  <td colSpan="2">단체전</td>
                </tr>
                {Object.values(
                  teamMatches.reduce((acc, schedule) => {
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
                      {index === 0 ? (
                        <td rowSpan={schedules.length}>
                          {getKindDescription(kindCd)}
                        </td>
                      ) : null}
                      <td>{getRoundDescription(schedule.RH_CD)}</td>
                    </tr>
                  ));
                })}
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
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "1", someUniqueKey: "1" }, // 어르신부 예선 1조
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "2", someUniqueKey: "1" }, // 어르신부 예선 2조
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "3", someUniqueKey: "1" }, // 어르신부 예선 3조
  { DETAIL_CLASS_CD: 89101, KIND_CD: "1", RH_CD: "899000", someUniqueKey: "1" }, //어르신부 결승
  { DETAIL_CLASS_CD: 89201, KIND_CD: "2", RH_CD: "1", someUniqueKey: "1" }, //일반부 예선 1조
  { DETAIL_CLASS_CD: 89201, KIND_CD: "2", RH_CD: "2", someUniqueKey: "1" }, //일반부 예선 2조
  { DETAIL_CLASS_CD: 89201, KIND_CD: "2", RH_CD: "899000", someUniqueKey: "1" }, //일반부 결승

  { DETAIL_CLASS_CD: 89102, KIND_CD: "1", RH_CD: "1", someUniqueKey: "1" }, // 어르신부 예선 1조
  { DETAIL_CLASS_CD: 89102, KIND_CD: "1", RH_CD: "2", someUniqueKey: "1" }, // 어르신부 예선 2조
  { DETAIL_CLASS_CD: 89102, KIND_CD: "1", RH_CD: "899000", someUniqueKey: "1" }, // 어르신부 결승
  { DETAIL_CLASS_CD: 89202, KIND_CD: "2", RH_CD: "899000", someUniqueKey: "1" }, // 일반부 결승
  { DETAIL_CLASS_CD: 89302, KIND_CD: "3", RH_CD: "899000", someUniqueKey: "1" }, // 18세이하부 결승
  { DETAIL_CLASS_CD: 89402, KIND_CD: "4", RH_CD: "899000", someUniqueKey: "1" }, // 3세대부 결승
  // 개인전1 단체전2
];
