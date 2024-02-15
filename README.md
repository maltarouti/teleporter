# Teleporter

## Feature Overview
Teleporter is a Visual Studio Code extension that allows you to teleport your cursor to any position within the document

![demo](https://github.com/maltarouti/teleporter/assets/63660298/ff616b2b-d63f-4d61-8e5d-279d6abb6561)


## How to use Teleporter?

Teleporter currently offers two teleporting features: teleport by word match and teleport by line. When you initiate the command, two letter decorations will appear. Simply type the two-letter code to move the cursor to the desired position.

* teleporter.lineTeleporter: Creates decorations for words in the area around your cursor.
* teleporter.wordTeleporter: Creates decorations for non-empty lines in the area around your cursor.


You can set up keybindings for each of these commands by referring to the [Visual Studio Code Keybindings documentation](https://code.visualstudio.com/docs/getstarted/keybindings)

You have full configuration options for the text hint (two-letter code). Open the settings and search for `teleporter` to modify them.


## Support
* [Contribute to open source](https://github.com/maltarouti/teleporter/)
* [Report a Bug ](https://github.com/maltarouti/teleporter/issues)
