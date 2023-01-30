
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const https = require("https");
const bodyparser = require("body-parser");

//require('dotenv').config();

const API_KEY = '5964975012:AAE49O1SbjWQ29MVtaSNPVW_QFPeXk_TZgk';
const whether_key = 'fae85b12f8f194b0a61db399efa7c4d0';
// const API_KEY = process.env.API_KEY;
// const whether_key = process.env.whether_api;

const bot = new TelegramBot(API_KEY, {polling: true});

let myInterval = null;
let check = false;

function tellTime(msg){
  chatId = msg.chat.id ;

  // this function will find out temperature in Delhi and print it via sendMessage function to a specified chatID
  let date = new Date();
  let hours = date.getHours();
  let minutes= date.getMinutes();
  let temp = null ;

  const url = "https://api.openweathermap.org/data/2.5/weather?q=delhi"+"&appid="+whether_key+"&units=metric" ;
  https.get(url,(response)=>{
        console.log(response.statusCode)
        response.on("data",function(data){
            const whetherdata=  JSON.parse(data);
            temp = whetherdata.main.temp ; 
            // console.log(temp);

            
            message = "The temperature in Delhi at time :"+hours+":"+minutes+" is :"+temp+" Degrees"
            bot.sendMessage(chatId,message)
        })
  });

//   message = "The temperature in Delhi at time :"+hours+":"+minutes+" is :"+temp+" Degrees"
//   bot.sendMessage(chatId,message)
}
let check2 = false;
bot.on('message', (msg) => {
  const chatId = msg.chat.id; 
  console.log(chatId)

  if(check2 == false){
    const msg = "This bot will tell temperature of delhi every hour . To stop its working please type command :/stop or stop" ; 
    bot.sendMessage(chatId,msg);
    check2 = true;
  }

  if(msg.text == "/stop" || msg.text == "stop"){
    clearTimeout(myInterval);
    myInterval = null;
}
else{
    if (!myInterval) {
        if(check === false){
            tellTime(msg);
            check = true ;
            myInterval = setInterval(tellTime, 3600000, msg);
        }
        else{
            myInterval = setInterval(tellTime, 3600000, msg);
        }
    }
}
});

bot.on("polling_error", console.log);



