module.exports = {
    name: 'guildDelete',
    async execute(guild, client) {
        console.log(`Server Leave: ${guild.name} (Now: ${client.guilds.cache.size})`);
    },
};