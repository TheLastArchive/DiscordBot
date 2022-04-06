const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomnumber')
		.setDescription('Generates a random number between 1 and a number of your choosing!')
		.addStringOption(option =>
			option.setName('input')
			.setDescription('The arguments for the command')
			.setRequired(true)),
	async execute(interaction) {
		//generate the random number based on user input

		const options = interaction.options.getString('input');
		
		if (isNaN(options)) {
			await interaction.reply(options + " is not a number");
			return;
		}

		
    	const random = Math.floor(Math.random() * options) + 1;
		await interaction.reply('**Between** 1 & ' + String(options) + '\n' +
		'**I have chosen:** ' + String(random));
		
	},
};
