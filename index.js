const TelegramBot= require('node-telegram-bot-api');
const dotenv=require('dotenv') // require('dotenv') returns an object 
const axios=require('axios');

dotenv.config(); //It goes to the root .env folder of the project parse the .env 
// and add all the key-value pairs to the os env files for the current session 

// console.log(process.env.BOT_TOKEN);

const bot = new TelegramBot(process.env.BOT_TOKEN,{polling:true});

// bot.on('message',(option)=>{
//     // console.log("Message received from telegram bot",option);
//     const chatid = option.chat.id;
//     // bot.sendMessage(chatid,"Hi, I am a telegram bot, tell me how can i help you?");
    
// })
bot.onText(/\/joke/, async (option) => {
    const chatid = option.chat.id;
  const response = await axios.get(
    "http://www.official-joke-api.appspot.com/random_joke",
  );
  console.log(response.data);

  const setup = response.data.setup;
  const punchline = response.data.punchline;

  bot.sendMessage(chatid, setup +'\n' +punchline);
});
