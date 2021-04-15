module.exports = (msg, args) => {
    if(args.length === 0){
        return msg.reply(msg.author.displayAvatarURL());
    }
	const avatarList = msg.mentions.users.map(user => {
		return `${user.username}'s avatar : <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
	});
    msg.channel.send(avatarList);
}