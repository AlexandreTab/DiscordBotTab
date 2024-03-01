const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    console.log(`Received message: ${message.content}`);
    
    if (message.content.includes("$resto") || message.content.includes("$bar") || message.content.includes("$act") || message.content.includes("$autre")) {
        try {
            let contentWithoutTrigger = message.content;
            let TheType = "Inconnu";
            if (message.content.includes("$resto")) {
                contentWithoutTrigger = message.content.replace('$resto', '').trim();
                TheType = "Restaurant";
            }
            else if (message.content.includes("$bar")) {
                contentWithoutTrigger = message.content.replace('$bar', '').trim();
                TheType = "Bar";
            }
            else if (message.content.includes("$act")) {
                contentWithoutTrigger = message.content.replace('$act', '').trim();
                TheType = "Activité";
            }
            else if (message.content.includes("$autre")) {
                contentWithoutTrigger = message.content.replace('$autre', '').trim();
                TheType = "Autre";
            }
            // Ajoutez les données à la table de votre base de données Supabase
            const { data, error } = await supabase.from('BDDIdees').insert([
                {
                    Type: TheType,
                    Nom: contentWithoutTrigger,
                    Date: new Date().toISOString().slice(0, 10)
                }
            ]);

            if (error) {
                console.error('Erreur lors de l\'enregistrement du message dans Supabase :', error);
                return;
            }

            console.log(TheType, ' : Message enregistré dans Supabase :', data);
            message.channel.send(`${TheType} save oklm :)`);
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement du message dans Supabase :', err.message);
        }
    }
});

client.login(token);
