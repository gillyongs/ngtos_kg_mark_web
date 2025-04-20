import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { playerDataState, refreeNameState } from "./util/recoild";
import useOrientation from "./util/useOrientation"; // 화면 너비 판단
import "./NsrResult.css";

import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";
import { saveNsrResultPlayerCnt, saveNsrResultNew } from "./util/saveHandlers";

import { fetchNsrResult } from "./util/fetchNsrResult";
import { fetchPlayerCnt } from "./util/fetchPlayerCnt";

import TableContainer from "./component/TableContainerNew";
import TeamCountInput from "./component/TeamCountInput";
import FinalButton from "./component/FinalButton";
import BackBar from "./component/BackBar";
import ComplianceCheck from "./component/ComplianceCheck";

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

  //public 폴더에 저장되어있는 json 파일에서 채점표를 읽어온다
  useEffect(() => {
    fetch(`/ngtos_kg_mark_web/markTable1.json`)
      .then((response) => response.json())
      .then((json) => {
        const savedData = localStorage.getItem(
          // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
          `nsrResult1/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
        );

        if (savedData && countValidScores(JSON.parse(savedData)) === 12) {
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
  useEffect(() => {
    fetch(`/ngtos_kg_mark_web/markTable2.json`)
      .then((response) => response.json())
      .then((json) => {
        const savedData = localStorage.getItem(
          // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
          `nsrResult2/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
        );
        if (savedData && countValidScores(JSON.parse(savedData)) === 5) {
          setNsrResult2((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
            isSave: 1,
          }));
        } else {
          setNsrResult2((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
          }));
        }
      });
  }, [category, detail_class_cd, rh_cd, refree, index]);
  useEffect(() => {
    fetch(`/ngtos_kg_mark_web/markTable3.json`)
      .then((response) => response.json())
      .then((json) => {
        const savedData = localStorage.getItem(
          // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
          `nsrResult3/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
        );
        if (savedData && countValidScores(JSON.parse(savedData)) === 4) {
          setNsrResult3((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
            isSave: 1,
          }));
        } else {
          setNsrResult3((prev) => ({
            ...prev,
            ...json,
            selectedCells: savedData ? JSON.parse(savedData) : {},
          }));
        }
      });
  }, [category, detail_class_cd, rh_cd, refree, index]);

  //selectedCell이 수정될때마다 로컬 스토리지에 저장한다
  const [totalScore, setTotalScore] = useState(-7);
  useEffect(() => {
    if (nsrResult.markBaseId === -7) return;
    if (totalScore === -7) return;
    if (Object.keys(nsrResult.selectedCells).length === 0) return;
    localStorage.setItem(`nsrResult1/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, JSON.stringify(nsrResult.selectedCells)); // localStorage 저장
  }, [nsrResult.selectedCells]);
  useEffect(() => {
    if (nsrResult2.markBaseId === -7) return;
    if (Object.keys(nsrResult2.selectedCells).length === 0) return;
    localStorage.setItem(`nsrResult2/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, JSON.stringify(nsrResult2.selectedCells)); // localStorage 저장
  }, [nsrResult2.selectedCells]);
  useEffect(() => {
    if (nsrResult3.markBaseId === -7) return;
    if (Object.keys(nsrResult3.selectedCells).length === 0) return;
    localStorage.setItem(`nsrResult3/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, JSON.stringify(nsrResult3.selectedCells)); // localStorage 저장
  }, [nsrResult3.selectedCells]);
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
  //#region keyboard
  const [keyboardState, setKeyboardState] = useState({
    show: false,
    category: null,
    index: null,
    targetId: null,
    value: "",
    state: null,
  });

  const onNext = () => {
    setKeyboardState((prev) => {
      // 현재 상태를 기반으로 다음 상태 결정
      let nextCategory = prev.category;
      let nextTargetId = prev.targetId + 1;
      let nextValue = "";

      if (prev.category === 1 && prev.targetId === nsrResult.maxCount) {
        nextCategory = 2;
        nextTargetId = 1;
        nextValue = nsrResult2.selectedCells[1]?.toString() || "";
      } else if (prev.category === 2 && prev.targetId === nsrResult2.maxCount) {
        nextCategory = 3;
        nextTargetId = 1;
        nextValue = nsrResult3.selectedCells[1]?.toString() || "";
      } else if (prev.category === 3 && prev.targetId === nsrResult3.maxCount) {
        setKeyboardState({
          show: false,
          targetId: null,
          category: null,
          value: null,
        });
        return;
      } else {
        // 기본 증가 로직
        nextCategory = prev.category;
        nextTargetId = prev.targetId + 1;

        const targetList = prev.category === 1 ? nsrResult.selectedCells : prev.category === 2 ? nsrResult2.selectedCells : nsrResult3.selectedCells;

        nextValue = targetList[nextTargetId]?.toString() || "";
      }

      return {
        ...prev,
        show: true,
        category: nextCategory,
        targetId: nextTargetId,
        value: nextValue,
        state: "focus",
      };
    });
  };

  const onPrev = () => {
    setKeyboardState((prev) => {
      // 현재 상태를 기반으로 다음 상태 결정
      let nextCategory = prev.category;
      let nextTargetId = prev.targetId - 1;
      let nextValue = "";

      if (prev.category === 3 && prev.targetId === 1) {
        nextCategory = 2;
        nextTargetId = nsrResult2.maxCount;
        nextValue = nsrResult2.selectedCells[nextTargetId]?.toString() || "";
      } else if (prev.category === 2 && prev.targetId === 1) {
        nextCategory = 1;
        nextTargetId = nsrResult.maxCount;
        nextValue = nsrResult.selectedCells[nextTargetId]?.toString() || "";
      } else if (prev.category === 1 && prev.targetId === 1) {
        setKeyboardState({
          show: false,
          targetId: null,
          category: null,
          value: null,
        });
        return;
      } else {
        // 기본 증가 로직
        nextCategory = prev.category;
        nextTargetId = prev.targetId - 1;

        const targetList = prev.category === 1 ? nsrResult.selectedCells : prev.category === 2 ? nsrResult2.selectedCells : nsrResult3.selectedCells;

        nextValue = targetList[nextTargetId]?.toString() || "";
      }

      return {
        ...prev,
        show: true,
        category: nextCategory,
        targetId: nextTargetId,
        value: nextValue,
        state: "focus",
      };
    });
  };
  //#endregion
  //#region etc
  const refreeName = useRecoilValue(refreeNameState);
  const backBar = {
    url: `/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${rh_cd}/${refree}/${category}`,
    text: `${refreeName} 심판 // ${getKindDescription(kind_cd)} ${getRoundDescription(rh_cd)}`,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerData, params]);

  const countValidScores = (selectedCells) => {
    return Object.values(selectedCells).filter((value) => typeof value === "number" && value > 0).length;
  };

  const sumValidScores = (nsrResult) => {
    return Object.values(nsrResult.selectedCells)
      .filter((value) => typeof value === "number" && value > 0)
      .reduce((sum, value, index) => sum + (value * nsrResult.markData[index]?.MAX_POINT) / 10, 0);
  };

  useEffect(() => {
    let count = countValidScores(nsrResult.selectedCells) + countValidScores(nsrResult2.selectedCells) + countValidScores(nsrResult3.selectedCells);
    let max = nsrResult.maxCount + nsrResult2.maxCount + nsrResult3.maxCount;
    let score = sumValidScores(nsrResult) + sumValidScores(nsrResult2) + sumValidScores(nsrResult3);
    score = Math.round(score * 10) / 10;
    setTotalScore(score);
    if (count === max) {
      saveNsrResultNew({ params, playerData, score });
    }
    localStorage.setItem(`score/${detail_class_cd}/${rh_cd}/${refree}/${category}/${(index % 6) + 1}`, JSON.stringify(score));
  }, [nsrResult, nsrResult2, nsrResult3]);

  const defaultFontSize = 18;
  const [fontSize, setFontSize] = useState(defaultFontSize); // 기본값 예: 18px
  const [end, setEnd] = useState(false); // 기본값 예: 18px
  useEffect(() => {
    setEnd(false);
    const savedData = localStorage.getItem(
      // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
      `end/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
    );
    setEnd(savedData === "true" ? true : savedData === "false" ? false : null);
  }, [category, detail_class_cd, rh_cd, refree, index]);
  const [yn1, setYn1] = useState(null); // 기본값 예: 18px
  const [yn2, setYn2] = useState(null);
  useEffect(() => {
    let savedData = localStorage.getItem(
      // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
      `yn1/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
    );

    setYn1(savedData === "true" ? true : savedData === "false" ? false : null);

    savedData = localStorage.getItem(
      // 로컬 스토리지에 selectedCell이 저장되어 있으면 갖고온다
      `yn2/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`
    );

    setYn2(savedData === "true" ? true : savedData === "false" ? false : null);
  }, [category, detail_class_cd, rh_cd, refree, index]);

  useEffect(() => {
    if (yn1 !== null) {
      localStorage.setItem(`yn1/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, JSON.stringify(yn1));
    }
  }, [yn1]);

  // yn2 변경 시 저장
  useEffect(() => {
    if (yn2 !== null) {
      localStorage.setItem(`yn2/${detail_class_cd}/${rh_cd}/${refree}/${category}/${index}`, JSON.stringify(yn2));
    }
  }, [yn2]);

  // 인원수와 각각의 채점 상태를 총괄하여 최종 저장 여부를 나타내는 state
  const [isSaveFinal, setIsSaveFinal] = useState(false);
  useEffect(() => {
    setIsSaveFinal(false);
    let count = countValidScores(nsrResult.selectedCells) + countValidScores(nsrResult2.selectedCells) + countValidScores(nsrResult3.selectedCells);
    let max = nsrResult.maxCount + nsrResult2.maxCount + nsrResult3.maxCount;
    if (count === max) {
      setIsSaveFinal(true);
    }
    if (detail_class_cd % 2 === 0 && (teamCount === 0 || isNaN(teamCount))) {
      setIsSaveFinal(false);
    }
    if (refree === "0" && yn1 !== true && yn1 !== false) {
      setIsSaveFinal(false);
    }
    if (refree === "0" && yn2 !== true && yn2 !== false) {
      setIsSaveFinal(false);
    }
  }, [teamCount, nsrResult, nsrResult2, nsrResult3, yn1, yn2]);
  //#endregion
  return (
    <div className="nsr-result-container" onClick={() => setKeyboardState((prev) => ({ ...prev, show: false, category: null, index: null }))}>
      <BackBar url={backBar.url} text={backBar.text} sentialDigit={!end} />
      <div className="nsr-header">
        <h1 className="nsr-player-name">
          {playerData.korNm}
          {detail_class_cd % 2 === 0 && "팀"}
        </h1>
        <div className="nsr-font-buttons">
          <button onClick={() => setFontSize((prev) => Math.max(prev - 2, 10))}>-</button>
          <button onClick={() => setFontSize(defaultFontSize)}>기본</button>
          <button onClick={() => setFontSize((prev) => Math.min(prev + 2, 36))}>+</button>
        </div>
      </div>

      {/*인원수 체크 영역. 단체전에서만 나옴 */}
      {detail_class_cd % 2 === 0 && <TeamCountInput end={end} teamCount={teamCount} setTeamCount={setTeamCount} totalScore={totalScore} selectedCells={countValidScores(nsrResult.selectedCells) + countValidScores(nsrResult2.selectedCells) + countValidScores(nsrResult3.selectedCells)} nextPlayerData={nextPlayerData} params={params} isSaveFinal={isSaveFinal} maxCount={nsrResult.maxCount + nsrResult2.maxCount + nsrResult3.maxCount} />}

      {refree === "0" && <ComplianceCheck yn1={yn1} yn2={yn2} setYn1={setYn1} setYn2={setYn2} params={params} end={end} />}
      <table className="mark-table">
        <th style={{ width: "8vw" }}>항목</th>
        <th style={{ width: "12vw" }}></th>
        <th style={{ width: "60vw" }}>채점포인트</th>
        <th style={{ width: "5vw" }}>점수</th>
        <th style={{ width: "10vw" }}>채점</th>
        <tbody className="mark-table-body">
          <TableContainer end={end} fontSize={fontSize} onPrev={onPrev} onNext={onNext} keyboardState={keyboardState} setKeyboardState={setKeyboardState} nsrResult={nsrResult} category={1} setNsrResult={setNsrResult} params={params} playerData={playerData} />
          <TableContainer end={end} fontSize={fontSize} onPrev={onPrev} onNext={onNext} keyboardState={keyboardState} setKeyboardState={setKeyboardState} nsrResult={nsrResult2} category={2} setNsrResult={setNsrResult2} params={params} playerData={playerData} />
          <TableContainer end={end} fontSize={fontSize} onPrev={onPrev} onNext={onNext} keyboardState={keyboardState} setKeyboardState={setKeyboardState} nsrResult={nsrResult3} category={3} setNsrResult={setNsrResult3} params={params} playerData={playerData} />
        </tbody>
      </table>
      <FinalButton yn1={yn1} yn2={yn2} end={end} setEnd={setEnd} keyboardState={keyboardState} teamCount={teamCount} setTeamCount={setTeamCount} totalScore={totalScore} selectedCells={countValidScores(nsrResult.selectedCells) + countValidScores(nsrResult2.selectedCells) + countValidScores(nsrResult3.selectedCells)} nextPlayerData={nextPlayerData} params={params} isSaveFinal={isSaveFinal} maxCount={nsrResult.maxCount + nsrResult2.maxCount + nsrResult3.maxCount} />
    </div>
  );
}

export default NsrResult;
