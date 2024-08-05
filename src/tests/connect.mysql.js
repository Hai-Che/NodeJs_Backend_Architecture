import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "shopDEV",
});

const batchSize = 100000;
const totalSize = 10_000_000;

let currentId = 1;
console.time("Timer::");
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }
  if (!values.length) {
    console.timeEnd("Timer::"); // 1 min 45 second for 10.000.000 records
    pool.end((err) => {
      if (err) {
        console.log(`error occur when running batch`);
      } else {
        console.log(`connection close successfully`);
      }
    });
    return;
  }
  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async function (err, results) {
    if (err) {
      throw err;
    }
    console.log(`Insert ${results.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
