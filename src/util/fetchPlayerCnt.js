export const fetchPlayerCnt = async ({ params, playerData, setTeamCount }) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree, category } =
    params;
  const entrant_team_id = playerData.entrantTeamId;

  if (detail_class_cd % 2 !== 0) {
    return;
  }

  try {
    const response = await fetch(
      `http://${api}:4000/get-nsrresult_player_cnt/${to_cd}/${kind_cd}/${detail_class_cd}/${rh_cd}/${entrant_team_id}/JID_CNT${refree}`
    );
    const data = await response.json();
    const tc = Number(Object.values(data));
    if (tc === -1) {
      setTeamCount(0);
      try {
        const response = await fetch(
          `http://${api}:4000/update-nsrresult_player_cnt/${to_cd}/${kind_cd}/${detail_class_cd}/${rh_cd}/${entrant_team_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jid: `JID_CNT${refree}`,
              count: 0,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save nsrresult_teamplayer_count");
        }
      } catch (error) {
        console.error("Error saving nsrresult:", error);
      }
    } else {
      setTeamCount(tc);
    }
  } catch (error) {
    console.error("Error fetching mark content data:", error);
  }
};
