const router = require("express").Router() // express 안에 있는 Router만 import
const pool = require("../../database/pg");
const utils = require('../utils');

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
// 회원가입
// 특정 user 정보 보기
// 내 회원 정보 수정
// 회원탈퇴

// export 작업
module.exports = router