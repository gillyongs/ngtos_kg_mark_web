import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { playerDataState, refreeNameState } from "./util/recoild";
import useOrientation from "./util/useOrientation"; // 화면 너비 판단
import "./NsrResult.css";

import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";

import TableContainer from "./component/TableContainer";
import TeamCountInput from "./component/TeamCountInput";
import FinalButton from "./component/FinalButton";
import BackBar from "./component/BackBar";

const calculateTotal = (selectedCells) => {
  //선택된 셀들의 총합
  return Object.values(selectedCells).reduce((total, value) => total + (value ? value : 0), 0);
};

function NsrResult() {
  //#region params
  const { api, to_cd, phone_number, detail_class_cd, rh_cd, refree, category, index } = useParams();
  const kind_cd = Math.floor((detail_class_cd % 1000) / 100);

  const [params, setParams] = useState({});
  useEffect(() => {
    setParams((prevState) => ({
      ...prevState,
      api: api,
      to_cd: to_cd,
      phone_number: phone_number,
      detail_class_cd: detail_class_cd,
      rh_cd: rh_cd,
      refree: refree,
      category: category,
      index: index,
      kind_cd: Math.floor((detail_class_cd % 1000) / 100),
    }));
  }, [api, to_cd, phone_number, detail_class_cd, rh_cd, refree, category, index]);
  //#endregion
  //#region playerData
  const playersData = useRecoilValue(playerDataState);
  const [playerData, setPlayerData] = useState({
    korNm: "김한수",
    entrantTeamId: -7,
  });
  const [nextPlayerData, setNextPlayerData] = useState({
    index: index < playerData.length - 1 ? Number(index) + 1 : null,
    link: 0,
    name: "김한수",
    rh_cd: null,
  });
  useEffect(() => {
    setPlayerData((prevState) => ({
      ...prevState,
      korNm: playersData[index].NM,
      entrantTeamId: playersData[index].ID,
    }));

    const nextIndex = index < playersData.length - 1 ? Number(index) + 1 : null; // 다음 요소의 인덱스
    if (nextIndex !== null) {
      // 현재 선수가 마지막 선수가 아니면
      const nextRhcd = playersData[nextIndex].rh_cd;
      setNextPlayerData((prevUser) => ({
        ...prevUser,
        index: nextIndex,
        rh_cd: nextRhcd,
        link: `/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${nextRhcd}/${refree}/${category}/${nextIndex}`,
        name: playersData[nextIndex].NM,
      }));
    }
  }, [playersData, index, category]);
  //#endregion
  //#region nsrResult
  const [nsrResult, setNsrResult] = useState({
    markBaseId: -7, // 채점표 ID
    markData: [], // 채점표 내용
    selectedCells: {}, // 채점표에서 현재 선택중인 셀 = 각 세부점수
    allPoint: -7, // 채점표 최고점 (40점) -> 32/40점 출력에 사용
    maxPoint: -7, // 채점 항목별 최고점 (6점) -> 1 2 3 4 5 6 점수판 만드는데 사용
    categories: [], // 채점표 그릴때 안법, 보법 등 하나의 카테고리로 묶을때 사용하는 리스트
    maxCount: -7, // 채점표 문항 개수중 최대값 (12/5/6) -> 12 (모든 항목이 채점됐는지 확인하는데 사용)
  });

  //public 폴더에 저장되어있는 json 파일에서 채점표를 읽어온다
  useEffect(() => {
    fetch(`/ngtos_kg_mark_web/markTable${category}.json`)
      .then((response) => response.json())
      .then((json) => {
        const savedData = localStorage.getItem(
          // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
          `nsrResult/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
        );
        if (savedData && refree === "1" && countValidScores(JSON.parse(savedData)) === 12) {
          setNsrResult((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
            isSave: 1,
          }));
        } else if (savedData && refree === "2" && countValidScores(JSON.parse(savedData)) === 5) {
          setNsrResult((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
            isSave: 1,
          }));
        } else if (savedData && refree === "3" && countValidScores(JSON.parse(savedData)) === 4) {
          setNsrResult((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
            isSave: 1,
          }));
        } else {
          setNsrResult((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
          }));
        }
      });
  }, [category, detail_class_cd, rh_cd, refree, index]);

  //selectedCell이 수정될때마다 로컬 스토리지에 저장한다
  useEffect(() => {
    if (nsrResult.markBaseId === -7) return;
    if (Object.keys(nsrResult.selectedCells).length === 0) return;
    localStorage.setItem(`nsrResult/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, JSON.stringify(nsrResult.selectedCells)); // localStorage 저장
    localStorage.setItem(`score/${detail_class_cd}/${rh_cd}/${refree}/${category}/${(index % 6) + 1}`, JSON.stringify(calculateTotal(nsrResult.selectedCells)));
  }, [nsrResult.selectedCells]);
  //#endregion
  //#region teamCount
  const [teamCount, setTeamCount] = useState(0); // 심판이 직접 센 팀 인원수
  useEffect(() => {
    const savedData = localStorage.getItem(
      // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
      `teamCount/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
    );
    setTeamCount(Number(savedData));
  }, [category, detail_class_cd, rh_cd, refree, index]);

  useEffect(() => {
    if (teamCount < 1) return;
    localStorage.setItem(`teamCount/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, teamCount); // localStorage 저장
  }, [teamCount]);
  //#endregion
  //#region etc
  const refreeName = useRecoilValue(refreeNameState);
  const backBar = {
    url: `/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${rh_cd}/${refree}/${category}`,
    text: `${refreeName} 심판 // ${getKindDescription(kind_cd)} ${getRoundDescription(rh_cd)}`,
  };

  const [isSaveFinal, setIsSaveFinal] = useState(false); // 인원수와 각각의 채점 상태를 총괄하여 최종 저장 여부를 나타내는 state
  useEffect(() => {
    setIsSaveFinal(true);
    if (nsrResult.maxCount === -7) return;
    if (nsrResult.maxCount !== countValidScores(nsrResult.selectedCells)) {
      setIsSaveFinal(false);
    }
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      setIsSaveFinal(false);
    }
  }, [nsrResult, teamCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerData, params]);

  const countValidScores = (selectedCells) => {
    return Object.values(selectedCells).filter((value) => typeof value === "number" && value > 0).length;
  };

  const [keyboardState, setKeyboardState] = useState({
    show: false,
    category: null,
    index: null,
    targetId: null,
    value: "",
    state: null,
  });
  //#endregion
  return (
    <div className="nsr-result-container" onClick={() => setKeyboardState((prev) => ({ ...prev, show: false, category: null, index: null }))}>
      <BackBar url={backBar.url} text={backBar.text} sentialDigit={!isSaveFinal} />
      <h1>{playerData.korNm}</h1>

      {/*인원수 체크 영역. 단체전에서만 나옴 */}
      {detail_class_cd % 2 === 0 && (
        <div>
          <TeamCountInput teamCount={teamCount} setTeamCount={setTeamCount} />
        </div>
      )}
      <TableContainer nsrResult={nsrResult} category={category} setNsrResult={setNsrResult} params={params} playerData={playerData} />
      <table>
        <tbody>
          <FinalButton selectedCells={countValidScores(nsrResult.selectedCells)} nextPlayerData={nextPlayerData} teamCount={teamCount} params={params} isSaveFinal={isSaveFinal} maxCount={nsrResult.maxCount} />
        </tbody>
      </table>
    </div>
  );
}

export default NsrResult;
