// 게시글과 관련된 API

const router = require("express").Router() // express 안에 있는 Router만 import
const jwt = require("jsonwebtoken")
const pool = require("../../database/pg");
const utils = require('../utils');


// *****게시글 관련***** //
// 게시글 추가 C
router.post('/', async(req, res) => {
   
    const { title, content, categoryIdx } = req.body
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {
        checkTitle(title);
        checkContent(content);

        // DB통신
        const postInsertInfoSQL = `
        INSERT INTO scheduler.post (user_idx, title, content, creationdate, updationdate) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        const postInsertResult = await pool.query(postInsertInfoSQL, [TokenUserIdx, title, content]);
        const postIdx = postInsertResult.rows[0].post_idx; // 새로 추가된 게시글의 ID

        // 카테고리 추가
        const categoryInsertSQL = `
            INSERT INTO scheduler.post_category (post_idx, category_idx)
            VALUES ($1, $2);
        `;
        await pool.query(categoryInsertSQL, [postIdx, categoryIdx]);

        // 알림 추가하기!

        result.success = true;
        result.message = "게시글 작성 성공";
        result.data = updatePostResult.rows[0];

    } catch(e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
});


// 게시글 조회 R
router.get('/all', async(req, res) => {


    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }
   
   try {
        // DB통신
        const sql = `SELECT * FROM scheduler.post`;
        const data = await pool.query(sql);

        // DB 후처리
        const row = data.rows

        if (row.length === 0) {
            throw new Error("게시글이 존재하지 않습니다.");
        }
        
        // 결과 설정
        result.success = true;
        result.message = "게시글 보기 성공";
        result.data = row[0];

    } catch (e) {
    result.message = e.message;
    } finally {
    res.send(result);
    }
});

// 게시글 수정 U
router.put('/:postIdx',  async(req, res) => {
    const postIdx = req.params.postIdx; // 게시글 ID
    const TokenUserIdx = req.TokenUserIdx; // verifyToken 미들웨어에서 저장된 사용자 인덱스
    console.log("미들웨어에서 가져온 사용자 idx : ", TokenUserIdx);
    
    const { title, content, categoryIdx } = req.body
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {
        checkTitle(title);
        checkContent(content);

        // DB통신
        const updatePostSQL = `
            UPDATE scheduler.post
            SET title = $1, content = $2, updationDate = CURRENT_TIMESTAMP
            WHERE post_idx = $3 AND user_idx = $4
        `;
        const updatePostResult = await pool.query(updatePostSQL, [title, content, postIdx, TokenUserIdx]);

        // 카테고리 수정
        const updateCategorySQL = `
            UPDATE scheduler.post_category
            SET category_idx = $1
            WHERE post_idx = $2
        `;
        const updateCategoryResult = await pool.query(updateCategorySQL, [categoryIdx, postIdx]);

        // DB 후처리
        const row = updatePostResult.rows;

        if (row.length === 0) {
            throw new Error("게시글 수정에 실패하였습니다.");
        }

        result.success = true;
        result.message = "게시글 수정 성공";
        result.data = postInsertResult.rows[0];
        
    } catch(e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }

});

// 게시글 삭제 D
router.delete('/:postIdx', async(req, res) => {
    const postIdx = req.params.postIdx; // 게시글 ID

    const { title, content } = req.body
    const result = {
        "success" : false,
        "message" : "",
        "data" : null
    }

    try {
        // DB통신
        const deletePostSQL = `
            DELETE FROM scheduler.post
            WHERE post_id = $1 AND user_idx = $2
        `;
        const deletePostResult = await pool.query(deletePostSQL, [postIdx, TokenUserIdx]);

        // DB 후처리
        const row = deletePostResult.rows;

        // post_category 테이블에서도 해당 게시글 정보 삭제
        const deletePostCategorySQL = `
            DELETE FROM scheduler.post_category
            WHERE post_idx = $1
        `;
        await pool.query(deletePostCategorySQL, [postIdx]);

        if (row.length === 0) {
            throw new Error("게시글 삭제에 실패하였습니다.");
        }

        result.success = true;
        result.message = "게시글 삭제 성공";
        
    } catch(e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
});

// 게시글 좋아요
router.post('/:postIdx/like',  async (req, res) => {
    const postIdx = req.params.postIdx; // 게시글 ID
  
    
    const result = {
        "success": false,
        "message": "",
        "data": null
    };

    try {
        // 좋아요 여부 확인
        const likeCheckSQL = `SELECT * FROM scheduler.post_likes WHERE post_idx = $1 AND user_idx = $2;`;
        const likeCheckResult = await pool.query(likeCheckSQL, [postIdx, TokenUserIdx]);

        if (likeCheckResult.rows.length > 0) {
            throw new Error("이미 좋아요를 누르셨습니다.");
        }

        // 좋아요 알림 추가하기

        // DB통신: 좋아요 추가
        const likeInsertSQL = `INSERT INTO scheduler.post_likes (post_idx, user_idx) VALUES ($1, $2);`;
        await pool.query(likeInsertSQL, [postIdx, TokenUserIdx]);

        // DB통신: 좋아요 수 업데이트
        const updateLikesCountSQL = `
            UPDATE scheduler.posts
            SET likes_count = likes_count + 1
            WHERE post_idx = $1;
        `;
        await pool.query(updateLikesCountSQL, [postIdx]);

        result.success = true;
        result.message = "게시글 좋아요 누르기 성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
});

// 게시글 좋아요 취소
router.delete('/:postId/like', async (req, res) => {
    const postIdx = req.params.postIdx; // 게시글 ID
   
    
    const result = {
        "success": false,
        "message": "",
        "data": null
    };

    try {
        // 좋아요 여부 확인
        const likeCheckSQL = `
        SELECT * FROM scheduler.post_likes
        WHERE post_idx = $1 AND user_idx = $2;
        `;
        const likeCheckResult = await pool.query(likeCheckSQL, [postIdx, TokenUserIdx]);

        // 만약 좋아요를 누르지 않은 경우, 오류 발생
        if (likeCheckResult.rows.length === 0) {
        throw new Error("게시글에 좋아요를 누른 적이 없습니다.");
        }
        // DB통신: 게시글 좋아요 취소
        const likeDeleteSQL = `
            DELETE FROM scheduler.post_likes
            WHERE post_idx = $1 AND user_idx = $2;
        `;
        const likeDeleteResult = await pool.query(likeDeleteSQL, [postIdx, TokenUserIdx]);

        // DB 후처리
        if (likeDeleteResult.rowCount === 0) {
            throw new Error("게시글 좋아요 취소에 실패하였습니다.");
        }

        // 좋아요 수 업데이트
        const updateLikesCountSQL = `
            UPDATE scheduler.posts
            SET likes_count = likes_count - 1
            WHERE post_idx = $1 AND likes_count > 0;
        `;
        const updateLikesCountResult = await pool.query(updateLikesCountSQL, [postIdx]);

        // 결과 설정
        result.success = true;
        result.message = "게시글 좋아요 취소 성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
});


// *****댓글 관련****** //
// 댓글 추가 C 
// 댓글 삭제 R
// 댓글 수정 U
// 댓글 삭제 D
// 댓글 좋아요
// 댓글 좋아요 취소
module.exports = router;