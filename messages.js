/*
 * This module envelops functions r/t parsing through chat messages in order to delegate functions.
 * It is called by the TMI.js server created in server.js
 */

// Imports:
import { server } from "./server.js";
import nlp from "compromise";
// import { handleChannelCommand } from "./commands/commands.js";
import apiData from "./data/api.json" assert { type: "json" };

export default function delegateMessage(channel, tags, message, self) {
  if (self == true) {
    return;
  }

  console.log(`message starts with ${message[0]}`);

  switch (message[0]) {
    case "/":
      return;
    case ".":
      return;
    case ";":
      return;
    case "!":
      handleChannelCommand(channel, tags, message, self);
      break;
    case "@":
      return;
    default:
      checkForKeyWordMessage(channel, tags, message, self);
      break;
  }
  return;
}

// commmands['man'].exe(contextObj)
const commands = {
  man: {
    exe: (contextObj) => {
      if (contextObj.args.length === 0) {
        server.say(
          apiData.Bot.CHANNEL,
          `Sorry @${contextObj.tags["display-name"]}, @${apiData.Bot.STREAMER_NICK} already has a man
          :( Try again?`
        );
      }
      server.say(
        apiData.Bot.CHANNEL,
        `${commands[contextObj.args[0]].manual()}`
      );
    },
    manual: () => {
      return "Get the manual on any command. Syntax: !man <command>";
    },
    aliases: () => [],
  },
  male: {
    exe: (contextObj) => {
      server.say(apiData.Bot.CHANNEL, "BORK! BORK! BORK!");
    },
    manual: () => {
      return "Syntax: BORK BORK BORK!!";
    },
    aliases: () => ["mail"],
  },
  claw: {
    exe: (context) => {
      server.say(
        apiData.Bot.CHANNEL,
        " If you think you like the Trash Heap, you're gonna love the Claw! --> https://www.theclaw.team <-- We code, we build stuff, we love tech!"
      );
    },
    manual: () => {
      return "Find out about the Claw stream team!";
    },
    aliases: () => [],
  },
  lurk: {
    exe: (context) => {
      server.say(
        apiData.Bot.CHANNEL,
        `Puppies are such a handful... @${context.tags["display-name"]} has gone to eat some flooring! At least it'll tire them out.`
      );
    },
    manual: () => {
      return "Syntax: !lurk";
    },
    aliases: () => [],
  },
  unlurk: {
    exe: (context) => {
      server.say(
        apiData.Bot.CHANNEL,
        `@${context.tags["display-name"]} has returned from chewing up the floor. Hope you're feeling happy and full @${context.tags["display-name"]}!`
      );
    },
    manual: () => {
      return "Syntax: !unlurk";
    },
    aliases: () => [],
  },
  kata: {
    exe: (con) => {
      server.say(
        apiData.Bot.CHANNEL,
        "This is the kata we're doing right now --> https://www.codewars.com/kata/5648b12ce68d9daa6b000099/train/go"
      );
    },
    manual: () => {
      return "Get the current Codewars kata. Syntax: !kata";
    },
    aliases: () => [],
  },
  clan: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Join our Codewars clan! Go to: Codewars --> Account Settings --> Clan --> then type in 'TrshPuppies'."
      );
    },
    manual: () => {
      return "Get instructions to join the TrashPuppies Codewars clan. Syntax: !clan";
    },
    aliases: () => [],
  },
  mom: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Check out my spooky podcast which I co-host with my cousin! --> https://www.twitch.tv/hauntzncreepz --> https://open.spotify.com/show/7hcpFnIoWhveRQeNRTNpbM"
      );
    },
    manual: () => {
      return "Find out about my podcast. Syntax: !hnc";
    },
    aliases: () => ["bigdog"],
  },
  music: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "We're listening to some tasty lofi from Chillhop --> https://chillhop.com"
      );
    },
    manual: () => {
      return "Want to know what we're listening to? Syntax: !music";
    },
    aliases: () => ["song", "playlist"],
  },
  project: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Today we're working on @trsh_bot --> https://github.com/trshpuppy/trsh_bot"
      );
    },
    manual: () => {
      return "Find out what we're working on today. Syntax: !project";
    },
    aliases: () => ["today"],
  },
  about: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        `Hey ${c.tags["display-name"]}! Welcome to my trash heap! TP is a former ER nurse
      learning coding and cybersecurity. All you really need to know is the struggle is real, everything IS
      in fact on fire, and you're welcome to chill as long as you like :)`
      );
    },
    manual: () => {
      return "Find out about TP. Syntax: !about";
    },
    aliases: () => ["whoami"],
  },
  theme: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        `TP is using the Vibrancy Continued Extension in VSCode.
      You can check it out here --> https://github.com/illixion/vscode-vibrancy-continued`
      );
    },
    manual: () => {
      return "Find out about TP's VSCode theme";
    },
    aliases: () => [],
  },
  yt: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Checkout my newest YT video: 'My 1st Tech Interview was for a Senior Position'! --> https://www.youtube.com/watch?v=V1MkBvpD-xw"
      );
    },
    manual: () => {
      return "Find out about my latest YouTube video.";
    },
    aliases: () => ["youtube"],
  },
};

