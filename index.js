const { Collection, Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const { EmbedBuilder } = require('discord.js');


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Player } = require('discord-player');
const { DisTube } = require('distube')


const fs = require('fs');
const path = require('path');

dotenv.config();


//const client = new Client({ intents: [1 << 0, 1 << 1] });

const client = new Client({ intents: [32767] });

const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.config = require('./config.json')

client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ]
  })

const commands = [];
client.commands = new Collection();
client.emotes = config.emoji


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    console.log('path', filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}


client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
    createQueue: () => {
        return new Queue(client, message);
    },
});


client.on('ready', async () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);


    for (const guild_id of guild_ids) 
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id), { body: commands })
            .then(() => console.log(`added commands to guild ${guild_id}, commnds: ${commands.length}`))
            .catch(console.error);
    }
});

client.on('guildCreate', async () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    for (const guild_id of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id), { body: commands })
            .then(() => console.log(`added commands to guild ${guild_id}, commnds: ${commands.length}`))
            .catch(console.error);
    }
});




client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute({ client, interaction });
    } catch (error) {
        console.error(error);
        //await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

let embed =  new EmbedBuilder()

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
  queue.textChannel.send({
    embeds: [
        embed.setTitle('Now Playing')
  .setDescription(`[${song.name}](${song.formattedDuration}) - \`${song.formattedDuration}\` \nRequested by: ${song.user}`)
  .setThumbnail(song.thumbnail)
  .setColor('#00FF00')
    ]
  })
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send({
        embeds: [
            embed.setTitle('Added to queue')
    .setDescription(`[${song.name}](${song.formattedDuration}) - \`${song.formattedDuration}\` \nRequested by: ${song.user})`)
    .setThumbnail(song.thumbnail)
    .setColor('#00FF00')
        ]
    })
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
        {
      embeds: [
        embed.setTitle('Playlist added to queue')
            .setDescription(`[${playlist.name}](${playlist.url}) - \`${playlist.songs.length}\` songs \nRequested by: ${playlist.user}`)
            .setThumbnail(playlist.thumbnail)
            .setColor('#00FF00')
        ]
    }
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))



client.login(process.env.TOKEN);
