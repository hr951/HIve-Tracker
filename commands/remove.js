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
        const guildId = interaction.guildId;
        const name = interaction.options.getString('name');

        const players = client.watchedPlayers[guildId];
        if (!players || !players.includes(name)) {
            return interaction.reply({ 
                content: 'そのプレイヤーはリストにいません', 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        client.watchedPlayers[guildId] = players.filter(p => p !== name);
        client.saveData(client.PLAYERS_FILE, client.watchedPlayers);

        await interaction.reply({ 
            content: `🗑️ **${name}** を監視リストから削除しました`, 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};