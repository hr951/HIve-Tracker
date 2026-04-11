module.exports = {
    name: 'guildCreate',
    async execute(guild, client) {
        console.log(`Server Join: ${guild.name} (Now: ${client.guilds.cache.size})`);
    },
};