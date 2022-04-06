const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

const subURLs = [
    'https://www.reddit.com/r/dogpictures.json?sort=top&t=week',
    'https://www.reddit.com/r/blop.json?sort=top&t=week',
    'https://www.reddit.com/r/pitbulls.json?sort=top&t=week',
    'https://www.reddit.com/r/rottweiler.json?sort=top&t=week',
    'https://www.reddit.com/r/rarepuppers.json?sort=top&t=week',
    'https://www.reddit.com/r/goldenretrievers.json?sort=top&t=week',
    'https://www.reddit.com/r/bernesemountaindogs.json?sort=top&t=week',
    'https://www.reddit.com/r/germanshepherds.json?sort=top&t=week',
    'https://www.reddit.com/r/woof_irl.json?sort=top&t=week',
    'https://www.reddit.com/r/husky.json?sort=top&t=week',
    'https://www.reddit.com/r/labradors.json?sort=top&t=week',
    'https://www.reddit.com/r/shiba.json?sort=top&t=week',
    'https://www.reddit.com/r/lookatmydog.json?sort=top&t=week'
    ]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('doggo')
		.setDescription('Gets a random picture from an assortment of dog subreddits')
        .addStringOption(option =>
            option.setName('argument')
            .setDescription('Optional argument for specific sub')
            .setRequired(false)),

    async execute (interaction) {

        const subURL = getSub(interaction);
        console.log(`Making fetch request to ${subURL}`);
        const response = await fetch(subURL);
        const result = await response.json();

        console.log("Sending image");
        await interaction.reply(getSubFromURL(subURL));
        await interaction.channel.send(getImageLink(result.data.children));
        console.log("Image sent");
    },
};

/**
 * Checks if the optional argument is null, loops through all urls and checks if each
 * element contains the arg
 * @param {*} interaction The interaction object containing all interaction data
 * @returns A sub reddit URL string
 */
function getSub(interaction) {

    const arg = interaction.options.getString('argument')
    if (arg === null) return getRandomSub();

    for (const url of subURLs) 
        if (url.includes(arg)) return url;
    
    console.log("I'm broken");
    return getRandomSub();
}

function getRandomNumber(length) {
    return Math.floor(Math.random() * length)
}

function getRandomSub() {
    return subURLs[Math.floor(Math.random() * subURLs.length)]
}

/**
 * Uses regex to to extract the subreddit name from the URL
 * @param {} url 
 * @returns 
 */
function getSubFromURL(url) {
    const regex = /.com\/(.*).json/;
    const match = regex.exec(url);
    return match[1]
}

function getImageLink(result) {
    let randomIndex = getRandomNumber(result.length)
    let imageURL = result[randomIndex].data.url;
    while (imageURL.includes('gallery') 
    || imageURL.includes('v.redd.it') 
    || imageURL.includes('comment')) {
        randomIndex = getRandomNumber(result.length) 
        imageURL = result[randomIndex].data.url;
        }
    return imageURL;
}
