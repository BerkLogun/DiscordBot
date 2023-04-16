const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');


module.exports = {
data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('shuffle the queue'),

execute: async ({client, interaction}) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
      queue.shuffle()
      return interaction.reply('Shuffled songs in the queue')
    }

}