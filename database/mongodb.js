const { MongoClient } = require('mongodb');

// MongoDB 연결 정보
const uri = "mongodb://localhost:27017"; // MongoDB 서버의 URI
const client = new MongoClient(uri); // MongoDB 클라이언트 생성

// MongoDB와의 연결 상태 확인
async function connectToMongoDB() {
    try {
      await client.connect(); // MongoDB와의 연결 설정
      console.log("MongoDB 연결 성공");
    } catch (error) {
      console.error("MongoDB 연결 안됨", error);
    }
  }
  
// MongoDB 연결 함수 호출
connectToMongoDB();

module.exports = client;