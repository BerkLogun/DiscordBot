const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');


module.exports = {
data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause a song'),

execute: async ({client, interaction}) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    if (queue.paused) {
      queue.resume()
      return interaction.reply('Resumed the song for you :)')
    }
    queue.pause()
    interaction.reply('Paused the song for you :)')
  }
}