const { ActivityType, PresenceUpdateStatus } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: 'clientReady',
    async execute(client) {
        setInterval(() => {
            client.user.setPresence({
                activities: [
                    {
                        name: `ユーザーを追跡中...`,
                        type: ActivityType.Playing
                    }
                ],
                status: PresenceUpdateStatus.Online // Online : いつもの, DoNotDisturb : 赤い奴, Idle : 月のやつ, Invisible : 表示なし
            });
        }, 5_000);

        console.log(`Logged in as ${client.user.tag}`);
    },
};