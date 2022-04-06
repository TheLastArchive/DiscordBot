const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lenny')
		.setDescription('( ͡° ͜ʖ ͡°)'),
	async execute(interaction) {
		await interaction.reply('( ͡° ͜ʖ ͡°)');
	},
};