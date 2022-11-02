
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios')
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deals')
		.setDescription('Gets the deals from gg.deals'),

    async execute (interaction) {

        const deals = await get_deals();
        const embed = createEmbed(deals);
        console.log("Sending embed")
        await interaction.reply({ embeds: [embed] });
    },
};


async function get_deals() {
    console.log("Sending request to gg.deals")
    return await axios("https://gg.deals")
    .then(res => {
        console.log("Request received")
        const deals = []
        const $ = cheerio.load(res.data)
        console.log("Scraping HTML")
        $('.deal-list-item', res.data).each(function(index, element) {
            const url = $(element).find('a').attr('href')
            const title = $('.main-wrap', $(element)).find('a').attr('title')
            const price = $('.price-wrap', $(element)).text()

            deals.push({
                index,
                title,
                price,
                url
            })
            
        })
        return deals;
    })
}

function createEmbed(deals) {

    const data = formatData(deals)

    console.log("Creating embed");
    const embed = new MessageEmbed()
        .setTitle('GG.DEALS')
        .setColor('#23222f')
        .addFields(
            { name: "New Deals", value: data.new_deals.titles, inline: true},
            { name: "Price", value: data.new_deals.prices, inline: true},
            { name: '\u200b', value: '\u200b', inline: true}, //Embeds rollover every 3 fields, add a blank 3rd field for formatting

            { name: "Best Deals", value: data.best_deals.titles, inline: true},
            { name: "Price", value: data.best_deals.prices, inline: true},
            { name: '\u200b', value: '\u200b', inline: true},

            { name: "Historical Lows", value: data.hist_lows.titles, inline: true},
            { name: "Price", value: data.hist_lows.prices, inline: true},
            { name: '\u200b', value: '\u200b', inline: true})
        
    return embed;
}

function formatData(deals) {
    //30 deal objects, 10 per category so split the list into 3 equal lists
    const sliced_deals = []
    sliced_deals.push(deals.slice(0, 10))
    sliced_deals.push(deals.slice(10, 20))
    sliced_deals.push(deals.slice(-10))

    data = {
        "new_deals": [],
        "best_deals": [],
        "hist_lows": []
    }

    for (i = 0; i < 3; i++) {
        let deals_titles = ""
        let deals_prices = ""

        sliced_deals[i].forEach(deal => {
            deals_titles += `[${deal.title}](https://gg.deals${deal.url})\n`
            deals_prices += `${deal.price}\n`
        })

        //Access object values by index rather than key
        data[Object.keys(data)[i]] = {
            "titles": deals_titles,
            "prices": deals_prices
        }
    }
    return data
}
