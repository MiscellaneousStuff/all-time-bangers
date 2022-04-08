# all-time-bangers-bot

## About

Discord bot which allows group members to vote on which music to add to a super playlist on spotify. It works by having users react to a recognised music
link (currently just spotify links) with a 🐐 emoji and then
adds them to the spotify playlist. The user must have the voter role, this
prevents abuse.

This allows regular music channels
in discords to still have music be queued but not necessarily added to
the master spotify playlist.

## Usage

### Authorization

On the first run, a url will show which you authorize this discord bot with for the
spotify api. Then take the code which shows up and change the auth code in .env.
Afterwards, this will be refreshed using the refresh_token and then you won't
have to authorize this app again (hopefully :/, otherwise you will need to do
this process again).

### .env file settings

```
DISCORD_TOKEN=<DISCORD_API_TOKEN>
DISCORD_GUILD=<DISCORD_SERVER_NAME>
DISCORD_RHYTHM_CHANNEL_ID=<CHANNEL_WHERE_PEOPLE_CAN_VOTE_ON_SONGS_TO_ADD>
SPOTIFY_CLIENT_ID=<SPOTIFY_API_CLIENT_ID>
SPOTIFY_PLAYLIST_ID=<SPOTIFY_PLAYLIST_ID_TO_ADD_SONGS_TO>
VOTER_ROLE_ID=<DISCORD_SERVER_ROLE_SETTINGS_ROLE_ID>
```

### Deployment

Recommended way to deploy this bot is to create a free-tier VM
on Azure/GCP/AWS and host it as a NodeJS server.