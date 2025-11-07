



// // C:\sanket\RAG_reteival_azure_SQL\routes\validateCustomer.js

// const express = require('express');
// const router = express.Router();
// const { findCustomerByMemberId } = require('../utils/sqlDb');
// const stringSimilarity = require('string-similarity');

// // 🔧 Utility: Normalize date without UTC shifting
// function normalizeDate(d) {
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// }

// // ✅ Health check route
// router.get('/', (req, res) => {
//   return res.status(200).json({ status: "ok", message: "✅ validate-customer endpoint is live" });
// });

// router.post('/', async (req, res) => {
//   try {
//     console.log("\n====================== 🟢 VALIDATE CUSTOMER REQUEST RECEIVED ======================");
//     console.log("📝 Raw Request Body:", JSON.stringify(req.body, null, 2));

//     // 📥 Extract input
//     let input = req.body;
//     let toolCallId = null;
//     if (req.body?.message?.toolCalls?.[0]?.function?.arguments) {
//       toolCallId = req.body.message.toolCalls[0].id || null;
//       input = req.body.message.toolCalls[0].function.arguments;
//       input = typeof input === "string" ? JSON.parse(input) : input;
//     }

//     // 🧹 Normalize inputs
//     const name = input?.name?.trim();
//     const dob = input?.dob?.trim();
//     const memberId = String(input?.member_id || "").replace(/\D/g, ""); // keep only digits
//     const givenAddress = input?.address ? input.address.toLowerCase().trim() : "";

//     console.log(`🔍 Validating memberID=${memberId}, name="${name}", dob=${dob}`);

//     // 🚫 Input validation
//     if (!name || !dob || !memberId) {
//       console.warn("⚠️ Missing required fields: name, dob, or member_id");
//       return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//     }

//     // 🔎 Lookup customer
//     const customer = await findCustomerByMemberId(memberId);
//     if (!customer) {
//       console.warn(`🚫 No record found for memberID=${memberId}`);
//       return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//     }

//     // 🧾 Log stored values for debugging
//     console.log(`🗄 Stored Name: ${customer.name}`);
//     console.log(`🗄 Stored DOB: ${customer.dob}`);
//     console.log(`🗄 Stored Address: ${customer.address}`);

//     // 🔠 Compare values
//     const fullName = (customer.name || "").toLowerCase().trim();
//     const givenName = name.toLowerCase().trim();
//     const nameSimilarity = stringSimilarity.compareTwoStrings(fullName, givenName);

//     // const storedDob = normalizeDate(customer.dob);
//     // const givenDob = normalizeDate(dob);

//  function normalizeDate(d) {
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// }

// const storedDob = normalizeDate(customer.dob);
// const givenDob = normalizeDate(dob);

// console.log(`📅 Stored DOB: "${storedDob}" | Given DOB: "${givenDob}" | Match: ${storedDob === givenDob}`);


//     const storedAddress = (customer.address || "").toLowerCase().trim();
//     const addressSimilarity = storedAddress && givenAddress
//       ? stringSimilarity.compareTwoStrings(storedAddress, givenAddress)
//       : null;

//     // 🧠 Log matches
//     console.log(`🔎 Name similarity: ${nameSimilarity}`);
//     console.log(`📅 Stored DOB: ${storedDob} | Given DOB: ${givenDob} | Match: ${storedDob === givenDob}`);
//     if (addressSimilarity !== null) console.log(`🏠 Address similarity: ${addressSimilarity}`);

//     // ✅ Verification logic
//     const isNameOK = nameSimilarity >= 0.8;
//     const isDobOK = storedDob === givenDob;
//     const isAddressOK = !addressSimilarity || addressSimilarity >= 0.65; // more tolerant

//     const isVerified = isNameOK && isDobOK && isAddressOK;

//     if (isVerified) {
//       return sendVerificationResult(res, toolCallId, {
//         status: "VERIFIED",
//         plan_id: customer.planId || customer.PlanName // fallback to PlanName
//       });
//     }

//     return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });

//   } catch (err) {
//     console.error("❌ Error validating customer:", err);
//     return sendVerificationResult(res, null, { status: "NOT VERIFIED" });
//   }
// });

// // 🔁 Response formatter
// function sendVerificationResult(res, toolCallId, result) {
//   const responseBody = toolCallId
//     ? { results: [{ toolCallId, result }] }
//     : result;

