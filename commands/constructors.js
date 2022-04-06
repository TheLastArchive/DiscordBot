const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { emojis } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('constructors')
		.setDescription('Displays the constructors standings for the current season.'),
	async execute(interaction) {
        const StandingsTable = await fetchConResults();
        const embed = await createEmbed(StandingsTable);
        console.log("Sending embed...");
		await interaction.reply({ embeds: [embed] });
	},
};

async function fetchConResults() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    console.log("Sending request to F1 API...");
    const response = await fetch('https://ergast.com/api/f1/current/constructorStandings.json', requestOptions);
    const data = await response.json();
    console.log("Response recieved!");
    const { StandingsTable } = data.MRData;

    return StandingsTable
}

async function createEmbed(StandingsTable) {

    const StandingsLists = StandingsTable.StandingsLists;
    const ConstructorStandings = StandingsLists[0].ConstructorStandings;
    const ConData = await getConData(ConstructorStandings);

    const { season } = StandingsTable;
    const { round } = StandingsTable.StandingsLists[0];
    console.log("Creating embed...");
    const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(season + " CONSTRUCTORS STANDINGS")
        .setDescription("As of round " + round)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/F1_logo.svg/2560px-F1_logo.svg.png')
        .addFields(
            { name: "Constructor", value: ConData.get('names'), inline: true },
            { name: "Points", value: ConData.get('points'), inline: true},
        )

        return embed;
}

async function getConData(ConstructorStandings) {
   
    let name = "";
    let points = "";

    let emoji = new Map
    (Object.entries(emojis));

    for (const Constructors of ConstructorStandings) {
        name += Constructors.position + ". " + Constructors.Constructor.name + " " + emoji.get(Constructors.Constructor.constructorId) + "\n";
        points += Constructors.points + "\n";
    }

    let ConData = new Map();
    ConData.set('names', name);
    ConData.set('points', points);

    return ConData;

}



