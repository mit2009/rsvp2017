# Overview

This is the RSVP website for the 2019 2.009 Final Presentations. Ignite!

# Running the Debug Server

1. `yarn install`
2. In one terminal, run `yarn watch`
3. In another terminal, run `yarn app`
4. Edit code, visit localhost:8001
5. Yay!

# Editing and Creating Levels

1. Download the tile generator software on https://thorbjorn.itch.io/tiled?download
2. Pray that ithas no viruses, malware, etc.
3. Open the editor. 
4. Navigate yourself into the level-generation folder. Open the file with extension `.tmx`
5. Play around with the levels! 
6. When you're happy, go to File > Export, and choose the `.json` option. 
7. Open the `.json` file in your favourite text editor, and pull the big blob of 1D array deliciousness, and add it into levelData.ts

# Game Server/Client API

This readme file seems like a great place to document all the server/client requests! Hooray! Yes, we can.

## `POST` /game/start

Posts a request to the server to start the game. This token has an expirey of some time in the future. This token is used for all future POST requests made by the client.

Server returns:
```
{
  token: "ae019309a934bda031eca"
}
```

## `POST` /game/team

Posts a request to the server with the team color chosen by the player. Client will provide the token.

Server returns:
```
{
  success: true
}
```

## `POST` /game/playername

Posts a request to the server with the name chosen by the player. Client will provide the token.

Server returns:
```
{
  success: true
}
```
An error can be returned by the server, with the value as the message. The server will do a preliminary screening of profane names, though all names that are highscore worthy will be inspected by staff. This is a stretch goal.
```
{
  error: "Please pick a different name"
}
```

## `GET` /game/leaderboard

Returns the current leaderboard, sorted from highest to lowest scores. (Does not require a token)

Server returns:

```
{
  leaderboard: {
    1: {
      team: "BLUE",
      name: "Bob Dough",
      score: 6000,
    },
    2: {
      team: "PINK",
      name: "Mallow mallw",
      score: 5600,
    }
    ...
  }
}
```