//   console.log("📤 Final Response:", responseBody);
//   res.setHeader("Content-Type", "application/json; charset=utf-8");
//   return res.status(200).json(responseBody);
// }

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const sql = require("mssql");
// const stringSimilarity = require("string-similarity");

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

// // Utility to normalize date to YYYY-MM-DD
// function normalizeDate(d) {
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// }

// router.get('/ping', (req, res) => {
//   console.log("✅ /ping hit");
//   res.send("pong 🏓");
// });

// // API Health Check
// router.get("/", (req, res) => {
//   return res.status(200).json({ status: "ok", message: "✅ validate-customer endpoint is live on dto dev tunnel " });
// });

// router.post("/", async (req, res) => {
//   console.log("\n====================== 🟢 VALIDATE CUSTOMER REQUEST RECEIVED ======================");
//   console.log("📝 Raw Request Body:", JSON.stringify(req.body, null, 2));

//   let input = req.body;
//   let toolCallId = null;

//   if (req.body?.message?.toolCalls?.[0]?.function?.arguments) {
//     toolCallId = req.body.message.toolCalls[0].id || null;
//     input = req.body.message.toolCalls[0].function.arguments;
//     input = typeof input === "string" ? JSON.parse(input) : input;
//   }

//   const name = input?.name?.trim();
//   const dob = input?.dob?.trim();
//   const memberId = String(input?.member_id || "").replace(/\D/g, "");
//   const givenAddress = input?.address?.toLowerCase().trim() || "";
//   const phone = input?.phone || null;

//   if (!name || !dob || !memberId) {
//     console.warn("⚠️ Missing required fields: name, dob, or member_id");
//     return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//   }

//   try {
//     const pool = await sql.connect(config);
//     const request = pool.request();

//     request.input("MemberID", sql.NVarChar(50), memberId);
//     request.input("DateOfBirth", sql.Date, dob);
//     request.input("IncomingPhoneNumber", sql.NVarChar(80), phone);
//     request.input("FullName", sql.NVarChar(100), name);
//     request.input("MailingAddress", sql.NVarChar(200), givenAddress);
//     request.input("IsDebug", sql.Bit, 0);

//     const result = await request.execute("sp_member_member_eligiblity_check");

//     console.log("🧪 Stored Procedure Output:");
//     console.dir(result.output, { depth: null });

//     const {
//       Status,
//       PlanName,
//       EffectiveDate,
//       ExpirationDate,
//       FullAddres,
//       AdditionalContext
//     } = result.output || {};

//     const isActive = (Status || "").toLowerCase() === "active";
//     const fullNameFromSP = name.toLowerCase().trim();
//     const addressFromSP = (FullAddres || "").toLowerCase().trim();

//     const dobFromSP = normalizeDate(dob); // Since SP doesn’t return dob
//     const storedDob = normalizeDate(dob);
//     const nameSimilarity = stringSimilarity.compareTwoStrings(fullNameFromSP, name.toLowerCase().trim());
//     const addressSimilarity = stringSimilarity.compareTwoStrings(addressFromSP, givenAddress);

//     const isNameOK = nameSimilarity >= 0.8;
//     const isDobOK = dobFromSP === storedDob;
//     const isAddressOK = !givenAddress || addressSimilarity >= 0.65;

//     const isVerified = isActive && isNameOK && isDobOK && isAddressOK;

//     if (isVerified) {
//       return sendVerificationResult(res, toolCallId, {
//         status: "VERIFIED",
//         plan_id: PlanName || null
//       });
//     } else {
//       return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//     }

//   } catch (err) {
//     console.error("❌ Error running eligibility check:", err);
//     return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//   } finally {
//     await sql.close();
//   }
// });

// function sendVerificationResult(res, toolCallId, result) {
//   const responseBody = toolCallId ? { results: [{ toolCallId, result }] } : result;
//   console.log("📤 Final Response:", responseBody);
//   return res.status(200).json(responseBody);
// }

// module.exports = router;





// const express = require('express');
// const router = express.Router();
// const sql = require("mssql");
// const stringSimilarity = require("string-similarity");

// // ⚙️ SQL Configuration
// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   server: process.env.SQL_SERVER,
//   port: Number(process.env.SQL_PORT),
//   database: process.env.SQL_DATABASE,
//   options: {
//     encrypt: true,
//     trustServerCertificate: true 
//   }
// };

// // 📅 Utility to normalize date
// function normalizeDate(d) {
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// }

