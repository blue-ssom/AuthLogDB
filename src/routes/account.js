// 계정과 관련된 API
const router = require("express").Router() // express 안에 있는 Router만 import
const jwt = require("jsonwebtoken")
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

// 특정 user 정보 보기
router.get('/:idx',  async(req, res) => {

    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {

        // 예외처리
        if (requestedUserIdx !== TokenUserIdx) {
          throw new Error("잘못된 접근입니다.")
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
router.put('/',async(req, res) => {
    const { password, name, phoneNumber, email, address } = req.body
    const result = {
            "success" : false,
            "message" : "",
            "data" : null
        }
   
    try {

        // 예외처리
        utils.checkRequiredField(id, "아이디")
        await utils.checkDuplicateId(id); // 아이디 중복 확인

        utils.checkRequiredField(password, "비밀번호")

        utils.checkName(name, "이름")

        utils.checkPhoneNumber(phoneNumber, "전화번호")
        await utils.checkDuplicatePhoneNumber(phoneNumber); // 전화번호 중복 확인

        utils.checkEmail(email, "이메일")
        await utils.checkDuplicateEmail(email); // 이메일 중복 확인

        if(address === null || address ===undefined || address === ""){
            throw new Error("주소를 입력하세요.")
        }

        // 내 정보 수정 진행
        const sql = `
            UPDATE scheduler.user 
            SET password = $1, name = $2, phonenumber = $3, email = $4, address = $5 
            WHERE idx = $6
        `;
        const data = await pool.query(sql, [password, name, phoneNumber, email, address, sessionUserIdx]);

        // DB 후처리
        const row = data.rows

        // 결과 설정
        result.success = true;
        result.message = "내 정보 수정 성공";
        result.data = row[0];
        
    } catch(e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }

});

// 회원가입
router.post('/', async(req, res) => {
    const { id, password, name, phoneNumber, email, address } = req.body

    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {

        // 예외처리
        utils.checkRequiredField(id, "아이디")
        await utils.checkDuplicateId(id); // 아이디 중복 확인

        utils.checkRequiredField(password, "비밀번호")

        utils.checkName(name, "이름")

        utils.checkPhoneNumber(phoneNumber, "전화번호")
        await utils.checkDuplicatePhoneNumber(phoneNumber); // 전화번호 중복 확인

        utils.checkEmail(email, "이메일")
        await utils.checkDuplicateEmail(email); // 이메일 중복 확인

        if(address === null || address ===undefined || address === ""){
            throw new Error("주소를 입력하세요.")
        }
      
        // DB통신
        const sql = `
            INSERT INTO scheduler.user (id, password, name, phonenumber, email, address) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const data = await pool.query(query, [id, password, name, phoneNumber, email, address]);

        // DB 후처리
        const row = data.rows

        // 결과 설정
        result.success = true;
        result.message = "회원가입 성공";
        result.data = row[0];

    } catch(e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }

});

// 회원탈퇴
router.delete('/',  async(req, res) => {
    const TokenUserIdx = req.TokenUserIdx; // verifyToken 미들웨어에서 저장된 사용자 인덱스
    const result = {
            "success" : false,
            "message" : "",
            "data" : null
        }
   
    try {

        // DB통신
        const sql = `
            DELETE FROM scheduler.user 
            WHERE idx = $1
        `;
        const data = await pool.query(sql, [TokenUserIdx]);

        // DB 후처리
        const row = data.rows

        // 결과 설정
        result.success = true;
        result.message = "회원탈퇴 성공";
        
    } catch(e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
});

// 로그아웃
router.post('/logout', async(req, res) => {
    // 요청 헤더에서 토큰을 가져옴
    const { token } = req.headers
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }
    try{
        // DB 통신
        const sql = `
            INSERT INTO scheduler.token_blacklist (token_value, expire_at) VALUES ($1, NOW())
        `;
        const data = await pool.query(sql, [token]);

        // DB 후처리
        const row = data.rows

        // 새로운 토큰을 발급하여 클라이언트에게 응답
        const newToken = jwt.sign({}, process.env.TOKEN_SECRET_KEY, { expiresIn: '0s' }); // 토큰 만료 시간을 0초로 설정
        res.setHeader('Authorization', newToken);

        // 결과 설정
        result.success = true;
        result.message = "로그아웃 성공";

    }catch(e){
        result.message = e.message;
    }finally{
        res.send(result);
    }
    
});

// export 작업
module.exports = router