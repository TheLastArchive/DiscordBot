const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('awake')
		.setDescription('First thing in the morning.'),
	async execute(interaction) {
		await interaction.reply('https://cdn.discordapp.com/emojis/900367315969921104.png?size=96');
	},
};