// // 🩺 Health check
// router.get('/ping', (req, res) => {
//   console.log("✅ /ping hit");
//   res.send("pong 🏓");
// });

// router.get("/", (req, res) => {
//   return res.status(200).json({ status: "ok", message: "✅ validate-customer endpoint is live on dto dev tunnel" });
// });

// // 🚀 POST endpoint to validate customer
// router.post("/", async (req, res) => {
//   console.log("\n====================== 🟢 VALIDATE CUSTOMER REQUEST RECEIVED ======================");
//   console.log("📝 Raw Request Body:", JSON.stringify(req.body, null, 2));

//   let input = req.body;
//   let toolCallId = null;

//   // 🧠 Handle OpenAI-style function call input
//   if (req.body?.message?.toolCalls?.[0]?.function?.arguments) {
//     toolCallId = req.body.message.toolCalls[0].id || null;
//     input = req.body.message.toolCalls[0].function.arguments;
//     input = typeof input === "string" ? JSON.parse(input) : input;
//   }

//   // 📥 Extract fields
//   const name = input?.name?.trim();
//   const dob = input?.dob?.trim();
//   const memberId = String(input?.member_id || "").replace(/\D/g, "");
//   const phone = input?.phone || null;

//   if (!name || !dob || !memberId) {
//     console.warn("⚠️ Missing required fields: name, dob, or member_id");
//     return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//   }

//   try {
//     const pool = await sql.connect(config);
//     const request = pool.request();

//     // 📤 Pass inputs to SP
//     request.input("MemberID", sql.NVarChar(50), memberId);
//     request.input("DateOfBirth", sql.Date, dob);
//     request.input("IncomingPhoneNumber", sql.NVarChar(80), phone);
//     request.input("FullName", sql.NVarChar(100), name);
//     request.input("MailingAddress", sql.NVarChar(200), ""); // sent as empty
//     request.input("IsDebug", sql.Bit, 0);

//     console.log("🧠 Executing stored procedure: sp_member_member_eligiblity_check");
//     // const result = await request.execute("sp_member_member_eligiblity_check");
//     const result = await pool.request().query("SELECT TOP 1 GETDATE() AS now");
// console.log("✅ Test Query Result:", result.recordset);
// return res.json({ status: "DB OK", now: result.recordset[0].now });


//     console.log("🧪 Stored Procedure Output:");
//     console.dir(result.output, { depth: null });

//     // 🧾 Extract outputs
//     const {
//       Status,
//       PlanName,
//       EffectiveDate,
//       ExpirationDate,
//       FullAddres,
//       AdditionalContext
//     } = result.output || {};

//     const isActive = (Status || "").toLowerCase() === "active";

//     // ✍️ Normalize values
//     const storedDob = normalizeDate(dob); // SP doesn't return DOB
//     const givenDob = normalizeDate(dob);
//     const nameSimilarity = stringSimilarity.compareTwoStrings(name.toLowerCase(), name.toLowerCase()); // trivial, name from request only

//     // ✅ New logic: skip address check
//     const isNameOK = nameSimilarity >= 0.8;
//     const isDobOK = storedDob === givenDob;
//     const isAddressOK = true;

//     const isVerified = isActive && isNameOK && isDobOK && isAddressOK;

//     if (isVerified) {
//       return sendVerificationResult(res, toolCallId, {
//         status: "VERIFIED",
//         plan_id: PlanName || null
//       });
//     } else {
//       return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//     }

//   } catch (err) {
//     console.error("❌ Error running eligibility check:", err);
//     return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//   } finally {
//     await sql.close();
//   }
// });

// // 📤 Unified response handler
// function sendVerificationResult(res, toolCallId, result) {
//   const responseBody = toolCallId ? { results: [{ toolCallId, result }] } : result;
//   console.log("📤 Final Response:", responseBody);
//   return res.status(200).json(responseBody);
// }

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const sql = require("mssql");
// const stringSimilarity = require("string-similarity");

// // ⚙️ SQL Configuration
// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   server: process.env.SQL_SERVER,
//   port: Number(process.env.SQL_PORT),
//   database: process.env.SQL_DATABASE,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true, // needed for internal/self-signed certs
//   },
// };

// // 📅 Utility to normalize date
// function normalizeDate(d) {
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// }

// // 🩺 Health check endpoints
// router.get('/ping', (req, res) => {
//   console.log("✅ /ping hit");
//   res.send("pong 🏓");
// });

