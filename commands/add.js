const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('プレイヤーを監視リストに追加')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('プレイヤー名')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const name = interaction.options.getString('name');
        if (client.watchedPlayers.includes(name)) return interaction.reply({ content: '既に追加されています', flags: [MessageFlags.Ephemeral] });

        client.watchedPlayers.push(name);
        client.saveData(client.PLAYERS_FILE, client.watchedPlayers);

        const data = await client.fetchAllStats(name);
        if (data) {
            client.statsCache[name] = {
                sky: { v: data.sky?.victories || 0, p: data.sky?.played || 0 },
                bed: { v: data.bed?.victories || 0, p: data.bed?.played || 0 }
            };
            client.saveData(client.CACHE_FILE, client.statsCache);
        }
        await interaction.reply({ content: `✅ **${name}** を追加しました`, flags: [MessageFlags.Ephemeral] });
    }
};