// 아이디와 비밀번호 유효성 검사
function checkRequiredField(value, fieldName) {
    if (value === null || value === undefined || value === "") {
        throw new Error(`${fieldName}를 입력해주세요.`);
    }

    // 정규식을 이용하여 문자열이 숫자와 문자로만 구성되어 있는지 확인
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(value)) {
    throw new Error(`${fieldName}는 숫자와 문자로만 이루어져야 합니다.`);
    }

    // 최소 길이 검사
    if (value.length < 4) {
    throw new Error(`${fieldName}는 최소 4글자여야 합니다.`);
    }

    // 최대 길이 검사
    if (value.length > 12) {
    throw new Error(`${fieldName}는 최대 10글자를 초과할 수 없습니다.`);
    }
}

module.exports = {
    checkRequiredField
};