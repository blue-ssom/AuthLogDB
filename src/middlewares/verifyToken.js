// Token의 유효성 검사 및 사용자 정보 확인

const jwt = require("jsonwebtoken")
const pool = require("../../database/pg");


const verifyToken = async(req, res, next) => {
    // 요청 헤더에서 토큰을 가져옴
    const { token } = req.headers
    console.log("토큰 : ", token);

    const result = {
        "success" : false,
        "message" : "",
    }

    try {
        // 0. 토큰이 블랙리스트에 있는지 확인
        // DB통신
        const sql = `SELECT COUNT(*) FROM scheduler.token_blacklist WHERE token_value = $1`;
        const { rows } = await pool.query(sql, [token]); // await를 사용하여 쿼리 결과를 기다림
        console.log(rows); // 쿼리 결과를 확인하여 문제 해결
        const isBlacklisted = parseInt(rows[0].count) > 0;

        if (isBlacklisted) {
            throw new Error('블랙리스트에 있는 토큰입니다.');
        }


        // 1. Token이 조작되지 않았는지 + 사용자 정보 확인
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.TokenUserIdx = decodedToken.idx; // 토큰에서 사용자 인덱스를 가져와 req 객체에 추가
        console.log("토큰에서 가져온 사용자 idx :", req.TokenUserIdx);

        next()

    } catch(e) {
        console.log(e)

        // 1. jwt must be provided" / 2. jwt expired / 3. invalid token
        if(e.message === "jwt must be provided") result.message = "로그인이 필요합니다."
        else if(e.message === "jwt expired") result.message = "세션이 만료되었습니다. 다시 로그인해주세요."
        else if(e.message === "invalid signature") result.message = "정상적이지 않은 접근입니다." // invalid token이 아니라 signature로 뜨길래 수정
        else result.message = e.message

        res.send(result)
    }
}

module.exports = verifyToken