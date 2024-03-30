// express.js import하기
const express = require("express")
const dotenv = require('dotenv').config(); // dotenv 패키지를 사용하여 환경 변수 로드
const mongodb = require("./database/mongodb")  // mongoDB연결
const pg = require('./database/pg') // postgreSQL연결

const app = express()
const port = 8000

// 우리가 통신에서는 json으로 값을 주고 받긴 함
// json은 원래 통신에 사용할 수 없는 자료구조임
// json은 string으로 변환해서 보내고, 받는 쪽은 이걸 json으로 변화해서 사용함
app.use(express.json())

require("dotenv").config() // dotenv 패키지를 사용하여 환경 변수 로드

const loginRouter = require('./src/routes/index');  // index.js파일 import
app.use('/login', loginRouter);

const accountRouter = require('./src/routes/account');  // account.js파일 import
app.use('/account', accountRouter);

// const postRouter = require('./src/routes/post');  // post.js파일 import
// app.use('/post', postRouter);

// const notificationRouter = require('./src/routes/notification');  // notification.js파일 import
// app.use('/notification', notificationRouter);

// Web Server 실행 코드
app.listen(port, () => {
    console.log(`${port}번에서 HTTP Web Server 실행`)
})