function handleChannelCommand(channel, tags, message, self) {
  // get the name of the command to access it in the commands obj:
  let args = message.split(" ");
  let command = args.shift();
  command = command.split("");
  command.shift();
  command = command.join("").toLowerCase();

  let context = {
    channel,
    tags,
    args,
    self,
  };

  console.log("command= " + command + "command type = " + typeof command);

  try {
    commands[command].exe(context);
  } catch (e) {
    for (const [ky, val] of Object.entries(commands)) {
      const als = val["aliases"]();
      let found = als.findIndex((x) => x == command);
      if (found !== -1) {
        commands[ky].exe(context);
        return;
      }
    }
    server.say(
      apiData.Bot.CHANNEL,
      `Sorry @${tags["display-name"]}, that command doesn't exist :(`
    );
  }
}

// Module globals:
// let Fred = new Date(0); // lastKeywordTime
// let keywordLessMessages = 0;

// /*
//  * Called from server.js, the parameters are given to us by the TMI.js server:
//  */
// export default function delegateMessage(channel, context, message) {
//   message = message.trim();

//   // Sanitize the message:
//   if (message[0] === "/" || message[0] === ".") {
//     return;
//   }

//   // Make sure the bot isn't responding to its own messages.
//   if (context.username === server.username) {
//     return;
//   }

//   /*
//    * After sanitizing and making sure this is an actual chatter's
//    * message, we handle what type of message it is. The different
//    * handled types are:
//    *   - 'botSummons': a chatter has '@' the bot
//    *   - command: a chatter has used the `!` command prefix
//    *   - other messages: messages which aren't a bot summons or a
//    *                     command are sent to 'handleKeywordMessages'
//    *                     where the bot decides whether or not to
//    *                     take the chatter's message, change a
//    *                     random word to its keyword and
//    *                     repost the edited message in chat (think
//    *                     buttsbot).
//    */

//   // botSummons:
//   const botSummons = `@${apiData.Bot.BOT_USERNAME}`;
//   const messageArr = message.split(" ");
//   if (messageArr[0].toLowerCase() === botSummons.toLowerCase()) {
//     // Calls a function from /commands/BotCommands.js
//     handleBotSummons(channel, context, message);
//     return;
//   }

//   // command:
//   if (message[0] === "!") {
//     // Calls a function from commands.js
//     handleChannelCommand(channel, context, message);
//     //ifThisDoesntWorkItsStevesFault(channel, context, message);
//     return;
//   }

//   // regular chat message:
//   handleKeywordMessages(channel, context, message);
// }

// function handleKeywordMessages(channel, context, message) {
//   /* If we have a regular message: make sure we aren't:
//    */

