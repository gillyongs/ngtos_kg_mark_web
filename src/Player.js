// Import statements
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Player.css";
import BackBar from "./component/BackBar";
import { playerDataState, refreeNameState } from "./util/recoild";
import { useRecoilState, useRecoilValue } from "recoil";
import { getRoundDescription } from "./util/getRoundDescription";
import { getKindDescription } from "./util/getKindDescription";
import { useNavigate } from "react-router-dom";

function Player() {
  const { api, to_cd, phone_number, detail_class_cd, rh_cd, refree, category } = useParams();
  const playerData = defaultPlayerData;
  const [recoilPlayerData, setRecoilPlayerData] = useRecoilState(playerDataState); // 선수 목록을 recoil을 통해 저장
  setRecoilPlayerData(playerData);
  const refreeName = useRecoilValue(refreeNameState);
  const navigate = useNavigate();

  const getHeaderLabel = (refree) => {
    // 테이블 헤더 텍스트
    switch (parseInt(refree)) {
      case 1:
        return "기술성 총점";
      case 2:
        return "예술성 총점";
      case 3:
        return "완성도 총점";
      default:
        return "";
    }
  };

  const nameOrTeamName = (detail_class_cd) => {
    //단체전이면 팀명, 개인전이면 이름이란 텍스트를 테이블 헤더에 띄움
    if (parseInt(detail_class_cd) % 2 === 0) {
      return "팀명";
    } else {
      return "선수명";
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
        text={`${refreeName} 심판 // ${getKindDescription(Math.floor(detail_class_cd / 100) % 10)} ${getRoundDescription(rh_cd)}`}
      />
      <div className="player-container">
        <div className="empty_space"></div>
        <table border="1">
          <thead>
            <tr>
              <th>No</th>
              <th>{nameOrTeamName(detail_class_cd)}</th>
              {refree !== "0" && <th>{getHeaderLabel(refree, category)}</th>}
              {refree === "0" && ( //심사위원장이면 3개 다 출력
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
                (refree !== "0" ? (
                  <tr key={result.ID} onClick={() => navigate(`/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${rh_cd}/${refree}/${refree}/${index}`)} style={{ cursor: "pointer" }}>
                    <td>{result.start_no}</td>
                    {detail_class_cd % 2 !== 0 && <td>{result.NM}</td>}
                    {detail_class_cd % 2 === 0 && <td>{result.NM}팀</td>}
                    <td>{localStorage.getItem(`score/${detail_class_cd}/${rh_cd}/${refree}/${category}/${result.start_no}`) || 0}</td>
                  </tr>
                ) : (
                  <tr key={result.ID} onClick={() => navigate(`/${api}/${to_cd}/${phone_number}/${detail_class_cd}/${rh_cd}/${refree}/${refree}/${index}`)} style={{ cursor: "pointer" }}>
                    <td>{result.start_no}</td>
                    <td>{result.NM}</td>
                    <td> {localStorage.getItem(`score1/${detail_class_cd}/${rh_cd}/${refree}/${category}/${result.start_no}`) || 0}</td>
                    <td> {localStorage.getItem(`score2/${detail_class_cd}/${rh_cd}/${refree}/${category}/${result.start_no}`) || 0}</td>
                    <td> {localStorage.getItem(`score3/${detail_class_cd}/${rh_cd}/${refree}/${category}/${result.start_no}`) || 0}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <br></br>
        {playerData.length === 0 && <h4>스타트리스트가 생성되지 않았습니다.</h4>}
      </div>
    </>
  );
}

export default Player;

const defaultPlayerData = [
  {
    ID: 1,
    start_no: 1,
    NM: "홍길동",
    rh_cd: "1",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "박길동",
    rh_cd: "1",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "장길동",
    rh_cd: "1",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이길동",
    rh_cd: "1",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "남궁길동",
    rh_cd: "1",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "유길동",
    rh_cd: "1",
  },

  {
    ID: 1,
    start_no: 1,
    NM: "홍길동",
    rh_cd: "2",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "박길동",
    rh_cd: "2",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "장길동",
    rh_cd: "2",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이길동",
    rh_cd: "2",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "남궁길동",
    rh_cd: "2",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "유길동",
    rh_cd: "2",
  },

  {
    ID: 1,
    start_no: 1,
    NM: "홍길동",
    rh_cd: "3",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "박길동",
    rh_cd: "3",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "장길동",
    rh_cd: "3",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이길동",
    rh_cd: "3",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "남궁길동",
    rh_cd: "3",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "유길동",
    rh_cd: "3",
  },

  {
    ID: 1,
    start_no: 1,
    NM: "홍길동",
    rh_cd: "899000",
  },
  {
    ID: 2,
    start_no: 2,
    NM: "박길동",
    rh_cd: "899000",
  },
  {
    ID: 3,
    start_no: 3,
    NM: "장길동",
    rh_cd: "899000",
  },
  {
    ID: 4,
    start_no: 4,
    NM: "이길동",
    rh_cd: "899000",
  },
  {
    ID: 5,
    start_no: 5,
    NM: "남궁길동",
    rh_cd: "899000",
  },
  {
    ID: 6,
    start_no: 6,
    NM: "유길동",
    rh_cd: "899000",
  },
];
