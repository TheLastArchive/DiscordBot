const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coin')
		.setDescription('Flips a coin'),
	async execute(interaction) {
		await interaction.reply(flipCoin());
	},
};

function flipCoin() {
    const number = Math.floor(Math.random() * 6000 + 1);
    if (number === 69) 
        return "The coin has landed on it's side.";
    else if (number % 2 === 0) 
        return "The coin landed on heads.";
    else 
        return "The coin landed on tails.";
}