const express = require('express');
const bodyParser = require('body-parser');
oracleDB = require('./db/oracle'); // Import the oracle.js module
const cors = require('cors');
const oraDB = require('oracledb'); // 상단에 이미 선언되어 있어야 함


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Oracle DB 연결 설정
let pool;
oracleDB.initialize()
    .then(() => {
        console.log('Oracle DB connection pool initialized');   

    })
    .catch(err => {
        console.error('Error initializing Oracle DB connection pool', err);
        process.exit(1); // Exit the application if the pool cannot be initialized
    }
);
// /api/list 라우트에서 SELECT 실행
app.post('/api/list', async (req, res) => {
    let connection;
    const { stdYmd } = req.body; // 예시: title, content 컬럼 사용
    try {
        connection = await oracleDB.getConnection();
        const result = await connection.execute(
            `SELECT * from TB_TODO_LIST WHERE STD_YMD = :stdYmd ORDER BY TODO_NO`,
            { stdYmd: stdYmd },
            { outFormat: oraDB.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// /api/insert 라우트에서 INSERT 실행
app.post('/api/insert', async (req, res) => { 
    const { todoNo, stdYmd, finishYn, todoText, createUser, createTm } = req.body; // 예시: title, content 컬럼 사용
    let connection;
    try {
        connection = await oracleDB.getConnection();
        const result = await connection.execute(
            `MERGE INTO TB_TODO_LIST T
            USING (
                SELECT :stdYmd AS STD_YMD, 
                       :todoText AS TODO_TEXT, 
                       :createUser AS WORK_USER ,
                       :finishYn AS FINISH_YN,
                       case when :todoNo = 0 then NVL(( SELECT MAX(TODO_NO) + 1 FROM TB_TODO_LIST WHERE STD_YMD = :stdYmd),1) else :todoNo end as TODO_NO
                FROM dual
            ) S
            ON (T.TODO_NO = S.TODO_NO AND T.STD_YMD = S.STD_YMD )
            WHEN MATCHED THEN
                UPDATE SET T.FINISH_YN = S.FINISH_YN, T.WORK_USER = S.WORK_USER, T.WORK_TIME = sysdate , T.TODO_TEXT = S.TODO_TEXT
            WHEN NOT MATCHED THEN
                INSERT (TODO_NO ,STD_YMD,TODO_TEXT,WORK_USER,WORK_TIME , FINISH_YN) VALUES (S.TODO_NO , :stdYmd, :todoText, :createUser,sysdate, :finishYn)
            `,
            { finishYn: Number(finishYn) , todoText: todoText, createUser: createUser, stdYmd: stdYmd, todoNo: todoNo === null ? 0 : Number(todoNo) },
            { autoCommit: true }
        );
        res.json({ success: true, rowsAffected: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.post('/api/check', async (req, res) => { 
    const { todoNo, stdYmd, finishYn, createUser } = req.body; // 예시: title, content 컬럼 사용
    let connection;
    try {
        connection = await oracleDB.getConnection();
        const result = await connection.execute(
            `UPDATE TB_TODO_LIST 
             SET FINISH_YN = :finishYn, WORK_USER = :createUser, WORK_TIME = sysdate
             WHERE STD_YMD = :stdYmd AND TODO_NO = :todoNo
            `,
            { finishYn: Number(finishYn) , createUser: createUser, stdYmd: stdYmd, todoNo: todoNo === null ? 0 : Number(todoNo) },
            { autoCommit: true }
        );
        res.json({ success: true, rowsAffected: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// /api/insert 라우트에서 INSERT 실행
app.post('/api/delete', async (req, res) => {
    const { todoNo , stdYmd } = req.body; // 예시: title, content 컬럼 사용
    let connection;
    try {
        connection = await oracleDB.getConnection();
        const result = await connection.execute(
            `DELETE FROM TB_TODO_LIST WHERE TODO_NO = :todoNo AND STD_YMD = :stdYmd`,
            { todoNo: todoNo, stdYmd: stdYmd },
            { autoCommit: true }
        );
        res.json({ success: true, rowsAffected: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});