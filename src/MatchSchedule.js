import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "./MatchSchedule.css"; // Import the MatchSchedule.css file for styling
import BackBar from "./component/BackBar";
import { toNmState, refreeNameState } from "./util/recoild"; // Ensure this path is correct
import { decryptText } from "./util/encryptionUtils";
import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";
import { useNavigate } from "react-router-dom";

function MatchSchedule() {
  const { api, to_cd, phone_number } = useParams();
  const scheduleData = defaultScheduleData;
  const refreeName = useRecoilValue(refreeNameState);
  const toNm = useRecoilValue(toNmState);
  const setToNmName = useSetRecoilState(toNmState); // 심판명을 recoil에 저장하여 전역변수처럼 사용
  setToNmName("테스트 대회");
  const navigate = useNavigate();

  const handleTableItemClick = (detailClassCd, rhCd) => {
    const refreeNumber = phone_number;
    const nextLink = `/${api}/${to_cd}/${phone_number}/${detailClassCd}/${rhCd}/${refreeNumber}/${refreeNumber}
    `;
    navigate(nextLink);
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
      {" "}
      <BackBar url={`/${api}/${to_cd}/login`} text={`로그인: ${refreeName}님`} />
      <div className="match-ui-v3">
        {individualMatches.length > 0 && (
          <>
            <h2 className="match-v3-title"> 개인전</h2>
            <div className="match-v3-card-container">
              {Object.entries(
                individualMatches.reduce((acc, cur) => {
                  const key = getKindDescription(cur.KIND_CD);
                  acc[key] = acc[key] || [];
                  acc[key].push(cur);
                  return acc;
                }, {})
              ).map(([kindName, schedules]) => (
                <div className="match-v3-card" key={kindName}>
                  <div className="match-v3-header">{kindName}</div>
                  <ul className="match-v3-list">
                    {schedules.map((schedule) => (
                      <li key={schedule.someUniqueKey} onClick={() => handleTableItemClick(schedule.DETAIL_CLASS_CD, schedule.RH_CD)}>
                        {getRoundDescription(schedule.RH_CD)}
                        <span className="go-btn">→</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {teamMatches.length > 0 && (
          <>
            <h2 className="match-v3-title"> 단체전</h2>
            <div className="match-v3-card-container">
              {Object.entries(
                teamMatches.reduce((acc, cur) => {
                  const key = getKindDescription(cur.KIND_CD);
                  acc[key] = acc[key] || [];
                  acc[key].push(cur);
                  return acc;
                }, {})
              ).map(([kindName, schedules]) => (
                <div className="match-v3-card" key={kindName}>
                  <div className="match-v3-header">{kindName}</div>
                  <ul className="match-v3-list">
                    {schedules.map((schedule) => (
                      <li key={schedule.someUniqueKey} onClick={() => handleTableItemClick(schedule.DETAIL_CLASS_CD, schedule.RH_CD)}>
                        {getRoundDescription(schedule.RH_CD)}
                        <span className="go-btn">→</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
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
