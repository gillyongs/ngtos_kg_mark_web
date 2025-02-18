// Import statements
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Player.css";
import BackBar from "./component/BackBar";
import { playerDataState, refreeNameState } from "./util/recoild";
import { useRecoilState, useRecoilValue } from "recoil";
import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";

function Player() {
  const { api, to_cd, phone_number, detail_class_cd, rh_cd, refree, category } =
    useParams();
  const [playerData, setPlayerData] = useState([]);
  const [recoilPlayerData, setRecoilPlayerData] =
    useRecoilState(playerDataState); // 선수 목록을 recoil을 통해 저장
  const refreeName = useRecoilValue(refreeNameState);

  useEffect(() => {
    const fetchDataWithDelay = setTimeout(() => {
      const fetchPlayerData = async () => {
        try {
          let apiLink;
          if (parseInt(detail_class_cd) % 2 === 1) {
            //개인전이면 tour_player, 단체전이면 tour_team에서 데이터를 가져온다
            apiLink = `http://${api}:4000/get-tourplayer/${to_cd}/${detail_class_cd}/${rh_cd}`;
          } else {
            apiLink = `http://${api}:4000/get-tourteam/${to_cd}/${detail_class_cd}/${rh_cd}`;
          }
          const response = await fetch(apiLink);
          const data = await response.json();
          setPlayerData(data); // state : 현재 화면에 출력
          setRecoilPlayerData(data); // recoil : 전연변수에 저장. 다른 화면에서 사용
        } catch (error) {
          console.error("Error fetching player data:", error);
        }
      };

      fetchPlayerData();
    }, 100); // 0.1초 후에 데이터 가져오기

    return () => clearTimeout(fetchDataWithDelay); // cleanup 함수를 통해 setTimeout 정리
  }, []);

  const getHeaderLabel = (refree) => {
    // 테이블 헤더 텍스트
    switch (parseInt(refree)) {
      case 2:
      case 3:
        return "기술성 총점";
      case 4:
      case 5:
        return "예술성 총점";
      case 6:
      case 7:
        return "완성도 총점";
      default:
        return "";
    }
  };

  const getColumnValue = (refree, category, result) => {
    //심사위원별 저장된 총점 column 위치
    if (refree === "1") {
      switch (
        parseInt(category) //심사위원장
      ) {
        case 1:
          return result.MARS_JP1 || 0;
        case 2:
          return result.MARS_JP4 || 0;
        case 3:
          return result.MARS_JP7 || 0;
        default:
          return 0;
      }
    }
    switch (parseInt(refree)) {
      case 2:
        return result.MARS_JP2 || 0; //기술
      case 3:
        return result.MARS_JP3 || 0;
      case 4:
        return result.MARS_JP5 || 0; //예술
      case 5:
        return result.MARS_JP6 || 0;
      case 6:
        return result.MARS_JP8 || 0; //완성
      case 7:
        return result.MARS_JP9 || 0;
      default:
        return 0;
    }
  };

  const nameOrTeamName = (detail_class_cd) => {
    //단체전이면 팀명, 개인전이면 이름이란 텍스트를 테이블 헤더에 띄움
    if (parseInt(detail_class_cd) % 2 === 0) {
      return "팀명";
    } else {
      return "이름";
    }
  };

  function formatValue(value) {
    // 입력이 문자열인 경우 숫자로 변환
    if (typeof value === "string") {
      value = parseFloat(value);
      // 문자열이 숫자로 변환되지 않으면 에러 메시지 반환
      if (isNaN(value)) {
        return "Invalid input";
      }
    }

    // 값이 소수인지 확인
    if (typeof value === "number" && !isNaN(value)) {
      var integer_part = Math.floor(value);
      var decimal_part = value - integer_part;
      // 소수 부분이 0.00이면 정수 부분만 리턴
      if (decimal_part === 0) {
        return integer_part;
      }
      // 소수 부분이 0.50이면 정수 부분과 0.5를 합쳐서 리턴
      else if (decimal_part === 0.5) {
        return integer_part + 0.5;
      }
    }

    // 소수가 아니거나 문자열이 아닌 경우 그냥 값 그대로 반환
    return value;
  }

  return (
    <>
      <BackBar
        url={`/${api}/${to_cd}/${phone_number}`} // 화살표 누르면 돌아가는 url 주소
        text={`${refreeName} 심판 // ${getKindDescription(
          Math.floor(detail_class_cd / 100) % 10
        )} ${getRoundDescription(rh_cd)}`}
        /*  [ㅇㅇㅇ심판 // 예선전 결승]  */
      />
      <div className="player-container">
        <div className="empty_space"></div>
        <table border="1">
          <thead>
            <tr>
              <th>No</th>
              <th>{nameOrTeamName(detail_class_cd)}</th>
              {refree !== "1" && <th>{getHeaderLabel(refree, category)}</th>}
              {refree === "1" && ( //심사위원장이면 3개 다 출력
                <>
                  <th>기술성</th>
                  <th>예술성</th>
                  <th>완성도</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {playerData.map(
              (result, index) =>
                result.rh_cd === rh_cd && //
                (refree !== "1" ? (
                  <tr
                    key={result.ID}
                    onClick={() =>
                      (window.location.href = `/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${
                        result.rh_cd
                      }/${refree}/${parseInt(refree / 2)}/${index}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{result.start_no}</td>
                    <td>{result.NM}</td>
                    <td>
                      {formatValue(getColumnValue(refree, category, result))}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={result.ID}
                    onClick={() =>
                      (window.location.href = `/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${rh_cd}/${refree}/1/${index}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{result.start_no}</td>
                    <td>{result.NM}</td>
                    <td>{formatValue(getColumnValue(refree, 1, result))}</td>
                    <td>{formatValue(getColumnValue(refree, 2, result))}</td>
                    <td>{formatValue(getColumnValue(refree, 3, result))}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <br></br>
        {playerData.length === 0 && (
          <h4>스타트리스트가 생성되지 않았습니다.</h4>
        )}
      </div>
    </>
  );
}

export default Player;

const defaultPlayerData = [
  {
    ID: 1,
    start_no: 1,
    NM: "김철수",
    MARS_JP1: 30.5,
    MARS_JP2: 29.0,
    MARS_JP3: 28.0,
    MARS_JP4: 17.0,
    MARS_JP5: 16.0,
    MARS_JP6: 20.0,
    MARS_JP7: 23,
    MARS_JP8: 22.5,
    MARS_JP9: 21.0,
    rh_cd: "1",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "황인환",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.5,
    MARS_JP4: 18.0,
    MARS_JP5: 19.0,
    MARS_JP6: 18.5,
    MARS_JP7: 26,
    MARS_JP8: 25.0,
    MARS_JP9: 24.0,
    rh_cd: "1",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "허정빈",
    MARS_JP1: 28.5,
    MARS_JP2: 27.0,
    MARS_JP3: 28.5,
    MARS_JP4: 18.0,
    MARS_JP5: 17.5,
    MARS_JP6: 19.5,
    MARS_JP7: 24,
    MARS_JP8: 24.0,
    MARS_JP9: 23.0,
    rh_cd: "1",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이예일",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.0,
    MARS_JP4: 16.0,
    MARS_JP5: 15.0,
    MARS_JP6: 17.5,
    MARS_JP7: 26,
    MARS_JP8: 26.5,
    MARS_JP9: 25.0,
    rh_cd: "1",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "지승우",
    MARS_JP1: 28.5,
    MARS_JP2: 27.5,
    MARS_JP3: 28.0,
    MARS_JP4: 21.0,
    MARS_JP5: 20.5,
    MARS_JP6: 22.0,
    MARS_JP7: 24,
    MARS_JP8: 23.0,
    MARS_JP9: 22.0,
    rh_cd: "1",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "지현서",
    MARS_JP1: 29.0,
    MARS_JP2: 28.5,
    MARS_JP3: 29.0,
    MARS_JP4: 23.0,
    MARS_JP5: 22.0,
    MARS_JP6: 21.5,
    MARS_JP7: 25,
    MARS_JP8: 24.5,
    MARS_JP9: 23.5,
    rh_cd: "1",
  },

  {
    ID: 1,
    start_no: 1,
    NM: "김철수",
    MARS_JP1: 30.5,
    MARS_JP2: 29.0,
    MARS_JP3: 28.0,
    MARS_JP4: 17.0,
    MARS_JP5: 16.0,
    MARS_JP6: 20.0,
    MARS_JP7: 23,
    MARS_JP8: 22.5,
    MARS_JP9: 21.0,
    rh_cd: "2",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "황인환",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.5,
    MARS_JP4: 18.0,
    MARS_JP5: 19.0,
    MARS_JP6: 18.5,
    MARS_JP7: 26,
    MARS_JP8: 25.0,
    MARS_JP9: 24.0,
    rh_cd: "2",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "허정빈",
    MARS_JP1: 28.5,
    MARS_JP2: 27.0,
    MARS_JP3: 28.5,
    MARS_JP4: 18.0,
    MARS_JP5: 17.5,
    MARS_JP6: 19.5,
    MARS_JP7: 24,
    MARS_JP8: 24.0,
    MARS_JP9: 23.0,
    rh_cd: "2",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이예일",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.0,
    MARS_JP4: 16.0,
    MARS_JP5: 15.0,
    MARS_JP6: 17.5,
    MARS_JP7: 26,
    MARS_JP8: 26.5,
    MARS_JP9: 25.0,
    rh_cd: "2",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "지승우",
    MARS_JP1: 28.5,
    MARS_JP2: 27.5,
    MARS_JP3: 28.0,
    MARS_JP4: 21.0,
    MARS_JP5: 20.5,
    MARS_JP6: 22.0,
    MARS_JP7: 24,
    MARS_JP8: 23.0,
    MARS_JP9: 22.0,
    rh_cd: "2",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "지현서",
    MARS_JP1: 29.0,
    MARS_JP2: 28.5,
    MARS_JP3: 29.0,
    MARS_JP4: 23.0,
    MARS_JP5: 22.0,
    MARS_JP6: 21.5,
    MARS_JP7: 25,
    MARS_JP8: 24.5,
    MARS_JP9: 23.5,
    rh_cd: "2",
  },

  {
    ID: 1,
    start_no: 1,
    NM: "김철수",
    MARS_JP1: 30.5,
    MARS_JP2: 29.0,
    MARS_JP3: 28.0,
    MARS_JP4: 17.0,
    MARS_JP5: 16.0,
    MARS_JP6: 20.0,
    MARS_JP7: 23,
    MARS_JP8: 22.5,
    MARS_JP9: 21.0,
    rh_cd: "3",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "황인환",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.5,
    MARS_JP4: 18.0,
    MARS_JP5: 19.0,
    MARS_JP6: 18.5,
    MARS_JP7: 26,
    MARS_JP8: 25.0,
    MARS_JP9: 24.0,
    rh_cd: "3",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "허정빈",
    MARS_JP1: 28.5,
    MARS_JP2: 27.0,
    MARS_JP3: 28.5,
    MARS_JP4: 18.0,
    MARS_JP5: 17.5,
    MARS_JP6: 19.5,
    MARS_JP7: 24,
    MARS_JP8: 24.0,
    MARS_JP9: 23.0,
    rh_cd: "3",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이예일",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.0,
    MARS_JP4: 16.0,
    MARS_JP5: 15.0,
    MARS_JP6: 17.5,
    MARS_JP7: 26,
    MARS_JP8: 26.5,
    MARS_JP9: 25.0,
    rh_cd: "3",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "지승우",
    MARS_JP1: 28.5,
    MARS_JP2: 27.5,
    MARS_JP3: 28.0,
    MARS_JP4: 21.0,
    MARS_JP5: 20.5,
    MARS_JP6: 22.0,
    MARS_JP7: 24,
    MARS_JP8: 23.0,
    MARS_JP9: 22.0,
    rh_cd: "3",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "지현서",
    MARS_JP1: 29.0,
    MARS_JP2: 28.5,
    MARS_JP3: 29.0,
    MARS_JP4: 23.0,
    MARS_JP5: 22.0,
    MARS_JP6: 21.5,
    MARS_JP7: 25,
    MARS_JP8: 24.5,
    MARS_JP9: 23.5,
    rh_cd: "3",
  },

  {
    ID: 1,
    start_no: 1,
    NM: "김철수",
    MARS_JP1: 30.5,
    MARS_JP2: 29.0,
    MARS_JP3: 28.0,
    MARS_JP4: 17.0,
    MARS_JP5: 16.0,
    MARS_JP6: 20.0,
    MARS_JP7: 23,
    MARS_JP8: 22.5,
    MARS_JP9: 21.0,
    rh_cd: "4",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "황인환",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.5,
    MARS_JP4: 18.0,
    MARS_JP5: 19.0,
    MARS_JP6: 18.5,
    MARS_JP7: 26,
    MARS_JP8: 25.0,
    MARS_JP9: 24.0,
    rh_cd: "4",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "허정빈",
    MARS_JP1: 28.5,
    MARS_JP2: 27.0,
    MARS_JP3: 28.5,
    MARS_JP4: 18.0,
    MARS_JP5: 17.5,
    MARS_JP6: 19.5,
    MARS_JP7: 24,
    MARS_JP8: 24.0,
    MARS_JP9: 23.0,
    rh_cd: "4",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이예일",
    MARS_JP1: 29.0,
    MARS_JP2: 28.0,
    MARS_JP3: 29.0,
    MARS_JP4: 16.0,
    MARS_JP5: 15.0,
    MARS_JP6: 17.5,
    MARS_JP7: 26,
    MARS_JP8: 26.5,
    MARS_JP9: 25.0,
    rh_cd: "4",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "지승우",
    MARS_JP1: 28.5,
    MARS_JP2: 27.5,
    MARS_JP3: 28.0,
    MARS_JP4: 21.0,
    MARS_JP5: 20.5,
    MARS_JP6: 22.0,
    MARS_JP7: 24,
    MARS_JP8: 23.0,
    MARS_JP9: 22.0,
    rh_cd: "4",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "지현서",
    MARS_JP1: 29.0,
    MARS_JP2: 28.5,
    MARS_JP3: 29.0,
    MARS_JP4: 23.0,
    MARS_JP5: 22.0,
    MARS_JP6: 21.5,
    MARS_JP7: 25,
    MARS_JP8: 24.5,
    MARS_JP9: 23.5,
    rh_cd: "4",
  },
];
