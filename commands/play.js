const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
const { QueryType, GuildQueue } = require("discord-player");


module.exports = {
 data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addSubcommand(subcommand =>
        subcommand
            .setName('search')
            .setDescription('searching')
            .addStringOption(option =>{
                return option.setName('search')
                    .setDescription('search terms')
                    .setRequired(true)}
            )
    )
            

    .addSubcommand(subcommand =>
        subcommand
            .setName('playlist')
            .setDescription('play playlist')
            .addStringOption(option => 
                option.setName('url')
                    .setDescription('playlist url')
                    .setRequired(true)))

    .addSubcommand(subcommand =>
        subcommand
            .setName('song')
            .setDescription('play url')
            .addStringOption(option =>
                option.setName('url')
                    .setDescription('url')
                    .setRequired(true))),
    
 execute: async ({client, interaction}) => {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });

    //const queue = await client.player.nodes.create(interaction.guild);
    const queue = client.distube.getQueue(interaction)

    //if (!queue.connection) await queue.connect(interaction.member.voice.channel);

    let embed =  new EmbedBuilder()
    
    if (interaction.options.getSubcommand() === 'song') {
        let url = interaction.options.getString('url');
        const result = await client.distube.play(interaction.member.voice.channel, url, {
            member: interaction.member,
            textChannel: interaction.channel,
            
        })

        console.log('result', result)

        

        // const song = result.tracks[0];
        // await queue.addTrack(song);

    } else if (interaction.options.getSubcommand() === 'playlist') {
        let url = interaction.options.getString('url');
        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_PLAYLIST
        });

       

        //await queue.addTracks(result.tracks);

       
    } else if (interaction.options.getSubcommand() === 'search') {
        let searchTerms = interaction.options.getString('searchTerms');
        const result = await client.player.search(searchTerms, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_SEARCH
        });

       

        // const song = result.tracks[0];
        // await queue.addTrack(song);

        
    }

    //if (!queue.playing) await queue.play();

    await interaction.reply(`Playing`);
            
    }
};