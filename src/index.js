const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.once('ready', () => {
    console.log('ready');
});

client.on('messageCreate', async (message) => {
    if (message.content === 'cr.init') {
        const allRoles = message.guild.roles.cache;
        const startRole = allRoles.find(role => role.name == "colors.start");
        const endRole = allRoles.find(role => role.name == "colors.end");
        if (!startRole || !endRole) return message.reply('plz config the roles correctly. (colors.start and colors.end roles are missing)');
        const roles = allRoles.sort((a, b) => a.position - b.position).map(role => role).slice(endRole.position + 1, startRole.position).reverse();
        const categories = [];
        roles.forEach((role, index) => {
            if (role.name.startsWith('#')) {
                categories.push({ index: index, name: role.name.replace(/#/, '') })
            }
        })
        const result = []
        categories.forEach((category, index) => {
            result.push({ name: category.name, roles: roles.slice(category.index + 1, categories[index + 1] ? categories[index + 1].index : roles.length) })
        })
        const fields = []
        const components = [];
        result.forEach(item => {
            fields.push({ name: item.name, value: item.roles.map(r => r.toString()).join(', ') })
            components.push(new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId(`${item.name}-color-roles`)
                    .setPlaceholder(item.name)
                    .addOptions(
                        item.roles.map(role => {
                            return {
                                label: role.name,
                                value: role.id,
                            }
                        })
                    )
            ))
        })

        try {
            const embed = new EmbedBuilder()
                .setTitle('Bloody Colors')
                .addFields([...fields])
                .setImage('https://cdn.discordapp.com/attachments/976007601210925097/1020653721367089202/6f27608f8a4b09b052c7b36eda1f20e4.gif')
                .setAuthor({ name: '₊˚໑Ouroboros₊˚๑', url: 'https://duckduckgo.com/?q=%E2%80%9CPerhaps+one+did+not+want+to+be+loved+so+much+as+to+be+understood.%E2%80%9D+%E2%80%95+George+Orwell%2C+1984', iconURL: 'https://cdn.discordapp.com/icons/774698132066795561/a_34271c5fae40bb9f1f06e293b20a43f0.webp' })
                .setFooter({ text: 'cr0w was here ;)', iconURL: 'https://cdn.discordapp.com/attachments/978645724080263198/1020649015181856858/unknown.png' })
                .setTimestamp()
            message.channel.send({ embeds: [embed], components: components })
            message.delete();
        } catch (er) { console.log(er) }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu() || !interaction.values) return;
    const allRoles = interaction.guild.roles.cache;
    const startRole = allRoles.find(role => role.name == "colors.start");
    const endRole = allRoles.find(role => role.name == "colors.end");
    if (!startRole || !endRole) return message.reply('plz config the roles correctly. (colors.start and colors.end roles are missing)');
    const roles = allRoles.sort((a, b) => a.position - b.position).map(role => role).slice(endRole.position + 1, startRole.position).reverse();
    if (interaction.member.roles.cache.some(role => role.id == interaction.values[0])) {
        interaction.member.roles.remove(interaction.values[0]);
        interaction.reply({ content: `Removed <@&${interaction.values[0]}> role.`, ephemeral: true })
    }
    else {
        if(interaction.member.roles.cache.some(role => roles.some(r => r.id === role.id))) {
            interaction.member.roles.remove(interaction.member.roles.cache.find(role => roles.some(r => r.id === role.id)))
        }
        interaction.member.roles.add(interaction.values[0]);
        interaction.reply({ content: `Hello <@&${interaction.values[0]}>.:)`, ephemeral: true })
    }
})

client.login(process.env.TOKEN);