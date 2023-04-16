const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');


module.exports = {

data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the queue'),

execute: async ({client, interaction}) => {
    const queue = client.distube.getQueue(interaction.guild);
    if (!queue) return await interaction.reply({ content: 'No music is being played!', ephemeral: true });

    //const currentTrack = queue.current;
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    const embed = new EmbedBuilder()
        .setTitle('Server Queue')
        .setThumbnail(q.thumbnail)
        .setColor('#00FF00')
        .setDescription(q)

    return await interaction.reply({ embeds: [embed] });
}
}