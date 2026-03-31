const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('プレイヤーを監視リストから削除')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('プレイヤー名')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const name = interaction.options.getString('name');
        const index = client.watchedPlayers.indexOf(name);

        if (index === -1) return interaction.reply({ content: 'そのプレイヤーはリストにいません', flags: [MessageFlags.Ephemeral] });

        client.watchedPlayers.splice(index, 1);
        delete client.statsCache[name];

        client.saveData(client.PLAYERS_FILE, client.watchedPlayers);
        client.saveData(client.CACHE_FILE, client.statsCache);
        await interaction.reply({ content: `🗑️ **${name}** を削除しました`, flags: [MessageFlags.Ephemeral] });
    }
};