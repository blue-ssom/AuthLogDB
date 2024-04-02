const { body } = require('express-validator');

// 아이디 필드 검사
exports.validateId = [
    body('id').notEmpty().withMessage('아이디를 입력하세요.'),
    // 타입 검사 (문자열인지 확인)
    body('id').isString().withMessage('아이디는 문자열이어야 합니다.'),
    // 정규식을 사용하여 아이디 형식 검사 (영문자와 숫자만 허용)
    body('id').matches(/^[a-zA-Z0-9]+$/).withMessage('아이디는 영문자와 숫자로만 이루어져야 합니다.'),
    // 길이 체크 (4자 이상 10자 이하)
    body('id').isLength({ min: 4, max: 10 }).withMessage('아이디는 4자 이상 10자 이하여야 합니다.')
];
