require('dotenv').config()
const { Client, Intents, Emoji } = require("discord.js");

const ytdl = require('ytdl-core');
const SpotifyWebApi = require('spotify-web-api-node');
const scopes = [
        "playlist-modify-public",
        "playlist-modify-public"
      ],
      redirectUri = 'http://www.example.com/callback',
      clientId = process.env.SPOTIFY_CLIENT_ID,
      state = "ello";
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirectUri
});
const authorizeUrl = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeUrl);

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
                        // Get track scheme
                        let track_id = userMsg.split("/track/")[1].split("?")[0];
                        let track_scheme = `spotify:track:${track_id}`;
                        console.log("Adding:", track_scheme, "to playlist...");
                        
                        // The code that's returned as a query parameter to the redirect URI
                        const authCode = process.env.AUTH_CODE;

                        // Add to playlist using Spotify Web API
                        spotifyApi.authorizationCodeGrant(authCode).then(
                            data => {
                                // Get access token
                                console.log("Access token is:", data.body["access_token"]);
                                console.log("Refresh token is:", data.body["refresh_token"]);
                                console.log("Expires in:", data.body["expires_in"]);

                                spotifyApi.setAccessToken(data.body["access_token"]);
                                spotifyApi.setRefreshToken(data.body["refresh_token"]);
                                
                                // Update playlist if access_token hasn't expired
                                addPlaylist(track_scheme);
                                channel.send(
                                    `Track added to playlist: https://open.spotify.com/playlist/${process.env.SPOTIFY_PLAYLIST_ID}`);
                            },
                            err => {
                                console.log("Error getting access token:", err);
                                // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
                                spotifyApi.refreshAccessToken().then(
                                    function(data) {
                                        console.log('The access token has been refreshed!');
                                    
                                        // Save the access token so that it's used in future calls
                                        spotifyApi.setAccessToken(data.body['access_token']);
                                        
                                        // Update playlist if access_token has expired but is
                                        // ... now refreshed (hopefully :/)
                                        addPlaylist(track_scheme);
                                    },
                                    function(err) {
                                        console.log('Could not refresh access token', err);
                                    }
                                );
                            }
                        );
                    }
                }
            }
        })
    });
});

const addPlaylist = track_scheme => {
    // Get playlist
    spotifyApi.getPlaylist(process.env.SPOTIFY_PLAYLIST_ID)
    .then(function(data) {
        console.log('Some information about this playlist', );
        const tracks = data.body.tracks.items;
        let found = false;
        tracks.forEach(track => {
            console.log("TRACK:", track);
            if (track.track.uri == track_scheme) { found = true };
            console.log("ELLO?:", track.track.uri, track_scheme)
        });
        if (!found) {
            spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_PLAYLIST_ID, [track_scheme])
            .then(function(data) {
                console.log('Added tracks to playlist!');
            }, function(err) {
                console.log('Something went wrong!', err);
            });
        }
    }, function(err) {
        console.log('Something went wrong!', err);
    });
};

client.login(process.env.DISCORD_TOKEN);