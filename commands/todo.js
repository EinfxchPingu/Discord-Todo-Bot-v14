const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

//Made by EinfxchPingu

module.exports = {
  data: new SlashCommandBuilder()
    .setName('todo')
    .setDescription('📚〢Todo Commands')
    .addSubcommand(subcommand =>
    subcommand
        .setName('view')
        .setDescription('👀〢View the todo list with a specific category')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('📁〢Category to view')
                .setRequired(true)),
)
.addSubcommand(subcommand =>
    subcommand
        .setName('create')
        .setDescription('➕〢Create a new todo category')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('📁〢Category to create')
                .setRequired(true)),
)
.addSubcommand(subcommand =>
    subcommand
        .setName('add')
        .setDescription('➕〢Add a todo to a specific category')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('📁〢Category to add todo to')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('todo')
                .setDescription('📋〢Todo to add')
                .setRequired(true)),
)
.addSubcommand(subcommand =>
    subcommand
        .setName('remove')
        .setDescription('➖〢Remove a todo by ID from a specific category')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('📁〢Category to remove todo from')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('id')
                .setDescription('🔢〢ID of the todo to remove')
                .setRequired(true)),
)
.addSubcommand(subcommand =>
    subcommand
        .setName('setstatus')
        .setDescription('🔄〢Set the status of a todo in a specific category')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('📁〢Category of the todo')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('id')
                .setDescription('🔢〢ID of the todo to set status')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('status')
                .setDescription('🚦〢Status to set (finished/in progress)')
                .setRequired(true)
                .addChoices(
				{ name: 'In Progress', value: 'status_in_progress' },
				{ name: 'Finished', value: 'status_finished' },
				)),
)
.addSubcommand(subcommand =>
    subcommand
        .setName('delete')
        .setDescription('🗑️〢Delete a todo category')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('📁〢Category to delete')
                .setRequired(true)),
),
  async execute(interaction) {
    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
      return interaction.reply({ content: '`❌`〢You dont have permission to do this!', ephemeral: true });
    }

      const dataFilePath = path.join(__dirname, '..', 'data.json');
    let rawData = fs.readFileSync(dataFilePath);
    let data = JSON.parse(rawData);

    if (!data['todo-category']) {
      data['todo-category'] = [];
    }

    if (interaction.options.getSubcommand() === 'view') {
    const categoryName = interaction.options.getString('category').toLowerCase();
    const categoryEntry = data['todo-category'].find(entry => Object.keys(entry)[0] === categoryName);
    const categoryNameDick = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

    if (!categoryEntry) {
        return interaction.reply({ content: `\`❌\`〢The category \`${categoryName}\` does not exist.`, ephemeral: true });
    }

    let todos = categoryEntry[categoryName].todos.map(todo => {
        const status = todo.status ? `${todo.status}` : '🔴';
        return `**${todo.id}.** - ${todo.text} **[${status}]**`;
    }).join('\n');

    if (todos === '') {
        todos = '*No todos in this category*';
    }

    const embed = {
        color: 0x0AA0E1,
        title: `\`📋\`〢ToDo - ${categoryNameDick}`,
        description: todos,
    };

    interaction.reply({ embeds: [embed], ephemeral: true });
}

  if (interaction.options.getSubcommand() === 'create') {
      const categoryName = interaction.options.getString('category').toLowerCase();

      const categoryExists = data['todo-category'].some(entry => Object.keys(entry)[0] === categoryName);

      if (categoryExists) {
        interaction.reply({ content: `\`❌\`〢The category \`${categoryName}\` already exists`, ephemeral: true });
      } else {
        data['todo-category'].push({ [categoryName]: { todos: [] } });

        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

        interaction.reply({ content: `\`✅\`〢The category \`${categoryName}\` has been created.`, ephemeral: true });
      }
    }
      if (interaction.options.getSubcommand() === 'add') {
      const categoryName = interaction.options.getString('category').toLowerCase();
      const todoInput = interaction.options.getString('todo');

      const categoryEntry = data['todo-category'].find(entry => Object.keys(entry)[0] === categoryName);

      if (!categoryEntry) {
        return interaction.reply({ content: `\`❌\`〢The category \`${categoryName}\` does not exist.`, ephemeral: true });
      }

      const todoId = (categoryEntry[categoryName].todos.length || 0) + 1;

      categoryEntry[categoryName].todos.push({
        id: todoId,
        text: todoInput
      });

      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

      interaction.reply({ content: `\`✅\`〢Todo added to category \`${categoryName}\`: \`${todoInput}\``, ephemeral: true });
    }
  
      if (interaction.options.getSubcommand() === 'remove') {
    const categoryName = interaction.options.getString('category').toLowerCase();
    const todoId = interaction.options.getInteger('id');

    const categoryIndex = data['todo-category'].findIndex(entry => Object.keys(entry)[0] === categoryName);

    if (categoryIndex === -1) {
        return interaction.reply({ content: `\`❌\`〢The category \`${categoryName}\` does not exist.`, ephemeral: true });
    }

    const category = data['todo-category'][categoryIndex][categoryName];
    const todoIndex = category.todos.findIndex(todo => todo.id === todoId);

    if (todoIndex === -1) {
        return interaction.reply({ content: `\`❌\`〢Todo with ID \`${todoId}\` does not exist in category \`${categoryName}\`.`, ephemeral: true });
    }

    category.todos.splice(todoIndex, 1);

    for (let i = todoIndex; i < category.todos.length; i++) {
        category.todos[i].id -= 1;
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    interaction.reply({ content: `\`✅\`〢Todo with ID \`${todoId}\` has been removed from category \`${categoryName}\`.`, ephemeral: true });
}
if (interaction.options.getSubcommand() === 'setstatus') {
    const categoryName = interaction.options.getString('category').toLowerCase();
    const todoId = interaction.options.getInteger('id');
    const status = interaction.options.getString('status');

    const categoryEntry = data['todo-category'].find(entry => Object.keys(entry)[0] === categoryName);

    if (!categoryEntry) {
        return interaction.reply({ content: `\`❌\`〢The category \`${categoryName}\` does not exist.`, ephemeral: true });
    }

    const todo = categoryEntry[categoryName].todos.find(todo => todo.id === todoId);

    if (!todo) {
        return interaction.reply({ content: `\`❌\`〢Todo with ID \`${todoId}\` does not exist in category \`${categoryName}\`.`, ephemeral: true });
    }

    if (status === 'status_in_progress') {
        todo.status = '🟡';
    } else if (status === 'status_finished') {
        todo.status = '🟢';
    } else {
        return interaction.reply({ content: '`❌`〢Invalid status provided.', ephemeral: true });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    interaction.reply({ content: `\`✅\`〢Status of Todo with ID \`${todoId}\` in category \`${categoryName}\` set to \`${todo.status}\`.`, ephemeral: true });
}
    if (interaction.options.getSubcommand() === 'delete') {
    const categoryName = interaction.options.getString('category').toLowerCase();
    const categoryIndex = data['todo-category'].findIndex(entry => Object.keys(entry)[0] === categoryName);

    if (categoryIndex !== -1) {
        data['todo-category'].splice(categoryIndex, 1);

        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

        interaction.reply({ content: `\`✅\`〢The category \`${categoryName}\` have been deleted.`, ephemeral: true });
    } else {
        interaction.reply({ content: `\`❌\`〢The category \`${categoryName}\` was not found!`, ephemeral: true });
    }
}
  },
};
