const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { emojis } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drivers')
        .setDescription('Displays the drivers standings for the current season.'),
    async execute(interaction) {
        const StandingsTable = await fetchDriverResults();
        const embed = await createEmbed(StandingsTable);
        console.log("Sending embed...");
        await interaction.reply({ embeds: [embed] });
    },
};

    async function fetchDriverResults() {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }

        console.log("Sending request to F1 API...");
        const response = await fetch('https://ergast.com/api/f1/current/driverstandings.json', requestOptions);
        const data = await response.json();
        console.log("Response recieved!");
        const { StandingsTable } = data.MRData;

        return StandingsTable
    }

async function createEmbed(StandingsTable) {

    const StandingsLists = StandingsTable.StandingsLists;
    const DriverStandings = StandingsLists[0].DriverStandings;
    const DriverData = await getDriverData(DriverStandings);

    const { season } = StandingsTable;
    const { round } = StandingsTable.StandingsLists[0];
    console.log("Creating embed...");
    const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(season + " DRIVERS STANDINGS")
        .setDescription("As of round " + round)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/F1_logo.svg/2560px-F1_logo.svg.png')
        .addFields(
            { name: "Drivers", value: DriverData.get('names'), inline: true },
            { name: "Teams", value: DriverData.get('teams'), inline: true },
            { name: "Points", value: DriverData.get('points'), inline: true },
        )

        return embed;
}

async function getDriverData(DriverStandings) {

    let name = "";
    let team = "";
    let points = "";

    let emoji = new Map
    (Object.entries(emojis));

    for (const Drivers of DriverStandings) {
        name += Drivers.position + ". **" + Drivers.Driver.code + " " + emoji.get(Drivers.Driver.nationality)+ "**\n";
        team += Drivers.Constructors[0].name + " " + emoji.get(Drivers.Constructors[0].constructorId) + "\n";
        points += Drivers.points + "\n";
    }
        let DriverData = new Map();
        DriverData.set('names', name);
        DriverData.set('teams', team);
        DriverData.set('points', points);

        return DriverData;
    

}
