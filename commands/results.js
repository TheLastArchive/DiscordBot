const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { emojis } = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('results')
		.setDescription('Gets the results from the previous Grand Prix'),
	async execute(interaction) {
        const RaceTable = await fetchRaceResults();
        const embed = await createEmbed(RaceTable);
        console.log("Sending embed");
		await interaction.reply({ embeds: [embed] });
	},
};

async function fetchRaceResults() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    console.log("Sending request to F1 API");
    const response = await fetch('https://ergast.com/api/f1/current/last/results.json', requestOptions);
    const responseJSON = await response.json();
	console.log("Response recieved");
	// console.log(responseJSON);
    return responseJSON.MRData.RaceTable;
}

async function createEmbed(RaceTable) {

    const Races = RaceTable.Races;
    const Results = Races[0].Results;
    const raceData = await getRaceData(Results);
    const { raceName } = Races[0];
    console.log("Creating embed");
    const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(raceName.toUpperCase() + " RESULTS")
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/F1_logo.svg/2560px-F1_logo.svg.png')
        .addFields(
            { name: "Positions", value: raceData.get('positions'), inline: true },
			{ name: "Team", value: raceData.get("teams"), inline: true },
            { name: "Time", value: raceData.get('times'), inline: true }
        )
		.addFields(
			{ name: "Fastest Lap", value: raceData.get('fastestDriver') + " " + raceData.get('fastestLap') }
		)

    return embed;
}

async function getRaceData(Results) {

	// console.log(Results);
	let drivers = "";
	let teams = "";
	let times = "";
	let fastestLap = "";
	let fastestDriver = "";
	let emoji = new Map(Object.entries(emojis));

	for (const driver of Results) {
		drivers += padEndSpace(driver.position + '.', 4) + 
			" **" + driver.Driver.code + " " + emoji.get(driver.Driver.nationality) + "**\n";
			teams += driver.Constructor.name + " " + 
			emoji.get(driver.Constructor.constructorId) + "\n";

		if (driver.status === 'Finished') 
			times += padStartSpace(driver.Time.time, 11) + "\n";
		else if (driver.status.includes("+")) 
			times += padStartSpace(driver.status, 11) + "\n";
		else 
			times += padStartSpace('DNF', 11) + "\n";
		//set fastest lap
		//Using a try catch incase fastest lap is undefined due to a DNF on the first lap
		try {
			if (driver.FastestLap.rank === "1") {
				console.log(driver.FastestLap.rank);
				fastestLap = driver.FastestLap.Time.time;
				fastestDriver = driver.Driver.givenName + " " + driver.Driver.familyName;
			}
		} catch (TypeError) {
			continue;
		}
	}
	let raceData = new Map();
	raceData.set("positions", drivers);
	raceData.set("times", times);
	raceData.set("teams", teams);
	raceData.set("fastestLap", fastestLap);
	raceData.set("fastestDriver", fastestDriver);

    return raceData;
}

function padStartSpace(input, size) {
	return '\u200B '.repeat(size - input.length) + input;
}

function padEndSpace(input, size) {
	return input + ' '.repeat(size);
}
