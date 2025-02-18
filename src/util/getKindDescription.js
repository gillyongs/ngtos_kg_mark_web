// getKindDescription.js

export function getKindDescription(code) {
    // 입력값이 문자열이면 숫자로 변환
    if (typeof code === 'string') {
        code = parseInt(code, 10);
    }

    switch (code) {
        case 1: return '어르신부';
        case 2: return '일반부';
        case 3: return '18세 이하부';
        case 4: return '3세대부';
        case 5: return '전문부';
        case 6: return '해외부';
        case 7: return '63세 이하부';
        case 8: return '64세 이상부';
        default:
            return 'Unknown Kind';
    }
}