// router.get("/", (req, res) => {
//   return res.status(200).json({
//     status: "ok",
//     message: "✅ validate-customer endpoint is live on DTO dev tunnel"
//   });
// });

// // 🚀 POST endpoint to validate customer
// router.post("/", async (req, res) => {
//   console.log("\n====================== 🟢 VALIDATE CUSTOMER REQUEST RECEIVED ======================");
//   console.log("📝 Raw Request Body:", JSON.stringify(req.body, null, 2));

//   let input = req.body;
//   let toolCallId = null;

//   // 🧠 Handle OpenAI-style function call input
//   if (req.body?.message?.toolCalls?.[0]?.function?.arguments) {
//     toolCallId = req.body.message.toolCalls[0].id || null;
//     input = req.body.message.toolCalls[0].function.arguments;
//     input = typeof input === "string" ? JSON.parse(input) : input;
//   }

//   // 📥 Extract input parameters
//   const name = input?.name?.trim();
//   const dob = input?.dob?.trim();
//   const memberId = String(input?.member_id || "").replace(/\D/g, "");
//   const phone = input?.phone || null;

//   if (!name || !dob || !memberId) {
//     console.warn("⚠️ Missing required fields: name, dob, or member_id");
//     return sendVerificationResult(res, toolCallId, { status: "NOT VERIFIED" });
//   }

//   console.log("📦 Normalized Input Params:", {
//     MemberID: memberId,
//     Name: name,
//     DOB: dob,
//     Phone: phone || "N/A",
//   });

//   const startTime = new Date();

//   try {
//     console.log("🔌 Connecting to SQL...");
//     const pool = await sql.connect(config);
//     const request = pool.request();
// request.timeout = 120000;
//     // 🧾 Bind parameters
//     request.input("MemberID", sql.NVarChar(50), memberId);
//     request.input("DateOfBirth", sql.Date, dob);
//     request.input("IncomingPhoneNumber", sql.NVarChar(80), phone);
//     request.input("FullName", sql.NVarChar(100), name);
//     request.input("MailingAddress", sql.NVarChar(200), ""); // no address verification
// //   const debugMode = true; // toggle for SP debug
// // request.input("IsDebug", sql.Bit, debugMode ? 1 : 0);


// const debugMode = false;
// request.input("IsDebug", sql.Bit, 0);

//     console.log("🧠 Executing stored procedure: sp_member_member_eligiblity_check");


// // request.stream = false;
// // pool.requestTimeout = 120000; // 1 min timeout
// // pool.connectionTimeout = 60000;

// // console.log("🧠 Running SP in actual mode...");
// //  const result = await request.execute("sp_member_member_eligiblity_check");


// console.log("🧠 Executing stored procedure: sp_member_member_eligiblity_check");
// request.stream = false;
// pool.requestTimeout = 120000;
// pool.connectionTimeout = 60000;
// console.log("🧠 Running SP in ACTUAL mode...");
// const result = await request.execute("sp_member_member_eligiblity_check");


//     // const result = await request.execute("sp_member_member_eligiblity_check");
    

//     const execTime = ((new Date()) - startTime) / 1000;
//     console.log(`⏱️ SP Execution completed in ${execTime}s`);

//     // 🧩 Log everything returned by SQL
//     console.log("📦 Full SP Result Object:");
//     console.dir(result, { depth: null });

//     // Extract both recordset + output
//     // const spOutput = result.output || {};
//     // const spRecordset = result.recordset || [];

//     // console.log("🧾 SP Output Params:", spOutput);
//     // console.log("🧾 SP Recordset:", spRecordset);

//     // // Destructure useful fields
//     // const {
//     //   Status,
//     //   PlanName,
//     //   EffectiveDate,
//     //   ExpirationDate,
//     //   FullAddres,
//     //   AdditionalContext
//     // } = spOutput;

//     // // ✅ Verification Logic
//     // const isActive = (Status || "").toLowerCase() === "active";
//     // const storedDob = normalizeDate(dob);
//     // const givenDob = normalizeDate(dob);
//     // const isDobOK = storedDob === givenDob;
//     // const isNameOK = true; // currently skip name similarity check
//     // const isAddressOK = true; // skipping address logic as per request

//     // const isVerified = isActive && isNameOK && isDobOK && isAddressOK;

// // Extract both recordset + output
// const spOutput = result.output || {};
// const spRecordset = result.recordset || [];

