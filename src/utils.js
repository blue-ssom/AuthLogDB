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

// 이름 유효성 검사
function checkName(value){
    if (value === null || value === undefined || value === "") {
        throw new Error(`이름을 입력해주세요.`);
    }

    // 정규식을 이용하여 문자로만 이루어진 문자열을 검사
    const regex = /^[a-zA-Z]+$/; 
    if (!regex.test(value)) {
        throw new Error("이름은 문자로만 이루어져야 합니다.");
    }

    // 최소 길이 검사
    if (value.length < 2) {
        throw new Error(`이름은 최소 2글자여야 합니다.`);
    }
    
    // 최대 길이 검사
    if (value.length > 30) {
    throw new Error(`이름은 최대 30글자를 초과할 수 없습니다.`);
    }
}

// 전화번호 유효성 검사
function checkPhoneNumber(value){
    if (value === null || value === undefined || value === "") {
        throw new Error(`전화번호를 입력해주세요.`);
    }

    // 정규식을 이용하여 11자리의 숫자로만 이루어진 문자열을 검사
    const regex = /^\d{11}$/;
    if (!regex.test(value)) {
        throw new Error("올바른 전화번호 형식이 아닙니다. 전화번호 11자리를 입력해주세요.");
    }

}

module.exports = {
    checkRequiredField,
    checkName,
    checkPhoneNumber,
};