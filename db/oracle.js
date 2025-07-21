const oracledb = require('oracledb');
const path = require('path');
const fs = require('fs'); // <--- 이 줄을 추가하세요!
// Wallet 경로 환경 변수 설정
// 현재 스크립트가 있는 디렉토리의 절대 경로를 가져옵니다.
const currentScriptDir = __dirname;

// 'Wallet_GyuDataBase' 디렉토리의 절대 경로를 만듭니다.
// 만약 스크립트가 '프로젝트루트/src/main.js'이고, 'Wallet_GyuDataBase'가 '프로젝트루트/Wallet_GyuDataBase'에 있다면
// path.join(currentScriptDir, '..', 'Wallet_GyuDataBase') 가 올바른 경로가 됩니다.
// 만약 'Wallet_GyuDataBase'가 현재 스크립트와 같은 디렉토리에 있다면
// path.join(currentScriptDir, 'Wallet_GyuDataBase') 가 됩니다.
process.env.TNS_ADMIN = path.join(currentScriptDir, '..', 'Wallet_GyuDataBase');

console.log('TNS_ADMIN set to:', process.env.TNS_ADMIN); // 이 경로가 맞는지 꼭 확인하세요!

try {
    const files = fs.readdirSync(process.env.TNS_ADMIN);
    console.log('Files in TNS_ADMIN directory:', files);
    if (!files.includes('tnsnames.ora')) {
        console.error('tnsnames.ora 파일이 TNS_ADMIN 디렉토리에서 발견되지 않았습니다!');
    }
} catch (err) {
    console.error('TNS_ADMIN 디렉토리를 읽을 수 없습니다:', err);
}

const dbConfig = {
  user: 'TODO', // 본인 DB 유저
  password: 'Qkrcjsrb8592!',
  connectString: 'gyudatabase_high' // tnsnames.ora 안에 있는 alias 이름
};

async function initialize() {
  try {
    
    await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      externalAuth: false,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Oracle DB connection pool created');
  } catch (err) {
    console.error('Error creating Oracle DB connection pool', err);
  }
}

async function executeQuery(query, params = []) {
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, params);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
}

async function getConnection() {
  let connection;

  try {
    connection = await oracledb.getConnection();
    return connection;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } 
}

module.exports = {
  initialize,
  executeQuery,
  getConnection
};