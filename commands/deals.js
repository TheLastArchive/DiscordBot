
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios')
const cheerio = require('cheerio')
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deals')
		.setDescription('Gets the deals from gg.deals'),

    async execute (interaction) {

        const deals = await get_deals();
        const embed = createEmbed(deals);
        await interaction.reply({ embeds: [embed] });
    },
};


async function get_deals() {
    
    return await axios("https://gg.deals")
    .then(res => {
        const deals = []
        const $ = cheerio.load(res.data)
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

    //f_ = formatted
    const f_data = formatData(deals)

    console.log("Creating embed");
    const embed = new MessageEmbed()
        .setTitle('GG.DEALS')
        .setColor('#23222f')
        .addFields(
            { name: "New Deals", value: f_data.f_new_deals, inline: true},
            { name: "Price", value: f_data.f_new_deals_price, inline: true},
            { name: '\u200b', value: '\u200b', inline: true},
            { name: "Best Deals", value: f_data.f_best_deals, inline: true},
            { name: "Price", value: f_data.f_best_deals_price, inline: true},
            { name: '\u200b', value: '\u200b', inline: true},
            { name: "Historical Lows", value: f_data.f_hist_lows, inline: true},
            { name: "Price", value: f_data.f_hist_lows_price, inline: true},
            { name: '\u200b', value: '\u200b', inline: true})
        
    return embed;
}

function formatData(deals) {
    const new_deals = deals.slice(0, 10);
    const best_deals = deals.slice(10, 20);
    const hist_lows = deals.slice(-10);

    //f_ = formatted
    let f_new_deals = ""
    let f_new_deals_price = ""
    new_deals.forEach(element => {
        f_new_deals += `[${element.title}](https://gg.deals${element.url})\n`
        f_new_deals_price += `${element.price}\n`
    });
    let f_best_deals = ""
    let f_best_deals_price = ""
    best_deals.forEach(element => {
        f_best_deals += `[${element.title}](https://gg.deals${element.url})\n`
        f_best_deals_price += `${element.price}\n`
    });
    let f_hist_lows = ""
    let f_hist_lows_price = ""
    hist_lows.forEach(element => {
        f_hist_lows += `[${element.title}](https://gg.deals${element.url})\n`
        f_hist_lows_price += `${element.price}\n`
    });

    return ({
        f_new_deals,
        f_new_deals_price,
        f_best_deals,
        f_best_deals_price,
        f_hist_lows,
        f_hist_lows_price
    })
}
