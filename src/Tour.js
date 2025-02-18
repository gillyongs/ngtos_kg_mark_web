import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import "./Tour.css";
import BackBar from "./component/BackBar"; // 헤더 임포트
import { toNmState } from "./util/recoild";

function Tour() {
  const { api } = useParams(); // url 주소에 있는 파라미터를 읽어 변수에 대입
  const [tourData, setTourData] = useState([]); // 대회 정보를 state로 지정할 경우 리액트에서 알아서 변화를 감지함
  const setToNm = useSetRecoilState(toNmState); // 대화명을 recoil에 저장하여 전역변수처럼 사용

  useEffect(() => {
    fetch(`http://${api}:4000/get-tour`) //대회 목록 가져옴
      .then((res) => res.json())
      .then((json) => {
        setTourData(json); // 가져온 대회 데이터를 tourData에 저장
        // tourData = json 하면 변화 감지 안됨. setTourData를 쓸 것.
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [api]); // api 값이 변하면 useEffect 내부의 코드가 실행됨

  useEffect(() => {
    if (tourData.length === 1) {
      // tour_sel 테이블엔 현재 진행중인 대회 1개의 데이터만 있어야 함
      const singleTour = tourData[0];
      setToNm(singleTour.TO_NM); // 대화명을 recoil에 저장하여 전역변수처럼 사용
      window.location.href = `/${api}/${singleTour.TO_CD}/login`; // 로그인 화면으로 이동
    }
  }, [tourData, api, setToNm]);

  return (
    // tourData가 1개가 아닐경우 화면에 표출되는 html
    <div className="tour-container">
      <BackBar url="/" />
      <h1>대회 선택</h1>
      {tourData.length === 0 ? ( // if문처럼 tourData.length가 0이면 () 안의 html이 화면에 출력된다.
        <p>열린 대회가 존재하지 않아 채점이 불가능합니다.</p>
      ) : (
        // 삼항영산자에 의해 tourData.length가 0이 아니면 이쪽 코드가 실행된다.
        <p>대회가 중복되어 채점이 불가능합니다.</p>
        // 레거시 코드. 대회가 여러개면 목록을 보여준다.
        // <table className="tour-table">
        //   <thead>
        //     <tr>
        //       <th>No</th>
        //       <th>대회명</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {tourData.map((tour, index) => (
        //       <tr key={tour.TO_CD}>
        //         <td>
        //           <Link to={`/${api}/${tour.TO_CD}/login`}>{index + 1}</Link>
        //         </td>
        //         <td>
        //           <Link to={`/${api}/${tour.TO_CD}/login`}>{tour.TO_NM}</Link>
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
      )}
    </div>
  );
}

export default Tour;
