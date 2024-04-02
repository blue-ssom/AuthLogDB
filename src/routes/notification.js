// 알림과 관련된 API

const router = require("express").Router() // express 안에 있는 Router만 import
const jwt = require("jsonwebtoken")
const client = require('../../database/mongodb');
const { ObjectId } = require('mongodb');

// 알림 조회
router.get('/', async (req, res) => {


    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {
 
        // Aggregation(집합) Framework를 사용하여 알림 데이터 필터링 및 조인
        const notifications = await client.db("notification_system").collection("notification").aggregate([
            // type이 post이거나 type이 like이면서 user._id가 토큰에서 저장한 idx값과 같은 알림을 필터링
            {
                // 조건을 여러 개 지정
                $or: [
                    { type: 'post' },
                    { type: 'like', "user._id": new ObjectId(TokenUserIdx) },
                    { type: 'comment', "user._id": TokenUserIdx }

                ]
            },
        ]).sort({ createdAt: -1 }).toArray();

        // 결과 설정
        result.success = true;
        result.message = "알림 조회 성공";
        result.data = notifications;

    }catch (err) {
        result.message = e.message;
    }finally {
        res.send(result);

    }
});

module.exports = router;