// console.log("🧾 SP Output Params:", spOutput);
// console.log("🧾 SP Recordset:", spRecordset);

// // ✅ Pull data from recordset instead of output
// const resultRow = spRecordset[0] || {};
// const {
//   Status,
//   PlanName,
//   EffectiveDate,
//   ExpirationDate,
//   MemberAddress,
//   AdditionalContext
// } = resultRow;

// // ✅ Verification Logic
// const isActive = (Status || "").toLowerCase() === "active";
// const storedDob = normalizeDate(dob);
// const givenDob = normalizeDate(resultRow?.DateOfBirth || dob);
// const isDobOK = storedDob === givenDob;
// const isNameOK = true;
// const isAddressOK = true;

// const isVerified = isActive && isNameOK && isDobOK && isAddressOK;


//     console.log("🧮 Verification Breakdown:", {
//       isActive,
//       isNameOK,
//       isDobOK,
//       isAddressOK,
//       finalStatus: isVerified ? "VERIFIED ✅" : "NOT VERIFIED ❌",
//     });

//     if (isVerified) {
//       return sendVerificationResult(res, toolCallId, {
//         status: "VERIFIED",
//         plan_id: PlanName || null,
//         effective_date: EffectiveDate || null,
//         expiration_date: ExpirationDate || null
//       });
//     } else {
//       return sendVerificationResult(res, toolCallId, {
//         status: "NOT VERIFIED",
//         reason: "Member not active or data mismatch",
//       });
//     }

//   } catch (err) {
//     console.error("❌ SQL/SP Execution Error:", err);
//     return sendVerificationResult(res, toolCallId, {
//       status: "NOT VERIFIED",
//       error: err.message
//     });
//   } finally {
//     console.log("🔒 Closing SQL connection...");
//     await sql.close();
//     console.log("✅ SQL connection closed.\n");
//   }
// });

// // 📤 Unified response handler
// function sendVerificationResult(res, toolCallId, result) {
//   const responseBody = toolCallId
//     ? { results: [{ toolCallId, result }] }
//     : result;
//   console.log("📤 Final API Response:", responseBody);
//   return res.status(200).json(responseBody);
// }

// module.exports = router;












// const express = require('express');
// const router = express.Router();
// const sql = require("mssql");
// const stringSimilarity = require("string-similarity");

// // ⚙️ SQL Configuration
// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   server: process.env.SQL_SERVER,
//   port: Number(process.env.SQL_PORT),
//   database: process.env.SQL_DATABASE,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true, // needed for internal/self-signed certs
//   },
// };

// // 📅 Utility to normalize date
// function normalizeDate(d) {
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// }

// // 🩺 Health check endpoints
// router.get('/ping', (req, res) => {
//   console.log("✅ /ping hit");
//   res.send("pong 🏓");
// });

// router.get("/", (req, res) => {
//   return res.status(200).json({
//     status: "ok",
//     message: "✅ validate-customer endpoint is live on DTO dev tunnel"
//   });
// });

// // 🚀 POST endpoint to validate customer
// router.post("/", async (req, res) => {
//   console.log("\n====================== 🟢 VALIDATE CUSTOMER REQUEST RECEIVED ======================");
//   console.log("📝 Raw Request Body:", JSON.stringify(req.body, null, 2));

//   let input = req.body;
//   let toolCallId = null;

//   // 🧠 Handle OpenAI-style function call input
//   if (req.body?.message?.toolCalls?.[0]?.function?.arguments) {
//     toolCallId = req.body.message.toolCalls[0].id || null;
//     input = req.body.message.toolCalls[0].function.arguments;
//     input = typeof input === "string" ? JSON.parse(input) : input;
//   }

//   // 📥 Extract input parameters
//   const name = input?.name?.trim();
//   const dob = input?.dob?.trim();
//   const memberId = String(input?.member_id || "").replace(/\D/g, "");
//   const phone = input?.phone || null;
//   const address = input?.address?.trim() || "";  // 🔄 NOTE: now using `address` for Vapi compatibility

//   if (!name || !dob || !memberId || !address) {
//     console.warn("⚠️ Missing required fields: name, dob, member_id, or address");
//     return sendVerificationResult(res, toolCallId, {
//       status: "NOT VERIFIED",
//       reason: "Missing required fields"
//     });
//   }

