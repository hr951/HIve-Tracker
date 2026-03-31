const { Client, GatewayIntentBits, EmbedBuilder, Collection } = require('discord.js');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 設定
const token = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = '1488577861412458567';

const PLAYERS_FILE = path.join(__dirname, 'data', 'players.json');
const CACHE_FILE = path.join(__dirname, 'data', 'cache.json');

// --- データ管理関数 ---
function loadData(filePath, defaultValue = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue));
        return defaultValue;
    }
    return JSON.parse(fs.readFileSync(filePath));
}

client.commands = new Collection();
client.watchedPlayers = loadData(PLAYERS_FILE, []);
client.statsCache = loadData(CACHE_FILE, {});
client.PLAYERS_FILE = PLAYERS_FILE;
client.CACHE_FILE = CACHE_FILE;

client.saveData = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
client.fetchAllStats = async (player) => {
    try {
        const res = await axios.get(`https://api.playhive.com/v0/game/all/all/${player}`);
        return res.data;
    } catch (error) {
        console.error("データの取得に失敗しました\n", error);
        return null;
    }
};

// 2. 定期監視 (1分おき)
cron.schedule('* * * * *', async () => {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return;

    for (const player of client.watchedPlayers) {
        const data = await client.fetchAllStats(player);
        if (!data) continue;

        // Skywars と Bedwars をループでチェック
        ['sky', 'bed'].forEach(gameKey => {
            const gameName = gameKey === 'sky' ? 'SkyWars' : 'BedWars';
            const current = {
                v: data[gameKey]?.victories || 0,
                p: data[gameKey]?.played || 0
            };

            const prev = client.statsCache[player]?.[gameKey];

            // キャッシュがある場合のみ比較
            if (prev) {
                const diffV = current.v - prev.v;
                const diffP = current.p - prev.p;

                if (diffP > 0) { // 試合数が動いた場合
                    const embed = new EmbedBuilder().setTimestamp();

                    if (diffV > 0) {
                        embed.setTitle(`🏆 【${gameName}】 勝利！`)
                            .setDescription(`**${player}** が勝利しました！`)
                            .setColor('#00FF00');
                    } else {
                        embed.setTitle(`💀 【${gameName}】 敗北...`)
                            .setDescription(`**${player}** は惜しくも敗北しました。`)
                            .setColor('#FF0000');
                    }
                    channel.send({ embeds: [embed] });
                }
            }

            // キャッシュ更新
            if (!client.statsCache[player]) client.statsCache[player] = {};
            client.statsCache[player][gameKey] = current;
        });
    }
    client.saveData(client.CACHE_FILE, client.statsCache);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`${filePath} に必要な "data" か "execute" がありません。`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(token);