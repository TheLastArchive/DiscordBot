const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Chooses a random option from a group of choices')
		.addStringOption(option =>
			option.setName('input')
			.setDescription('The arguments for the command')
			.setRequired(true)),
	async execute(interaction) {
		const options = interaction.options.getString('input');
		const choice = getRandomChoice(options).trim();
		await interaction.reply('**From:** ' + options + '\n' +
		'**I have chosen:** ' + choice)},
};

function getRandomChoice(args) {
	const options = args.split("|");
	return options[Math.floor(Math.random() * options.length)];
}