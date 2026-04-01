const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('通知を送るチャンネルを設定')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('通知チャンネル')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const guildId = interaction.guildId;
        const channel = interaction.options.getChannel('channel');

        client.guildConfigs[guildId] = channel.id;
        client.saveData(client.GUILD_CONFIG_FILE, client.guildConfigs);

        await interaction.reply({ content: `✅ このサーバーの通知先を ${channel} に設定しました。`, flags: [MessageFlags.Ephemeral] });
    }
};