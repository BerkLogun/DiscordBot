const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip a song'),

    execute: async ({client, interaction}) => {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) return await interaction.reply({ content: 'No music is being played!', ephemeral: true });
        const success = await queue.skip();
        return await interaction.reply({ content: success ? `Skipped current song` : 'Something went wrong!', ephemeral: true });
    }
}