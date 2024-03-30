const router = require("express").Router() // express 안에 있는 Router만 import
const jwt = require("jsonwebtoken")
const pool = require("../../database/pg");
const utils = require('../utils');
const verifyToken = require("../middlewares/verifyToken")

// 아이디 찾기
router.get('/find-id', async(req, res) => {
    const { name, phoneNumber} = req.body
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {

        // 예외처리
        utils.checkName(name)
        utils.checkPhoneNumber(phoneNumber)

        // DB통신
        const sql = `SELECT id FROM scheduler.user WHERE name = $1 AND phonenumber = $2`;
        const data = await pool.query(sql, [name, phoneNumber]);

        // DB 후처리
        const row = data.rows

        if(row.length === 0){
            throw new Error("회원정보가 존재하지 않습니다.")
        }
        
        result.success = true
        result.message = "아이디 찾기 성공";
        result.data = row[0].id;

   } catch (e) {
       result.message = e.message;
   } finally {
       res.send(result);
   }
});

// 비밀번호 찾기
router.get('/find-password', async(req, res) => {
    const { id, name, phoneNumber} = req.body
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {

        // 예외처리
        utils.checkRequiredField(id, "아이디")
        utils.checkName(name, "이름")
        utils.checkPhoneNumber(phoneNumber, "전화번호")

        // DB통신
        const sql = `SELECT password FROM scheduler.user WHERE id = $1 AND name = $2 AND phoneNumber = $3`;
        const data = await pool.query(sql, [id, name, phoneNumber]);

        // DB 후처리
        const row = data.rows

        if(row.length === 0){
            throw new Error("회원정보가 존재하지 않습니다.")
        }
        
        result.success = true
        result.message = "비밀번호 찾기 성공";
        result.data = row[0].password;

   } catch (e) {
       result.message = e.message;
   } finally {
       res.send(result);
   }
});

// 특정 user 정보 보기
router.get('/:idx', verifyToken,  async(req, res) => {
    const requestedUserIdx = parseInt(req.params.idx); // 사용자가 입력한 idx
    const TokenUserIdx = req.TokenUserIdx; // verifyToken 미들웨어에서 저장된 사용자 인덱스
    console.log("요청된 사용자 idx : ", requestedUserIdx);
    console.log("미들웨어에서 가져온 사용자 idx : ", TokenUserIdx);

    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {
        // 예외처리
        if (requestedUserIdx !== TokenUserIdx) {
          throw new Error("잘못된 접근입니다.")   // 세션이 없는 경우
        }

        // DB통신
        const sql = `SELECT * FROM scheduler.user WHERE idx = $1`;
        const data = await pool.query(sql, [TokenUserIdx]);

        // DB 후처리
        const row = data.rows

        if (row.length === 0) {
            throw new Error("회원정보가 존재하지 않습니다.");
        }
        
        // 결과 설정
        result.success = true;
        result.message = "특정 user 정보 조회 성공";
        result.data = row[0];

    } catch (e) {
    result.message = e.message;
    } finally {
    res.send(result);
    }

});



// 내 회원 정보 수정
// 회원가입
// 회원탈퇴
// 로그아웃

// export 작업
module.exports = router