// saveHandlers.js

export const saveNsrResultMark = async ({ params, playerData, nsrResult, rowId, value }) => {
  const { api } = params;
  // 점수 초기화할때 개별 점수 저장
  try {
    const response = await fetch(`http://${api}:4000/update-nsrresult_mark/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seq: rowId,
        score: value,
        params: params,
        playerData: playerData,
        mark_base_id: nsrResult.markBaseId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save nsrresult_mark for seq ${rowId}`);
    }
  } catch (error) {
    console.error("Error updating nsrresult_mark data:", error);
  }
};

//============================================================================================
//============================================================================================
//============================================================================================

export const saveNsrResult = async ({ params, playerData, score }) => {
  const { api, refree, category } = params;
  // 채점 점수 db에 저장
  try {
    const getScoreColumn = (refree, category) => {
      // 총점 저장 위치 db 컬럼 하드코딩
      if (refree === "1") {
        // 심사위원장
        switch (parseInt(category)) {
          case 1:
            return "MARS_JP1";
          case 2:
            return "MARS_JP4";
          case 3:
            return "MARS_JP7";
          default:
            return 0;
        }
      }
      switch (parseInt(refree)) {
        case 2:
          return "MARS_JP2"; // 기술
        case 3:
          return "MARS_JP3";
        case 4:
          return "MARS_JP5"; // 예술
        case 5:
          return "MARS_JP6";
        case 6:
          return "MARS_JP8"; // 완성
        case 7:
          return "MARS_JP9";
        default:
          return 0;
      }
    };

    const response = await fetch(`http://${api}:4000/update-nsrresult/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mars: getScoreColumn(refree, category), // 점수를 넣을 column 위치
        score: score, // 총합 점수
        params: params,
        playerData: playerData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save nsrresult");
    }
  } catch (error) {
    console.error("Error saving nsrresult:", error);
  }
};

//============================================================================================
//============================================================================================
//============================================================================================

export const saveNsrResultPlayerCnt = async ({ params, playerData, teamCount }) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree } = params;
  const entrant_team_id = playerData.entrantTeamId;
  if (entrant_team_id === -7 || entrant_team_id === undefined || entrant_team_id === null) return;
  // 실제 인원수 db에 저장
  try {
    const response = await fetch(`http://${api}:4000/update-nsrresult_player_cnt/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jid: `JID_CNT${refree}`,
        count: teamCount,
        params: params,
        playerData: playerData,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save nsrresult_teamplayer_count");
    }
  } catch (error) {
    console.error("Error saving nsrresult:", error);
  }
};

//============================================================================================
//============================================================================================
//============================================================================================

export const saveNsrResultNew = async ({ params, playerData, score }) => {
  const { api, refree, category } = params;
  // 채점 점수 db에 저장
  try {
    const response = await fetch(`http://${api}:4000/update-nsrresult/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mars: "MARS_JP" + refree, // 점수를 넣을 column 위치
        score: score, // 총합 점수
        params: params,
        playerData: playerData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save nsrresult");
    }
  } catch (error) {
    console.error("Error saving nsrresult:", error);
  }
};
