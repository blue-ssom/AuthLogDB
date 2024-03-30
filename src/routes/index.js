// 로그인 API

const router = require("express").Router() // express 안에 있는 Router만 import
const jwt = require("jsonwebtoken")
const pg = require('../../database/pg') // postgreSQL연결
const utils = require('../utils');
const checkLogin = require("../middlewares/checkLogin.js")

// 로그인 라우트
router.post("/", checkLogin, async (req, res) => {
    const { id, password } = req.body;
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {
        // 예외처리
        utils.checkRequiredField(id,"아이디")
        utils.checkRequiredField(password,"비밀번호")

        // DB통신
        const sql = `SELECT * FROM scheduler.user WHERE id = $1 AND password = $2`;
        const data = await pg.query(sql, [id, password]);

        // DB 후처리
        const row = data.rows

        if(row.length === 0){
            throw new Error("회원정보가 존재하지 않습니다.")
        }

        const user = row[0]; // 첫 번째 행의 정보를 사용자로 정의

        // token 발행
        const token = jwt.sign({
            idx: user.idx, // 사용자의 인덱스
            id: id, // 사용자의 아이디
            name: user.name // 사용자의 이름
        },process.env.TOKEN_SECRET_KEY,{
            "issuer": "stageus",
            "expiresIn": "10h", // 토큰의 만료 시간
            "iat":new Date().toISOString() // 현재 시간을 ISO 형식으로 얻음, iat = issued at)
        })
        
        result.success = true
        result.message = "로그인 성공!";
        result.data = row;
        result.token = token;
        
    } catch (e) {
        console.log(e)
        result.message = e.message;
    } finally {
        res.send(result);
    }
});

module.exports = router;