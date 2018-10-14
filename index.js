//const botconfig = require("./botconfig.json");
//const tokenfile = require("./token.json");

const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
var CooldownInS = 5;
var lastPoster = "-1";
var secondLastPoster = "0";
var collectionString = "";

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("#circlejerk");
});

bot.on("message", async message => {
    //sniggleboots and gweedo can DM the bot to stop it or change the personal cooldown

    if(message.channel.type == "dm" && (message.author.id == "220289568165855242" || message.author.id == "121044023765893121"))
    {
        if(message.content === "stop" || message.content === "quit")
        {
            console.log(`bot halted by ${message.author.username}.`);
            message.channel.send("Shutting down.")
            bot.destroy();
        }else
        {
            /*
	    let newCooldown = parseInt(message.content,10);
            if(newCooldown >= 1 && newCooldown < 3600)
            {
                console.log(`cooldown changed to ` + newCooldown + ` by ${message.author.username}.`);
                CooldownInS = newCooldown;
                message.channel.send("Cooldown set to " + newCooldown + "seconds.");
	    */
            }
        }
    }

    /*
    first, check if this only happens in the circlejerk channel, to avoid shenanigans if the bot ever gains permissions anywhere else - which it shouldn't
    then, check whether the posted message has more than one word, or if it's a double post
    if yes: delete it
    if no: disallow posting in the channel for everyone, then set a timer that allows posting after CooldownInS seconds
    */

    if(message.channel.name === "circlejerk")
    {
        //split the message by spaces
        var splitmessage = message.content.split(" ");
        //if a second part exists, it means there was a space and the message should be deleted, unless it is a message by the bot.
        if((splitmessage[1] || message.author.id == lastPoster) && message.author.id !== "496280185193365505")
        {
            message.delete(0);
            console.log(`deleted message by ${message.author.username}`+`#${message.author.discriminator}.`);
        }else
        {
            //set post permission to false for message author, unless author is the bot
	    /*
            if(message.author.id !== "496280185193365505")
            {
                message.channel.overwritePermissions(message.author, {'SEND_MESSAGES':false},);
            }
	    */

            lastPoster = message.author.id;
            console.log(`accepted message by ${message.author.username}`+`#${message.author.discriminator}.`);

            //after COOLDOWN minutes, set post permission to true for message author, unless author is the bot. Doesn't really matter if it's the bot in this case, it's just to keep the log clean.
	    /*
            if(message.author.id !== "496280185193365505")
            {
                setTimeout(function(){ 
                    message.channel.overwritePermissions(message.author, {'SEND_MESSAGES':true},); 
                    console.log(`reset posting permissions for ${message.author.username}`+`#${message.author.discriminator}.`);
                }, 1000 * CooldownInS);
            }
	    */

            collectionString += " ";
            collectionString += message.content;

            if(message.content.slice(-1) == "?" || message.content.slice(-1) == "." || message.content.slice(-1) == "!"){
                if(message.author.id !== "496280185193365505"){
                    secondLastPoster = lastPoster;
                    message.channel.send(collectionString);
                }
                collectionString = "";
                lastPoster = secondLastPoster;
            }
        }
    }
});

bot.login(process.ENV.token);
