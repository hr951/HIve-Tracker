const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('監視中のプレイヤー一覧を表示'),

    async execute(interaction, client) {
        const list = client.watchedPlayers.length > 0 ? client.watchedPlayers.map(p => `- ${p}`).join('\n') : '監視中のプレイヤーはいません。';
        const embed = new EmbedBuilder()
            .setTitle('📋 監視リスト')
            .setDescription(list)
            .setColor('#3498db');
        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    }
};