const config = require('../config.json');

module.exports = (function(config) {

	// Usercache - Used for saving when someone sent a selfpromo
	let lastmessage = {};

	function run(message,args) {

		// Rule out DMChannels.
		if(typeof message.channel === 'DMChannel' || typeof message.guild === undefined) {
			message.reply('This command can only be executed from the discord server. not in DM!');
			return;
		}

		// Set up the user in the cache if they dont exist.
		if(!lastmessage[message.author.id]) {
			lastmessage[message.author.id] = 0;
		}

		// Check the cooldown according to the config.
		if(new Date().getTime() - lastmessage[message.author.id] < config.cooldown*3600000) {
			message.reply('You\'re still on cooldown.');
			lastmessage[message.author.id] = new Date().getTime()
			message.delete();
			return;
		} else {
			let command = message.contents.replace(config.prefix + "selfpromo ", "");
			// Huge regex to check if the user sent a Twitch, Behance, YouTube or Mixer link.
			if(new RegExp('https://(www\.)?((twitch.tv/[a-zA-Z0-9_]+)|(youtube.com)|(watch\?v=[a-zA-Z\-\_0-9]{11})|(youtu.be/[a-zA-Z\-\_0-9]{11})|(mixer.com/[a-zA-Z0-9]+)|(behance.net/gallery/[0-9]+/[0-9a-zA-Z\-\_]+))').test(command) 
				// People found an exploit in here - To mitigate the bot mentioning everyone.
				&& command.indexOf("@everyone") < 0) {
				// Send message in the selfpromo channel
				message.guild.channels.get(config.channelid).send(`${message.author.tag}: ${args[0]}`);
				// Reply to make sure the user knows it succeeded.
				message.reply('sent');
				// Set their cooldown.
				lastmessage[message.author.id] = new Date().getTime();
				// Remove their message so it doesnt show their link somewhere else.
				message.delete();
			} else {
				// Failed regex, invalid link.
				message.reply('You\'re not allowed to send that');
				message.delete();
			}
		}
	}

	// Make the run function public.
	return {
		run: run,
	}
})(config);