//   console.log("📦 Normalized Input Params:", {
//     MemberID: memberId,
//     Name: name,
//     DOB: dob,
//     Phone: phone || "N/A",
//     Address: address || "N/A"
//   });

//   const startTime = new Date();

//   try {
//     console.log("🔌 Connecting to SQL...");
//     const pool = await sql.connect(config);
//     const request = pool.request();
//     request.timeout = 120000;

//     // 🧾 Bind parameters
//     request.input("MemberID", sql.NVarChar(50), memberId);
//     request.input("DateOfBirth", sql.Date, dob);
//     request.input("IncomingPhoneNumber", sql.NVarChar(80), phone);
//     request.input("FullName", sql.NVarChar(100), name);
//     request.input("MailingAddress", sql.NVarChar(200), address);  // 🔄 Send to SP anyway
//     request.input("IsDebug", sql.Bit, 0);

//     console.log("🧠 Executing stored procedure: sp_member_member_eligiblity_check");
//     request.stream = false;
//     pool.requestTimeout = 120000;
//     pool.connectionTimeout = 60000;

//     const result = await request.execute("sp_member_member_eligiblity_check");
//     const execTime = ((new Date()) - startTime) / 1000;
//     console.log(`⏱️ SP Execution completed in ${execTime}s`);

//     const spRecordset = result.recordset || [];
//     const resultRow = spRecordset[0] || {};

//     const {
//       Status,
//       PlanName,
//       EffectiveDate,
//       ExpirationDate,
//       MemberAddress,
//       AdditionalContext
//     } = resultRow;

//     const isActive = (Status || "").toLowerCase() === "active";
//     const storedDob = normalizeDate(dob);
//     const givenDob = normalizeDate(resultRow?.DateOfBirth || dob);
//     const isDobOK = storedDob === givenDob;
//     const isNameOK = true;

//     // 📬 Fuzzy address match
//     const givenAddress = address.toLowerCase();
//     const dbAddress = (MemberAddress || "").toLowerCase();
//     let addressSimilarity = 0;
//     let isAddressOK = false;

//     if (givenAddress && dbAddress) {
//       addressSimilarity = stringSimilarity.compareTwoStrings(givenAddress, dbAddress);
//       isAddressOK = addressSimilarity >= 0.8;
//     }

//     console.log(`📏 Address similarity score: ${addressSimilarity.toFixed(2)}`);

//     const isVerified = isActive && isNameOK && isDobOK && isAddressOK;

//     console.log("🧮 Verification Breakdown:", {
//       isActive,
//       isNameOK,
//       isDobOK,
//       isAddressOK,
//       addressSimilarity,
//       finalStatus: isVerified ? "VERIFIED ✅" : "NOT VERIFIED ❌"
//     });

//     if (isVerified) {
//       return sendVerificationResult(res, toolCallId, {
//         status: "VERIFIED",
//         plan_id: PlanName || null,
//         effective_date: EffectiveDate || null,
//         expiration_date: ExpirationDate || null
//       });
//     } else {
//       const reason = `Member not active or data mismatch. (Address similarity: ${(addressSimilarity * 100).toFixed(1)}%)`;
//       return sendVerificationResult(res, toolCallId, {
//         status: "NOT VERIFIED",
//         reason
//       });
//     }

//   } catch (err) {
//     console.error("❌ SQL/SP Execution Error:", err);
//     return sendVerificationResult(res, toolCallId, {
//       status: "NOT VERIFIED",
//       error: err.message
//     });
//   } finally {
//     console.log("🔒 Closing SQL connection...");
//     await sql.close();
//     console.log("✅ SQL connection closed.\n");
//   }
// });

// // 📤 Unified response handler
// function sendVerificationResult(res, toolCallId, result) {
//   const responseBody = toolCallId
//     ? { results: [{ toolCallId, result }] }
//     : result;
//   console.log("📤 Final API Response:", responseBody);
//   return res.status(200).json(responseBody);
// }

// module.exports = router;








const express = require('express');
const router = express.Router();
const sql = require("mssql");
const stringSimilarity = require("string-similarity");

// ⚙️ SQL Configuration
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// 📅 Normalize date
function normalizeDate(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 🩺 Health check
router.get('/ping', (req, res) => {
  console.log("✅ /ping hit");
  res.send("pong 🏓");
});

router.get("/", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "✅ validate-customer endpoint is live"
  });
});

