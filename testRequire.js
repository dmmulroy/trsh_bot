// Imports createRequire from module using Node, and create the require method:
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Require sqlite3 and create database (liljiblets):
const sqlite3 = require("sqlite3").verbose();
const liljiblets = new sqlite3.Database("./data/test.db");

export default function addPrompt(promptObj) {
  liljiblets.serialize(() => {
    const stmnt = liljiblets.prepare(
      "INSERT INTO prompts (time, prompt, author, completed) VALUES (?,?,?,?)"
    );

    // Insert new prompt into database:
    stmnt.run(promptObj.time, promptObj.prompt, promptObj.author, 2);
  });
  return true;
}

export function getPromptFromDB() {
  liljiblets.serialize(() => {
    const s =
      "SELECT rowid, prompt, author FROM prompts WHERE completed = 2 ORDER BY time ASC LIMIT 1";

    liljiblets.each(s, (err, item) => {
      if (err) {
        console.log("ERROR getting prompt from DB: " + err);
        return;
      }
      console.log(item);
    });
  });
}

export function createPromptDB() {
  liljiblets.serialize(() => {
    liljiblets.run(
      "CREATE TABLE IF NOT EXISTS prompts (time INT, prompt TEXT, author TEXT, completed INT)"
    );
  });
}

// function createTestData(data) {
//   liljiblets.serialize(() => {
//     liljiblets.run(
//       "CREATE TABLE IF NOT EXISTS prompts (time INT, prompt TEXT, author TEXT, completed INT)"
//     );

//     let stmt = liljiblets.prepare(
//       "INSERT INTO prompts (time, prompt, author, completed) VALUES (?,?,?,?)"
//     );

//     for (p of data) {
//       time = p.time;
//       author = p.author;
//       IM_A_BIG_OL_CHICKEN = p.prompt;
//       completed = p.completed;

//       stmt.run(time, IM_A_BIG_OL_CHICKEN, author, completed);
//     }

//     stmt.finalize();

//     liljiblets.each("SELECT * FROM prompts ORDER BY time ASC", (err, item) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(item);
//     });
//   });
// }

// function deezNuts() {
//   liljiblets.serialize(() => {
//     const s =
//       "SELECT rowid, prompt, author FROM prompts WHERE completed = 2 ORDER BY time ASC LIMIT 1";

//     liljiblets.each(s, (err, item) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log(item.prompt);
//       markPromptCompleted(item.rowid);
//     });
//   });
// }

// import sqlite3 from "sqlite3";
// sqlite3.verbose();

// export const liljiblets = new sqlite3.Database(
//   "./sqltest/test-db/test-db-2.db"
// );

// console.log(liljiblets);