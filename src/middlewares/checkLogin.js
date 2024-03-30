// Token의 유효성 검사

const pool = require("../../database/pg");
const jwt = require("jsonwebtoken")


const checkLogin = async (req, res, next) => {
    const { token } = req.headers
    const result = {
        "success" : false,
        "message" : "",
    }

    try {
        // 1. Token이 조작되지 않았는지
        jwt.verify(token, process.env.TOKEN_SECRET_KEY)

       // 2. 토큰이 블랙리스트에 있는지 확인
       // DB통신
       const sql = `SELECT COUNT(*) FROM scheduler.token_blacklist WHERE token_value = $1`;
       const rows = await pool.query(sql, [token]); // 배열 형태로 토큰 전달
       const isBlacklisted = parseInt(rows[0].count) > 0;

       if (isBlacklisted) {
           throw new Error('블랙리스트에 있는 토큰입니다.');
       }

       next()

    } catch(e) {
        console.log(e)

        // 1. jwt must be provided" / 2. jwt expired / 3. invalid token
        if(e.message === "jwt must be provided") result.message = "로그인이 필요합니다."
        else if(e.message === "jwt expired") result.message = "세션이 만료되었습니다. 다시 로그인해주세요."
        else if(e.message === "invalid token") result.message = "정상적이지 않은 접근입니다."
        else result.message = e.message

        res.send(result)
    }
}

module.exports = checkLogin