// 🚀 POST endpoint for Vapi
router.post("/", async (req, res) => {
  console.log("\n====================== 🟢 VALIDATE CUSTOMER REQUEST RECEIVED ======================");
  console.log("📝 Raw Request Body:", JSON.stringify(req.body, null, 2));

  let input = req.body;
  let toolCallId = null;

  // Vapi tool call compatibility
  if (req.body?.message?.toolCalls?.[0]?.function?.arguments) {
    toolCallId = req.body.message.toolCalls[0].id || null;
    input = req.body.message.toolCalls[0].function.arguments;
    input = typeof input === "string" ? JSON.parse(input) : input;
  }

  const name = input?.name?.trim();
  const dob = input?.dob?.trim();
  const memberId = String(input?.member_id || "").replace(/\D/g, "");
  const phone = input?.phone || null;
  const address = input?.address?.trim() || "";

  if (!name || !dob || !memberId || !address) {
    console.warn("⚠️ Missing required fields: name, dob, member_id, or address");
    return sendVerificationResult(res, toolCallId, {
      status: "NOT VERIFIED",
      reason: "Missing required fields"
    });
  }

  console.log("📦 Normalized Input Params:", {
    MemberID: memberId,
    Name: name,
    DOB: dob,
    Phone: phone || "N/A",
    Address: address
  });

  const startTime = new Date();

  try {
    console.log("🔌 Connecting to SQL...");
    const pool = await sql.connect(config);
    const request = pool.request();
    request.timeout = 120000;

    request.input("MemberID", sql.NVarChar(50), memberId);
    request.input("DateOfBirth", sql.Date, dob);
    request.input("IncomingPhoneNumber", sql.NVarChar(80), phone);
    request.input("FullName", sql.NVarChar(100), name);
    request.input("MailingAddress", sql.NVarChar(200), address);
    request.input("IsDebug", sql.Bit, 0);

    console.log("🧠 Executing stored procedure: sp_member_member_eligiblity_check");
    const result = await request.execute("sp_member_member_eligiblity_check");

    const execTime = ((new Date()) - startTime) / 1000;
    console.log(`⏱️ SP Execution completed in ${execTime}s`);

    const record = result.recordset?.[0] || {};
    const {
      Status,
      PlanName,
      EffectiveDate,
      ExpirationDate,
      MemberAddress,
      DateOfBirth
    } = record;

    // ✅ Verification logic
    const isActive = (Status || "").toLowerCase() === "active";
    const storedDob = normalizeDate(DateOfBirth || "");
    const isDobOK = normalizeDate(dob) === storedDob;
    const isNameOK = true;

    let addressSimilarity = 0;
    let isAddressOK = false;

    if (address && MemberAddress) {
      addressSimilarity = stringSimilarity.compareTwoStrings(
        address.toLowerCase(),
        MemberAddress.toLowerCase()
      );
      isAddressOK = addressSimilarity >= 0.8;
    }

    console.log(`📏 Address similarity score: ${addressSimilarity.toFixed(2)}`);

    const isVerified = isActive && isNameOK && isDobOK && isAddressOK;

    console.log("🧮 Verification Breakdown:", {
      isActive,
      isNameOK,
      isDobOK,
      isAddressOK,
      addressSimilarity,
      finalStatus: isVerified ? "VERIFIED ✅" : "NOT VERIFIED ❌"
    });

    if (isVerified) {
      return sendVerificationResult(res, toolCallId, {
        status: "VERIFIED",
        plan_id: PlanName || null,
        effective_date: EffectiveDate || null,
        expiration_date: ExpirationDate || null
      });
    } else {
      return sendVerificationResult(res, toolCallId, {
        status: "NOT VERIFIED",
        reason: `Member not active or data mismatch. (Address similarity: ${(addressSimilarity * 100).toFixed(1)}%)`
      });
    }

  } catch (err) {
    console.error("❌ SQL/SP Execution Error:", err);
    return sendVerificationResult(res, toolCallId, {
      status: "NOT VERIFIED",
      error: err.message
    });
  } finally {
    console.log("🔒 Closing SQL connection...");
    await sql.close();
    console.log("✅ SQL connection closed.\n");
  }
});

// 📤 Response helper
function sendVerificationResult(res, toolCallId, result) {
  const responseBody = toolCallId
    ? { results: [{ toolCallId, result }] }
    : result;
  console.log("📤 Final API Response:", responseBody);
  return res.status(200).json(responseBody);
}

module.exports = router;
