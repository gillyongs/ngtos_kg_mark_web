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
  //파리미터 값 가져오기
  const {
    api, //쿼리 보낼 주소. pc에선 localhost, 핸드폰으로 접속했을땐 pc의 ip주소
    to_cd, // 대회 식별 코드
    phone_number, // tour_refree 테이블의 MOBILE_NO 컬럼값. 암호화된 심사위원 핸드폰번호. 로그인에 사용
    detail_class_cd, // 세부종목 (89202 = 89 2 02 = 국학기공 일반부 단체전) -> 가운데 2 는 kind_cd (일반부 어르신부 etc)
    rh_cd, // 라운드. 예선 or 결승
    refree, // 심사위원장(1), 기술위원(2,3) 예술위원(4,5) 완성위원(6,7)
    category, // 기술성(1), 예술성(2), 완성도(3) -- 심사위원장 제외 refree값을 2로 나눈 값
    index, // n번째 선수 or 팀. 주로 playerData와 같이 사용.
  } = useParams();
  const kind_cd = Math.floor((detail_class_cd % 1000) / 100);

  // 파라미터 객체화
  // 다른 컴포넌트에 간단하게 넘겨주기 위해 사용
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

  //recoil에서 가져온, 해당 예선전 혹은 결승전에 참여하는 선수들 목록(playersData)와
  //현재 선수 정보 객체 (player's'Data[index] = playerData)
  const playersData = useRecoilValue(playerDataState);
  const [playerData, setPlayerData] = useState({
    korNm: "김한수",
    entrantTeamId: -7,
  });

  //다음 선수에 대한 정보 객체
  //현재 화면에서 다음 선수로 바로 이동하기 위해 사용
  const [nextPlayerData, setNextPlayerData] = useState({
    index: index < playerData.length - 1 ? Number(index) + 1 : null,
    link: 0,
    name: "김한수",
    rh_cd: null,
  });

  // setPlayerData + setNextPlayerData
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

  //fetchNsrResult
  //params 값을 기반으로 nsrresult_mark에 저장되어있던 값들을 가져온다
  useEffect(() => {
    if (playerData.entrantTeamId === -7) return;
    fetchNsrResult({
      params,
      entrant_team_id: playerData.entrantTeamId,
      setNsrResult,
    });
  }, [params, playerData]);

  const [teamCount, setTeamCount] = useState(0); // 심판이 직접 센 팀 인원수

  //fetchPlayerCnt
  useEffect(() => {
    if (playerData.entrantTeamId === -7) return;
    if (detail_class_cd === -7 || detail_class_cd % 2 !== 0) return; //단채전에서만 사용;
    fetchPlayerCnt({
      params,
      playerData,
      setTeamCount,
    });
  }, [params, playerData]);

  //saveNsrResultPlyaerCnt
  //teamCount 값이 바뀔때마다 db에 저장
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

  const [isSaveFinal, setIsSaveFinal] = useState(false); // 인원수와 각각의 채점 상태를 총괄하여 최종 저장 여부를 나타내는 state
  useEffect(() => {
    setIsSaveFinal(true);
    if (nsrResult.isSave !== 1) {
      setIsSaveFinal(false);
    }
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      setIsSaveFinal(false);
    }
  }, [nsrResult.isSave, teamCount]);

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
        category={category}
        setNsrResult={setNsrResult}
        params={params}
        playerData={playerData}
      />
      <table>
        <tbody>
          <FinalButton
            selectedCells={countValidScores(nsrResult.selectedCells)}
            nextPlayerData={nextPlayerData}
            teamCount={teamCount}
            params={params}
            isSaveFinal={isSaveFinal}
            maxCount={nsrResult.maxCount}
          />
        </tbody>
      </table>
    </div>
  );
}

export default NsrResult;
