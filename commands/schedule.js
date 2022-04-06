const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Gets the schedule for the current season.'),
	async execute(interaction) {
        const RaceTable = await fetchSeasonSchedule();
        const embed = createEmbed(RaceTable);
        console.log("Sending embed");
		await interaction.reply({ embeds: [embed] });
	},
};

async function fetchSeasonSchedule() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }

    console.log("Sending request to F1 API");
    const response = await fetch('http://ergast.com/api/f1/2022.json', requestOptions);
    const data = await response.json();
    console.log("Response recieved");
    const { RaceTable } = data.MRData;

    return RaceTable
}

function createEmbed(RaceTable) {
    const { Races, season } = RaceTable
    const raceData = getRaceData(Races);

    console.log("Creating embed");
    const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(season + " SCHEDULE")
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/F1_logo.svg/2560px-F1_logo.svg.png')
        .addFields(
            { name: "Race", value: raceData.get('raceNames'), inline: true },
            { name: "Date", value: raceData.get('dates'), inline: true },
            { name: "Time (UTC)", value: raceData.get('times'), inline: true}
        )

    return embed;
}

function getRaceData(Races) {

    let raceNames = "";
    let dates = "";
    let times = "";
    let futureRaceCount = 0;

    //TODO add the country flag 
    for (const race of Races) {
        if (isFutureRace(race.date, race.time) && futureRaceCount < 1) {
            raceNames += '**' + race.round + '.  ' + race.raceName.replace('Grand Prix', 'GP') + '**\n';
            dates += '**' + race.date.replace('2021-', '') + '**\n';
            times += '**' + race.time.replace(':00Z', '') + "**  " + getEpochTimeStamp(race.date, race.time) + '\n';
            futureRaceCount++;
            continue;
        }
        raceNames += race.round + '.  ' + race.raceName.replace('Grand Prix', 'GP') + '\n';
        dates += race.date.replace('2021-', '') + '\n';
        times += race.time.replace(':00Z', '') + "  " + getEpochTimeStamp(race.date, race.time) + '\n';
    }
    const raceData = new Map();
    raceData.set('raceNames', raceNames);
    raceData.set('dates', dates);
    raceData.set('times', times);

    // console.log(raceNames);
    return raceData;
}

function getEpochTimeStamp(date, time) {
    return "<t:" + (Date.parse(date + " " + time) / 1000) + ":R>"
}

function isFutureRace(date, time) {
    const currentDateTime = Date.now();
    const raceDate = Date.parse(date + " " + time);
    return raceDate > currentDateTime;
}
