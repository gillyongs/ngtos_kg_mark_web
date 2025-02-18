const getScoreColumn = (refree, category) => {
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

const getMaxPoint = (data) => {
  return data.reduce(
    (max, item) => (item.MAX_POINT > max ? item.MAX_POINT : max),
    0
  );
};

const calculateTotalMaxPoint = (data) => {
  return data.reduce((total, item) => total + parseInt(item.MAX_POINT), 0);
};

export const fetchNsrResult = async ({
  params,
  entrant_team_id,
  setNsrResult,
}) => {
  const { api, to_cd, kind_cd, detail_class_cd, rh_cd, refree, category } =
    params;
  const mars = getScoreColumn(refree, category);
  const jid_cnt = "JID_CNT" + refree;

  try {
    const response = await fetch(`http://${api}:4000/fetch-nsrresult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_cd,
        detail_class_cd,
        rh_cd,
        entrant_team_id,
        refree,
        newCategory: category,
        mars,
        jid_cnt,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const markBaseId = Number(data.markBaseID);
    const markData = data.markTable;
    const maxPoint = getMaxPoint(markData);
    const allPoint = calculateTotalMaxPoint(markData);
    const categories = Array.from(
      new Set(markData.map((item) => item.CATEGORY))
    );
    const isSave = data.scoreMatch ? 1 : 0;
    const updatedSelectedCells = {};
    data.seqScore.forEach((row) => {
      updatedSelectedCells[row.SEQ] = Number(row.SCORE);
    });
    const num1 = Number(data.markTableCount.ITEM_CNT1_TEC);
    const num2 = Number(data.markTableCount.ITEM_CNT2_ART);
    const num3 = Number(data.markTableCount.ITEM_CNT3_CMP);
    let maxCount = 1;
    if (category == 1) {
      maxCount = num1;
    }
    if (category == 2) {
      maxCount = num2;
    }
    if (category == 3) {
      maxCount = num3;
    }

    setNsrResult((prevState) => ({
      ...prevState,
      markBaseId: markBaseId,
      markData: markData,
      selectedCells: updatedSelectedCells,
      maxPoint: maxPoint,
      allPoint: allPoint,
      categories: categories,
      maxCount: maxCount,
      isSave: isSave,
    }));

    if (data.seqScore.length === 0) {
      try {
        await fetch(
          `http://${api}:4000/def-nsrresult_mark/${to_cd}/${kind_cd}/${detail_class_cd}/${rh_cd}/${entrant_team_id}/${markBaseId}/${refree}/${category}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              maxCount: maxCount,
            }),
          }
        );
      } catch (error) {
        console.error("Error calling def-nsrresult_mark API:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching NSR result data:", error);
  }
};