//   // 1) harrassing a first time chatter with our bot:
//   if (context[`first-msg`] === true) {
//     return;
//   }
//   // 2) responding to the chat message of another bot:
//   if (context.username === "streamlabs") {
//     return;
//   }

//   /*
//   * Keyword messages (chat messages trsh_bot takes and edits a random word
//   to the key word in data/api.json and re-posts to chat) happen every
//   20 chat messages && every 5 minutes. Both have to be true for
//   trsh_bot to do this.
//   */

//   // How many regular chat messages have there been since the last time we changed one?
//   keywordLessMessages += 1;

//   // How many seconds have passed since the last time we changed a message?
//   const secondsFromLastKeyword = (new Date() - Fred) / 1000;

//   // If it's been 20 messages && 5 minutes, call the function which changes the message & reset the timer & message count:
//   if (secondsFromLastKeyword >= 300 && keywordLessMessages >= 20) {
//     // Only reset the conditions if keywordQ300 is actually able to change and post a message:
//     if (keywordQ300(channel, context, message)) {
//       Fred = new Date();
//       keywordLessMessages = 0;
//     }
//   }
// }

// // This is the function which actually takes the chat message, edits it, and re-posts it as the chat bot:
// function keywordQ300(channel, context, message) {
//   // Make sure we're not re-posting a super long chat message, or a super short one:
//   const wordCount = message.split(" ").length;
//   if (wordCount === 1 || wordCount >= 20) {
//     return false;
//   }

//   /*
//    * We're using compromise js to pick which word to change and how to change it.
//    * We want to change a noun in the original message, and we want to preserve
//    * whether it was singular or plural. data/api.json has options for both a
//    * simgular and plural versions of the keyword.
//    *   i.e. if the keyword is "kitten", then our options are "kitten" and "kittens"
//    */
//   const doc = nlp(message);
//   if (!doc.has("#Noun")) {
//     return false;
//   }

//   let randomNoun = doc.nouns().random();

//   while (randomNoun.terms().length > 1) {
//     randomNoun = randomNoun.terms().nouns().random();
//   }

//   // Here is the replacement using data/api.json:
//   if (randomNoun.isPlural().length > 0) {
//     randomNoun.replaceWith(apiData.Bot.KEYWORD_PLURAL);
//   } else {
//     randomNoun.replaceWith(apiData.Bot.KEYWORD_SINGULAR);
//   }

//   // Here is trsh_bot reposting the changed message to chat:
//   server.say(apiData.Bot.CHANNEL, doc.text());
//   return true;
// }

// /*
//  * Here is an example of what TMI.js gives us when its "message" event handler fires off:
//  * See the delegateMessage() function at the top of this module, but simply:
//  * this is an array containing the ["channel", context{}, "messge"].
//  * The context object is the most useful as you can use the info in it to
//  * navigate how the bot responds to the message.
//  *
//  * [
//  *  '#trshpuppy',
//  *  {
//  *    'badge-info': { subscriber: '4' },
//  *    badges: { broadcaster: '1', subscriber: '3000' },
//  *    'client-nonce': 'x',
//  *    color: '#8A2BE2',
//  *    'display-name': 'TrshPuppy',
//  *    emotes: null,
//  *    'first-msg': false,
//  *    flags: null,
//  *    id: 'x-x-x',
//  *   mod: false,
//  *  'returning-chatter': false,
//  *    'room-id': 'x',
//  *    subscriber: true,
//  *    'tmi-sent-ts': 'x',
//  *    turbo: false,
//  *    'user-id': 'x',
//  *    'user-type': null,
//  *    'emotes-raw': null,
//  *    'badge-info-raw': 'subscriber/4',
//  *    'badges-raw': 'broadcaster/1,subscriber/3000',
//  *    username: 'trshpuppy',
//  *    'message-type': 'chat'
//  *  },
//  *  'tiddies'
//  *
