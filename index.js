require('dotenv').config()
const { Client, Intents, Emoji } = require("discord.js");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.once("ready", () => {
    console.log("Ready!");
});

client.on("messageReactionAdd", async (reaction, user) => {
    console.log(user);

    const channel = client.channels.cache.get(process.env.DISCORD_RHYTHM_CHANNEL_ID);
    const msgId = reaction.message.id;
    
    const members = Array.from(channel.members);
    members.forEach(member => {
        const userId = member[1].user.id;
        if (userId == user.id) {
            const roles = member[1].roles;
            const voterRole = process.env.VOTER_ROLE_ID;
            if (roles.cache.has(voterRole)) {
                console.log("add song...");
            }
        }
    })


    channel.messages.fetch(msgId)
        .then(msg => console.log(msg.content));
});

client.login(process.env.DISCORD_TOKEN);