const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kettle')
		.setDescription('Is this a kettle?'),
	async execute(interaction) {
	    await interaction.reply('Is this a kettle?');
        await interaction.channel.send('https://media.discordapp.net/attachments/636478387665502218/880504814570733629/aye.png');
	},
};