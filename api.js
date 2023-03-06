// This module handles automating the OAuth2 token and refresh token
import fetch from "node-fetch";
import apiData from "./data/api.json" assert { type: "json" };
import * as fs from "fs";

export default async function checkOAuthStatus() {
  // if (isOAuthExpired()) {
  //   await test;
  // }
  // return;
  if (isOAuthExpired()) {
    // If Oauth is due to expire OR OAuth returns a 404, then:
    refreshOAuth();
  }
  return;
}

// const test = new Promise((res, rej) => {
//   res(refreshOAuth()).then(checkOAuthStatus());
// });

function isOAuthExpired() {
  const currentTime = new Date() / 1000; // in seconds
  const lastRefreshTime = apiData.LAST_REFRESH;

  // Check to see if the currentTime is within 5 minutes of the expiration or over:
  if (currentTime - lastRefreshTime >= apiData.OA_EXPIRE - 300) {
    console.log("OAuth is expired");
    return true;
  }
  console.log("OAuth is not expired");
  return false;
}

function refreshOAuth() {
  // When OAuth is expired && this function called, build fetch URL:
  const TWITCH_REFRESH_URL = `https://id.twitch.tv/oauth2/token`;

  // Fetch new OAuth token:
  fetch(TWITCH_REFRESH_URL, {
    method: "POST",
    body: `client_id=${apiData.CLIENT_ID}&client_secret=${apiData.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${apiData.REFRESH_TOKEN}`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(checkRefreshResponse)
    .catch((error) => console.log(`error during fetch = ${error}`));

  // Check response for failure OR update JSON:
  function checkRefreshResponse(response) {
    if (response.message === `Invalid refresh token`) {
      getNewRefreshToken();
    } else {
      updateJSON(response);
    }
  }
  return;
}

function updateJSON(response) {
  // Update values in JSON object w/ values from API response:
  apiData.OA_TOKEN = response.access_token;
  apiData.OA_EXPIRE = response.expires_in;
  apiData.LAST_REFRESH = new Date() / 1000; // in seconds

  const JSONObj = JSON.stringify(apiData);
  const targetFile = "./data/api.json";

  // Overwrite api.json w/ updated JSON Object:
  fs.writeFile(targetFile, JSONObj, "utf-8", (error) => {
    if (error) {
      console.log(
        "Error, failed to write new data to api.json. JSON not updated."
      );
      return;
    }
    console.log("Successfully wrote new data to api.json file!");
  });

  return;
}

function getNewRefreshToken() {
  console.log(
    "Need new Refresh Token :(. Not able to refresh token at this time."
  );
}
