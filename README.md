# Discord Todo Bot

A Discord bot for managing todo lists within your server.

## Commands

### `/todo view`
View the todo list with a specific category.

- Options:
  - `category`: Category to view

### `/todo create`
Create a new todo category.

- Options:
  - `category`: Category to create

### `/todo add`
Add a todo to a specific category.

- Options:
  - `category`: Category to add todo to
  - `todo`: Todo to add

### `/todo remove`
Remove a todo by ID from a specific category.

- Options:
  - `category`: Category to remove todo from
  - `id`: ID of the todo to remove

### `/todo setstatus`
Set the status of a todo in a specific category.

- Options:
  - `category`: Category of the todo
  - `id`: ID of the todo to set status
  - `status`: Status to set (finished/in progress)

### `/todo delete`
Delete a todo category.

- Options:
  - `category`: Category to delete

## Permissions

To use these commands, you must have the `MANAGE_GUILD` permission in the Discord server.

## Data Storage

The bot stores todo data in a JSON file located at `./data.json`.

## Installation

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Configure your bot token and other settings in `index.js` file.
4. Start the bot with `node .`.

## Usage

1. Geben Sie den Code nicht als Ihren Code aus!
2. Sie haben das Recht, den Code zu kopieren, zu ändern und erneut zu veröffentlichen, wenn in der Beschreibung, im Code oder an einer anderen Stelle, an der leicht zu erkennen ist, dass ich (EinfxchPingu) der Autor des Codes bin.
3. Ich übernehme keinerlei Haftung für Schäden, Verluste oder Probleme, die sich aus der Verwendung oder dem Missverständnis des bereitgestellten Codes ergeben können. 
