const config = require('../config.json');

module.exports = (function(config) {

	let lastmessage = {};

	function run(message,args) {
		if(typeof message.channel === 'DMChannel' || typeof message.guild === null) {
			message.reply('This command can only be executed from the discord server. not in DM!');
			return;
		}
		if(!lastmessage[message.author.id]) {
			lastmessage[message.author.id] = 0;
		}
		if(new Date().getTime() - lastmessage[message.author.id] < config.cooldown*3600000) {
			message.reply('You\'re still on cooldown.');
			lastmessage[message.author.id] = new Date().getTime()
			message.delete();
			return;
		} else {
			let command = message.contents.replace(config.prefix + "selfpromo ", "");
			if(new RegExp('https://(www.)?(youtube.com/(watch\?v=[a-zA-Z\-\_0-9]{11}|channel/[a-zA-Z\-\_0-9]{24}|user/[a-zA-Z\-\_0-9]+(/videos|/playlists|/channels|/featured)?)|youtu.be/[a-zA-Z\-\_0-9]{11}|mixer.com/[a-zA-Z\-\_0-9]+|twitch.tv/[a-zA-Z\-\_0-9]+)(\ .*?)').test(command) 
				&& command.indexOf("@everyone") < 0) {
				message.guild.channels.get(config.channelid).send(`${message.author.tag}: ${args[0]}`);
				message.reply('sent');
				lastmessage[message.author.id] = new Date().getTime();
				message.delete();
			} else {
				message.reply('You\'re not allowed to send that');
				message.delete();
			}
		}
	}

	return {
		run: run,
	}
})(config);
