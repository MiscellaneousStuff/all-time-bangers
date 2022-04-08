require('dotenv').config()
const { Client, Intents, Emoji } = require("discord.js");

const ytdl = require('ytdl-core');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.once("ready", () => {
    console.log("all-time-bangers bot started!");
});

client.on("messageReactionAdd", async (reaction, user) => {
    console.log(user);

    const channel = client.channels.cache.get(process.env.DISCORD_RHYTHM_CHANNEL_ID);
    const members = Array.from(channel.members);
    const msgId = reaction.message.id;

    channel.messages.fetch(msgId).then(msg => {
        const userMsg = msg.content;
        members.forEach(member => {
            const userId = member[1].user.id;
            if (userId == user.id) {
                const roles = member[1].roles;
                const voterRole = process.env.VOTER_ROLE_ID;
                if (roles.cache.has(voterRole)) {
                    if (userMsg.includes("open.spotify.com")) {
                        let track_id = userMsg.split("/track/")[1].split("?")[0];
                        let track_scheme = `spotify:track:${track_id}`;
                        console.log("Adding:", track_scheme, "to playlist...");
                    }
                }
            }
        })
    });
});

client.on("messageReactionRemove", async (reaction, user) => {
    console.log(user);

    const channel = client.channels.cache.get(process.env.DISCORD_RHYTHM_CHANNEL_ID);
    const members = Array.from(channel.members);
    const msgId = reaction.message.id;

    channel.messages.fetch(msgId).then(msg => {
        const userMsg = msg.content;
        members.forEach(member => {
            const userId = member[1].user.id;
            if (userId == user.id) {
                const roles = member[1].roles;
                const voterRole = process.env.VOTER_ROLE_ID;
                if (roles.cache.has(voterRole)) {
                    if (userMsg.includes("open.spotify.com")) {
                        let track_id = userMsg.split("/track/")[1].split("?")[0];
                        let track_scheme = `spotify:track:${track_id}`;
                        console.log("Removing:", track_scheme, "to playlist...");
                    }
                }
            }
        })
    });
});

client.login(process.env.DISCORD_TOKEN);