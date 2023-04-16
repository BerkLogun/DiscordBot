const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');


module.exports = {
data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('skip to a song in the queue')
    .addIntegerOption(option => 
        option.setName('number')
        .setDescription('The number of the song you want to skip (for previous use -1)')
        .setRequired(true)),

execute: async ({client, interaction}) => {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    const num = interaction.options.getInteger('number')
    if (isNaN(num)) return interaction.reply(`${client.emotes.error} | Please enter a valid number!`)
    await client.distube.jump(interaction, num).then(song => {
        interaction.reply({ content: `Skipped to: ${song.name}` })
    })
}
}
