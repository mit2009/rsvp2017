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
