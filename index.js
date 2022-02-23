require('dotenv').config();
const ds = require('discord.js');
const client = new ds.Client({
    intents: 32767,
    partials:['MESSAGE', 'CHANNEL', 'REACTION'],
});

const {Distube} = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');

client.login(process.env.token);

const prefix = "x1";

const fs = require('fs');

client.commands = new ds.Collection();
//? nel caso facessi un file così.
/*const commandsFiles = fs.readdirSync('./commands').filter(commandfile => commandfile.endsWith('.js'));
for (const commandfile of commandsFiles){
    const command = require(`./commands/${commandfile}`);
    client.commands.set(command.name,command)
}*/
const commandsFolder = fs.readdirSync('./commands');
for(const folder of commandsFolder){
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for(const file of commandsFiles){
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}


client.on('ready', () =>{
    console.log(`Online\nPing: ${client.ws.ping} ms\n`);
});
client.on('messageCreate', (message) =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command) && !client.commands.find(cmd => cmd.alias && cmd.alias.includes(command))) return;
    const comando = client.commands.get(command) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(command))
    comando.execute(message);
    if(comando.onlyStaff){
        if(!message.member.permissions.has('ADMINISTRATOR')){
            const embedErrore = new ds.MessageEmbed()
                .setTitle('Comando non eseguito')
                .setImage(message.author.displayAvatarURL())
                .setDescription('Stai eseguendo un comando solo per lo staff.')
        }
    }

})