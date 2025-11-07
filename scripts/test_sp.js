// console.log("✅ Script starting...");

// require("dotenv").config();
// const sql = require("mssql");

// // 🔍 Verify environment variables
// console.log("🌱 Environment loaded:");
// console.log({
//   SQL_USER: process.env.SQL_USER,
//   SQL_SERVER: process.env.SQL_SERVER,
//   SQL_DATABASE: process.env.SQL_DATABASE,
//   SQL_PORT: process.env.SQL_PORT
// });

// // ⚙️ SQL connection config
// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   server: process.env.SQL_SERVER,
//   port: Number(process.env.SQL_PORT),
//   database: process.env.SQL_DATABASE,
//   options: {
//     encrypt: true,
//     trustServerCertificate: false
//   }
// };

// // 🚀 Main function
// async function runEligibilitySP({
//   memberId,
//   dob,
//   fullName = null,
//   mailingAddress = null,
//   phone = null,
//   isDebug = false
// }) {
//   console.log("\n========================= 🧠 STARTING SP TEST =========================");
//   console.log(`🔹 MemberID: ${memberId}`);
//   console.log(`🔹 DOB: ${dob}`);
//   console.log(`🔹 FullName: ${fullName}`);
//   console.log(`🔹 Address: ${mailingAddress}`);
//   console.log(`🔹 Phone: ${phone}`);
//   console.log(`🔹 Debug Mode: ${isDebug}`);

//   try {
//     console.log("🔌 Connecting to SQL...");
//     const pool = await sql.connect(config);
//     console.log("✅ Connected to SQL successfully.");

//     const request = pool.request();
//     request.input("MemberID", sql.NVarChar(50), memberId);
//     request.input("DateOfBirth", sql.Date, dob);
//     request.input("IncomingPhoneNumber", sql.NVarChar(80), phone);
//     request.input("FullName", sql.NVarChar(100), fullName);
//     request.input("MailingAddress", sql.NVarChar(200), mailingAddress);
//     request.input("IsDebug", sql.Bit, isDebug ? 1 : 0);

//     console.log("⏳ Executing stored procedure: sp_member_member_eligiblity_check ...");
//     const result = await request.execute("sp_member_member_eligiblity_check");

//     console.log("\n🧪 Full Raw Result from SQL:");
//     console.dir(result, { depth: null });

//     // ✅ OUTPUT parameters
//     if (result.output && Object.keys(result.output).length > 0) {
//       console.log("\n✅ OUTPUT Parameters Returned:");
//       console.log({
//         status: result.output?.Status,
//         plan_name: result.output?.PlanName,
//         effective_date: result.output?.EffectiveDate,
//         expiration_date: result.output?.ExpirationDate,
//         full_address: result.output?.FullAddres,
//         additional_context: result.output?.AdditionalContext
//       });
//     }

//     // ✅ RECORDSET (SELECT result)
//     else if (result.recordset && result.recordset.length > 0) {
//       console.log("\n✅ Recordset Returned:");
//       console.table(result.recordset);
//     }

//     // ⚠️ NOTHING RETURNED
//     else {
//       console.warn("\n⚠️ Stored procedure executed but returned no data (no OUTPUT, no recordset).");
//     }

//   } catch (err) {
//     console.error("\n❌ ERROR running stored procedure:");
//     console.error(err);
//   } finally {
//     console.log("🔒 Closing SQL connection...");
//     await sql.close();
//     console.log("✅ Connection closed.\n");
//   }
// }

// // 🧪 Example execution
// runEligibilitySP({
//   memberId: "681252398",
//   dob: "1972-02-20",
//   fullName: "James Carter",
//   mailingAddress: "45 Hilltop Rd, Toronto, ON",
//   phone: "6475540467",
//   isDebug: false 
// }).catch(err => {
//   console.error("❌ Top-level async error:", err);
// });



// const axios = require('axios');

// async function testValidateCustomer() {
//   try {
//     const res = await axios.post('https://07gv09np-9000.use.devtunnels.ms/validate-customer', {
//       name: "James Carter",
//       dob: "1972-02-20",
//       member_id: "681252398",
//       address: "45 Hilltop Rd, Toronto, ON",
//       phone: "6475540467"
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // like curl --insecure
//     });

//     console.log("✅ Got response:");
//     console.dir(res.data, { depth: null });
//   } catch (err) {
//     console.error("❌ Request failed:");
//     console.error(err.toString());
//   }
// }

// testValidateCustomer();



// // scripts/test_sql_connection.js
// require("dotenv").config();
// const sql = require("mssql");

// (async () => {
//   try {
//     console.log("⏳ Connecting...");
//     await sql.connect({
//       user: process.env.SQL_USER,
//       password: process.env.SQL_PASSWORD,
//       server: process.env.SQL_SERVER,
//       port: Number(process.env.SQL_PORT),
//       database: process.env.SQL_DATABASE,
//       options: {
//         encrypt: true,
//         trustServerCertificate: true
//       }
//     });
//     console.log("✅ SQL Connection Successful!");
//     await sql.close();
//   } catch (err) {
//     console.error("❌ SQL Connection Failed:");
//     console.error(err);
//   }
// })();






require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function checkStoredProcedure() {
  try {
    console.log("⏳ Connecting...");
    const pool = await sql.connect(config);
    console.log("✅ Connected!");

    const result = await pool.request().query(`
      SELECT name, create_date, modify_date
      FROM sys.procedures
      WHERE name = 'sp_member_member_eligiblity_check'
    `);

    console.log("📄 SP Check Result:", result.recordset);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    sql.close();
  }
}

checkStoredProcedure();
