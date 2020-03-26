const Discord = require("discord.js")
const bot = new Discord.Client({disableEveryone: true})
const gweedoId = "121044023765893121"
const sniggleId = "220289568165855242"
const botId = "496280185193365505"
const channelId = "498890427257061397"
global.channel
var messages
var CooldownInS = 5
var lastPoster = "-1"
var secondLastPoster = "0"
var collectionString = ""


bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`)
    bot.user.setActivity("#circlejerk")
    channel = bot.channels.get(channelId)
    channel.send("Bot Ready")
})


bot.on("message", async message => {
   
    //On DM event. Checks for Gweedo or Sniggle as sender
    if(message.channel.type == "dm" && (message.author.id == sniggleId || message.author.id == gweedoId))
    {
        if(message.content === "stop" || message.content === "quit")
        {
            console.log(`bot halted by ${message.author.username}.`)
            message.channel.send("Shutting down.")
            bot.destroy()
        }
    }

    /*
    1st Check if message in channel named circlejerk
    2nd Check if message is double post or more than one word and delete, else post it
    */

    if(message.channel.name === "circlejerk")
    {
        /*
            If most recent message sent is "Bot Ready" and is sent by the bot, load previous messages and then 
            delete the "Bot Ready" message.
        */
        if(message.content === "Bot Ready" && message.author.id === botId)
        {
                messages = await message.channel.fetchMessages()
                messages.array()
                msgArray = messages._array

                var userMsgArray = []
                var i = 1 //Increment should start at 1 since the first message in array should always be the bot.
                
                while(msgArray[i].author.id !== botId) //Could become an infinite loop if there are no bot messages in the past 50 messages.
                {
                    userMsgArray[i - 1] = msgArray[i] //Create an array of user messages until there was a bot message.
                    i++
                }

                //Rebuild the collectiong string from the end of the user message array
                var j = userMsgArray.length - 1
                while(j + 1 != 0)
                {
                        if (j != 0)
                        {
                            collectionString += userMsgArray[j] + " "
                        }
                        else
                        {
                            collectionString += userMsgArray[j]
                        }
                    j--
                }

                message.delete(3000)
                .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                .catch(console.error)
        }
        else
        {
            //split the message by spaces
            var splitmessage = message.content.split(" ")
            //if a second part exists, it means there was a space and the message should be deleted, unless it is a message by the bot.
            if((splitmessage[1] || message.author.id == lastPoster) && message.author.id !== botId)
            {
                message.delete(0)
                console.log(`deleted message by ${message.author.username}`+`#${message.author.discriminator}.`)
            }
            else
            {
                var slicedString = message.content.slice(-1)
                lastPoster = message.author.id
                console.log(`accepted message by ${message.author.username}`+`#${message.author.discriminator}.`)
                switch (slicedString)
                {
                    case "!":
                    case ".":
                    case "?":
                        collectionString += message.content

                        if(message.author.id !== botId){
                            secondLastPoster = lastPoster
                            message.channel.send(collectionString)
                        }

                        collectionString = ""
                        lastPoster = secondLastPoster
                        break
                    default:
                        collectionString += " "
                        collectionString += message.content       
                }
            }
        }
    }

})
bot.login(process.env.token)