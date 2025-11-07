// // utils/sqlDb.js
// const sql = require('mssql');

// const config = {
//   user: 'saadmin',
//   password: 'G8r!xN2#qP9$uL7@wT5',
//   database: 'n8naisqldb',
//   server: 'n8naisqlserver.database.windows.net',
//   port: 1433,
//   options: {
//     encrypt: true,
//     trustServerCertificate: false
//   }
// };

// let poolPromise = null;

// async function getPool() {
//   if (!poolPromise) {
//     poolPromise = sql.connect(config);
//   }
//   return poolPromise;
// }

// async function findCustomerByMemberId(memberID) {
//   try {
//     const pool = await getPool();
//     const result = await pool.request()
//       .input('memberID', sql.Int, memberID)
//       .query('SELECT * FROM HealthcareMembers WHERE MemberID = @memberID');

//     if (result.recordset.length === 0) return null;

//     const row = result.recordset[0];

//     // Map SQL result to your app format
//     return {
//       memberID: row.MemberID,
//       name: `${row.FirstName} ${row.LastName}`,
//       dob: row.DOB,
//       planId: row.PlanName,   // ✅ use PlanName as planId for RAG pipeline
//       address: row.FullAddress
//     };
//   } catch (err) {
//     console.error('❌ SQL Error:', err);
//     throw err;
//   }
// }

// module.exports = { getPool, findCustomerByMemberId };





// // utils/sqlDb.js
// const sql = require('mssql');
// require('dotenv').config();  // Load from .env

// const config = {
//   user: process.env.AZURE_SQL_USER,
//   password: process.env.AZURE_SQL_PASSWORD,
//   database: process.env.AZURE_SQL_DB,
//   server: process.env.AZURE_SQL_SERVER,
//   port: parseInt(process.env.AZURE_SQL_PORT, 10) || 1433,
//   options: {
//     encrypt: true,
//     trustServerCertificate: false
//   }
// };

// let poolPromise = null;

// async function getPool() {
//   if (!poolPromise) {
//     poolPromise = sql.connect(config);
//   }
//   return poolPromise;
// }

// async function findCustomerByMemberId(memberID) {
//   try {
//     const pool = await getPool();
//     const result = await pool.request()
//       .input('memberID', sql.Int, memberID)
//       .query('SELECT * FROM HealthcareMembers WHERE MemberID = @memberID');

//     if (result.recordset.length === 0) return null;

//     const row = result.recordset[0];

//     return {
//       memberID: row.MemberID,
//       name: `${row.FirstName} ${row.LastName}`,
//       dob: row.DOB,
//       planId: row.PlanName,  // ✅ Used as plan_id
//       address: row.FullAddress
//     };
//   } catch (err) {
//     console.error('❌ SQL Error:', err);
//     throw err;
//   }
// }

// module.exports = { getPool, findCustomerByMemberId };



// const sql = require("mssql");

// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   server: process.env.SQL_SERVER,
//   port: Number(process.env.SQL_PORT ),
//   database: process.env.SQL_DATABASE,
//   options: {
//     encrypt: true, // Azure SQL requires this
//     trustServerCertificate: false
//   }
// };

// async function findCustomerByMemberId(memberId) {
//   try {
//     const pool = await sql.connect(config);
//     // const result = await pool.request()
//     //   .input("memberId", sql.VarChar, memberId)
//     //   .query(`
//     //     SELECT * FROM HealthcareMembers WHERE MemberID = @memberId
//     //   `);


//     const result = await pool.request()
//   .input("memberId", sql.VarChar, memberId)
//   .query(`
//     SELECT * 
//     FROM [dbo].[healthcare_members]
//     WHERE MemberID = @memberId
//   `);


//     if (result.recordset.length === 0) return null;

//     const row = result.recordset[0];

//     return {
//       name: `${row.FirstName} ${row.LastName}`,
//       dob: row.DOB,
//       address: row.FullAddress,
//       planId: row.PlanName
//     };
//   } catch (err) {
//     console.error("❌ SQL Error:", err);
//     throw err;
//   } finally {
//     await sql.close();
//   }
// }

// module.exports = {
//   findCustomerByMemberId
// };



const sql = require("mssql");

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function verifyMemberFromSalesforce(memberId, dob, fullName, mailingAddress, incomingPhone = null, isDebug = false) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    request.input("MemberID", sql.NVarChar(50), memberId);
    request.input("DateOfBirth", sql.Date, dob);
    request.input("IncomingPhoneNumber", sql.NVarChar(80), incomingPhone || null);
    request.input("FullName", sql.NVarChar(100), fullName || null);
    request.input("MailingAddress", sql.NVarChar(200), mailingAddress || null);
    request.input("IsDebug", sql.Bit, isDebug ? 1 : 0);

    const result = await request.execute("sp_member_member_eligiblity_check");

    return {
      status: result.output?.Status || "Not Found",
      plan_name: result.output?.PlanName ?? null,
      effective_date: result.output?.EffectiveDate ?? null,
      expiration_date: result.output?.ExpirationDate ?? null,
      member_address: result.output?.FullAddres ?? null,
      additional_context: result.output?.AdditionalContext ?? null
    };
  } catch (err) {
    console.error("❌ SQL Error in SP:", err);
    throw err;
  } finally {
    await sql.close();
  }
}

module.exports = {
  verifyMemberFromSalesforce
};
