const { SlashCommandBuilder } = require('@discordjs/builders');
const { bitlyToken, bitlyGUID } = require('../config.json');
const fetch = require('node-fetch');


//I would like to automate this command at some point


module.exports = {
	data: new SlashCommandBuilder()
		.setName('shortlink')
		.setDescription("Shortens a link if it's too big for you")
		.addStringOption(option =>
			option.setName('link')
			.setDescription('The arguments for the command')
			.setRequired(true)),
	async execute(interaction) {
		//generate the random number based on user input
		const link = interaction.options.getString('link');
        console.log(`Link to shorten: ${link}`);
		
		if (validURL(link)) {
            var shortLink = await shortenLink(link);
            console.log("Sending shortened link")
            await interaction.reply(shortLink);
        } 
        else {
            console.log("Invalid link received")
            await interaction.reply("Invalid URL");
        }
    }
}

function validURL(input) {
    //Uses the URL constructor to check if the URL is valid
    try { 
        return Boolean(new URL(input)); 
    }
    catch(e){ 
        return false; 
    }
    
}

// Uses the bit.ly API to shorten links
shortenLink = async function(link) {

    console.log("Sending shorten link request to bitly")
    let response = await fetch("https://api-ssl.bitly.com/v4/shorten", 
    {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${bitlyToken}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "long_url": link,
            "domain": "bit.ly",
            "group_guid": `${bitlyGUID}`
        })
    }).then(
        res => {
            return res.json()
        }
    )
    console.log("Response received")
    return response.link
}