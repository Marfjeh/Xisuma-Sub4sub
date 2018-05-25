const Discord = require('discord.js'),
	config = require('./config.json');

let bot = new Discord.Client(),
	fs = require('fs'),
	modules;

bot.login(config.token);

bot.on('ready', function() {
	console.log('Logged on as ' + bot.user.tag);
	commandcache();
	bot.user.setPresence({game:{name:"Use :selfpromo <link>"}});
});

let commandcache = function() {
	let mkcache = function() {
		let commands = [];
		fs.readdir('./commands/', function(err,files){
			if(err) throw err;
			files.forEach(function(file, index) {
				console.log('Loaded command: ' + file.replace('.js', ''));
				commands[file.replace('.js', '')] = require('./commands/' + file);
			});
		});
		return commandcache['commands'] = commands;
	}
	return this['commands'] != undefined ? this['commands'] : botcommands = mkcache(); 
}

bot.on('message', function(msg) {
	if(msg.content.startsWith(config.prefix) && !msg.author.bot) {
        const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if(typeof botcommands[command] != "undefined") {
            botcommands[command].run(msg,args);
        }
    }
})
