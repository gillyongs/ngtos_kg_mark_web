import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { playerDataState, refreeNameState } from "./util/recoild";
import useOrientation from "./util/useOrientation"; // 화면 너비 판단
import "./NsrResult.css";

import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";
import { saveNsrResultPlayerCnt } from "./util/saveHandlers";

import { fetchNsrResult } from "./util/fetchNsrResult";
import { fetchPlayerCnt } from "./util/fetchPlayerCnt";

import TableContainer from "./component/TableContainer";
import TeamCountInput from "./component/TeamCountInput";
import FinalButton from "./component/FinalButton";
import BackBar from "./component/BackBar";

function NsrResult() {
  const { api, to_cd, phone_number, detail_class_cd, rh_cd, category, index } =
    useParams();
  const kind_cd = Math.floor((detail_class_cd % 1000) / 100);
  const refree = "1"; // 심판번호 1로 고정.

  //category 값이 각각 1,2,3인 params 객체 3개 생성
  const [params, setParams] = useState({
    api: api,
    to_cd: to_cd,
    phone_number: phone_number,
    detail_class_cd: detail_class_cd,
    rh_cd: rh_cd,
    refree: refree,
    category: "1",
    index: index,
    kind_cd: Math.floor((detail_class_cd % 1000) / 100),
  });
  const [params2, setParams2] = useState({
    api: api,
    to_cd: to_cd,
    phone_number: phone_number,
    detail_class_cd: detail_class_cd,
    rh_cd: rh_cd,
    refree: refree,
    category: "2",
    index: index,
    kind_cd: Math.floor((detail_class_cd % 1000) / 100),
  });
  const [params3, setParams3] = useState({
    api: api,
    to_cd: to_cd,
    phone_number: phone_number,
    detail_class_cd: detail_class_cd,
    rh_cd: rh_cd,
    refree: refree,
    category: "3",
    index: index,
    kind_cd: Math.floor((detail_class_cd % 1000) / 100),
  });

  useEffect(() => {
    setParams((prevState) => ({
      ...prevState,
      api: api,
      to_cd: to_cd,
      phone_number: phone_number,
      detail_class_cd: detail_class_cd,
      rh_cd: rh_cd,
      refree: refree,
      category: "1",
      index: index,
      kind_cd: Math.floor((detail_class_cd % 1000) / 100),
    }));
    setParams2((prevState) => ({
      ...prevState,
      api: api,
      to_cd: to_cd,
      phone_number: phone_number,
      detail_class_cd: detail_class_cd,
      rh_cd: rh_cd,
      refree: refree,
      category: "2",
      index: index,
      kind_cd: Math.floor((detail_class_cd % 1000) / 100),
    }));
    setParams3((prevState) => ({
      ...prevState,
      api: api,
      to_cd: to_cd,
      phone_number: phone_number,
      detail_class_cd: detail_class_cd,
      rh_cd: rh_cd,
      refree: refree,
      category: "3",
      index: index,
      kind_cd: Math.floor((detail_class_cd % 1000) / 100),
    }));
  }, [
    api,
    to_cd,
    phone_number,
    detail_class_cd,
    rh_cd,
    refree,
    category,
    index,
  ]);

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

    const nextIndex = index < playersData.length - 1 ? Number(index) + 1 : null;
    if (nextIndex !== null) {
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

  // 각 카테고리별 채점결과 객체
  const [nsrResult, setNsrResult] = useState({
    markBaseId: -7, // 채점표 ID
    markData: [], // 채점표 내용
    selectedCells: {}, // 채점표에서 현재 선택중인 셀 = 각 세부점수
    allPoint: -7, // 채점표 최고점 (40점) -> 32/40점 출력에 사용
    maxPoint: -7, // 채점 항목별 최고점 (6점) -> 1 2 3 4 5 6 점수판 만드는데 사용
    categories: [], // 채점표 그릴때 안법, 보법 등 하나의 카테고리로 묶을때 사용하는 리스트
    maxCount: -7, // 채점표 문항 개수중 최대값 (12/5/6) -> 12 (모든 항목이 채점됐는지 확인하는데 사용)
    isSave: -7, // 해당 채점표 저장 여부
  });
  const [nsrResult2, setNsrResult2] = useState({
    markBaseId: -7, // 채점표 ID
    markData: [], // 채점표 내용
    selectedCells: {}, // 채점표에서 현재 선택중인 셀 = 각 세부점수
    allPoint: -7, // 채점표 최고점 (40점) -> 32/40점 출력에 사용
    maxPoint: -7, // 채점 항목별 최고점 (6점) -> 1 2 3 4 5 6 점수판 만드는데 사용
    categories: [], // 채점표 그릴때 안법, 보법 등 하나의 카테고리로 묶을때 사용하는 리스트
    maxCount: -7, // 채점표 문항 개수중 최대값 (12/5/6) -> 12 (모든 항목이 채점됐는지 확인하는데 사용)
    isSave: -7, // 해당 채점표 저장 여부
  });
  const [nsrResult3, setNsrResult3] = useState({
    markBaseId: -7, // 채점표 ID
    markData: [], // 채점표 내용
    selectedCells: {}, // 채점표에서 현재 선택중인 셀 = 각 세부점수
    allPoint: -7, // 채점표 최고점 (40점) -> 32/40점 출력에 사용
    maxPoint: -7, // 채점 항목별 최고점 (6점) -> 1 2 3 4 5 6 점수판 만드는데 사용
    categories: [], // 채점표 그릴때 안법, 보법 등 하나의 카테고리로 묶을때 사용하는 리스트
    maxCount: -7, // 채점표 문항 개수중 최대값 (12/5/6) -> 12 (모든 항목이 채점됐는지 확인하는데 사용)
    isSave: -7, // 해당 채점표 저장 여부
  });

  //fetchNsrResult
  //params 1,2,3 값을 기반으로 nsrresult_mark에 저장되어있던 값들을 가져와
  //nsrresult 1,2,3에 넣는다
  useEffect(() => {
    if (playerData.entrantTeamId === -7) return;
    fetchNsrResult({
      params: params,
      entrant_team_id: playerData.entrantTeamId,
      setNsrResult: setNsrResult,
    });
    fetchNsrResult({
      params: params2,
      entrant_team_id: playerData.entrantTeamId,
      setNsrResult: setNsrResult2,
    });
    fetchNsrResult({
      params: params3,
      entrant_team_id: playerData.entrantTeamId,
      setNsrResult: setNsrResult3,
    });
  }, [params, playerData]);

  const [teamCount, setTeamCount] = useState(0); // 심판이 직접 센 팀 인원수

  useEffect(() => {
    if (playerData.entrantTeamId === -7) return;
    if (detail_class_cd === -7 || detail_class_cd % 2 !== 0) return; //단체전에서만 사용;
    fetchPlayerCnt({
      params,
      playerData,
      setTeamCount,
    });
  }, [params, playerData]);

  useEffect(() => {
    if (teamCount > 999) return;
    if (teamCount === 0) return;
    if (teamCount < 0) return;
    if (teamCount === null) return;
    if (isNaN(teamCount)) return;

    saveNsrResultPlayerCnt({
      params,
      playerData,
      teamCount,
    });
  }, [teamCount]);

  const refreeName = useRecoilValue(refreeNameState);
  const backBar = {
    url: `/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${rh_cd}/${refree}/${category}`,
    text: `${refreeName} 심판 // ${getKindDescription(
      kind_cd
    )} ${getRoundDescription(rh_cd)}`,
  };

  // 인원수와 각각의 채점 상태를 총괄하여 최종 저장 여부를 나타내는 state
  const [isSaveFinal, setIsSaveFinal] = useState(false);
  useEffect(() => {
    setIsSaveFinal(true);
    if (nsrResult.isSave !== 1) {
      setIsSaveFinal(false);
    }
    if (nsrResult2.isSave !== 1) {
      setIsSaveFinal(false);
    }
    if (nsrResult3.isSave !== 1) {
      setIsSaveFinal(false);
    }
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      setIsSaveFinal(false);
    }
  }, [nsrResult.isSave, nsrResult2.isSave, nsrResult3.isSave, teamCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerData, params]);

  const countValidScores = (selectedCells) => {
    return Object.values(selectedCells).filter(
      (value) => typeof value === "number" && value > 0
    ).length;
  };

  return (
    <div className="nsr-result-container">
      <BackBar
        url={backBar.url}
        text={backBar.text}
        sentialDigit={!isSaveFinal}
      />
      <h1>{playerData.korNm}</h1>

      {/*인원수 체크 영역. 단체전에서만 나옴 */}
      {detail_class_cd % 2 === 0 && (
        <div>
          <TeamCountInput teamCount={teamCount} setTeamCount={setTeamCount} />
        </div>
      )}
      <TableContainer
        nsrResult={nsrResult}
        category={1}
        setNsrResult={setNsrResult}
        params={params}
        playerData={playerData}
      />
      <TableContainer
        nsrResult={nsrResult2}
        category={2}
        setNsrResult={setNsrResult2}
        params={params2}
        playerData={playerData}
      />
      <TableContainer
        nsrResult={nsrResult3}
        category={3}
        setNsrResult={setNsrResult3}
        params={params3}
        playerData={playerData}
      />
      <table>
        <tbody>
          <FinalButton
            selectedCells={
              countValidScores(nsrResult.selectedCells) +
              countValidScores(nsrResult2.selectedCells) +
              countValidScores(nsrResult3.selectedCells)
            }
            nextPlayerData={nextPlayerData}
            teamCount={teamCount}
            params={params}
            isSaveFinal={isSaveFinal}
            maxCount={
              nsrResult.maxCount + nsrResult2.maxCount + nsrResult3.maxCount
            }
          />
        </tbody>
      </table>
    </div>
  );
}

export default NsrResult;
