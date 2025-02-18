// getRoundDescription.js

export function getRoundDescription(round) {
    // 입력값이 문자열이면 숫자로 변환
    if (typeof round === 'string') {
        round = parseInt(round, 10);
    }

    // 예선과 결승에 대한 예외 처리
    if (round === 891000) {
        return "예선";
    } else if (round === 899000) {
        return "결승";
    }

    // 첫자릿수에 따라 예선 조를 반환
    const firstDigit = round % 10;
    return `예선${firstDigit}조`;
}
