import { Client, GatewayIntentBits } from 'discord.js';
import http from 'http';
import 'dotenv/config';

// 1. Check Env Configuration
const token = process.env.DISCORD_TOKEN;
const port = process.env.PORT || 11901;

if (!token) {
  console.error('CRITICAL: DISCORD_TOKEN is missing in the .env configuration!');
  process.exit(1);
}

// 2. In-Memory Cache for Live Presence Stats
let latestStats = {
  server: { total: 0, online: 0, offline: 0, bots: 0 },
  users: [],
  targetBots: [],
  updatedAt: new Date()
};

// 3. Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// Sync logic (Updates in-memory cache)
async function compileStats() {
  try {
    let guild;
    if (process.env.GUILD_ID) {
      guild = await client.guilds.fetch(process.env.GUILD_ID);
    } else {
      // Fetch first guild bot is in
      const guilds = await client.guilds.fetch();
      if (guilds.size === 0) {
        console.warn('Bot is not in any server. Invite the bot to a server first!');
        return;
      }
      guild = await client.guilds.fetch(guilds.first().id);
    }

    if (!guild) {
      console.warn('Target Discord server not found.');
      return;
    }

    console.log(`Compiling stats for server: "${guild.name}" (${guild.id})`);

    // Fetch all members with presence cache populated
    const members = await guild.members.fetch({ withPresences: true });

    let total = guild.memberCount;
    let online = 0;
    let offline = 0;
    let botsCount = 0;

    const usersList = [];
    const botsList = [];

    const TARGET_USERNAMES = ['9p7t', 'l6hx', 'issuesolverr', 'm5je', 'y62k', 'sweetdrums.dll', '5jql'];

    for (const [id, member] of members) {
      const isBot = member.user.bot;
      const status = member.presence?.status || 'offline';

      // Counts
      if (isBot) {
        botsCount++;
      } else {
        if (['online', 'idle', 'dnd'].includes(status)) {
          online++;
        } else {
          offline++;
        }
      }

      // Map presence activities
      const activities = member.presence?.activities.map(act => ({
        name: act.name,
        type: act.type, // 0 = playing, 4 = custom status
        state: act.state || '',
        details: act.details || ''
      })) || [];

      // Fetch decoration asset, banner and accentColor if the user is a team target
      let decorationUrl = null;
      let bannerUrl = null;
      let accentColor = null;
      if (TARGET_USERNAMES.includes(member.user.username)) {
        try {
          const fetchedUser = await client.users.fetch(member.user.id, { force: true });
          decorationUrl = fetchedUser.avatarDecorationURL({ size: 160 });
          bannerUrl = fetchedUser.bannerURL ? fetchedUser.bannerURL({ size: 512, forceStatic: false }) : null;
          accentColor = fetchedUser.hexAccentColor || null;
        } catch (fetchErr) {
          decorationUrl = member.user.avatarDecorationURL ? member.user.avatarDecorationURL({ size: 160 }) : null;
          bannerUrl = member.user.bannerURL ? member.user.bannerURL({ size: 512 }) : null;
          accentColor = member.user.hexAccentColor || null;
        }
      }

      // Structure member detail payload
      const memberDetails = {
        id: member.user.id,
        username: member.user.username,
        displayName: member.displayName,
        avatar: member.user.displayAvatarURL({ forceStatic: true, extension: 'png', size: 128 }),
        avatarDecoration: decorationUrl,
        banner: bannerUrl,
        accentColor: accentColor,
        status: status,
        activities: activities
      };

      if (isBot) {
        botsList.push({
          ...memberDetails,
          tag: member.user.tag
        });
      } else {
        usersList.push(memberDetails);
      }
    }

    // Save payload to global memory cache
    latestStats = {
      server: {
        total: total,
        online: online + botsCount, // Discord counts online bots as online presence
        offline: Math.max(0, total - (online + botsCount)),
        bots: botsCount
      },
      users: usersList,
      targetBots: botsList,
      updatedAt: new Date()
    };

    console.log(`Cache updated: ${total} members, ${online} online users, ${botsCount} bots.`);
  } catch (error) {
    console.error('Error compiling stats:', error.message);
  }
}

client.once('ready', () => {
  console.log(`Logged in to Discord as ${client.user.tag}`);
  
  // Compile stats immediately on startup
  compileStats();

  // Run sync routine periodically (every 45 seconds)
  setInterval(compileStats, 45 * 1000);
});

client.login(token).catch(err => {
  console.error('CRITICAL: Discord Bot login failed! Verify your token is correct and active:', err.message);
  process.exit(1);
});

// 4. Native Node.js HTTP Server to Expose Stats API
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(244);
    res.end();
    return;
  }

  if (req.url === '/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(latestStats));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found. Use GET /stats' }));
  }
});

server.listen(port, () => {
  console.log(`Mellow stats HTTP API server is listening on port ${port}`);
});
