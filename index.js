// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const schedule = require('node-schedule');
const birthdayChecker = require('./birthdayRoutine.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

const rule = new schedule.RecurrenceRule();
rule.hour = 9;
rule.minute = 0;
rule.second = 0;
rule.tz = 'Etc/UTC';
let job = schedule.scheduleJob(rule, async function() {
	const channel = client.channels.cache.get('Channel ID');
	let message = birthdayChecker.checkForBirthday();
	if (message != null) {
		await channel.send(message);
	}
  });

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);
