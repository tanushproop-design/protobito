export default async function handler(req, res) {
  let stats = {
    server: { total: 0, online: 0, offline: 0, bots: 0 },
    users: [],
    targetBots: []
  };

  const botUrl = process.env.BOT_URL;
  const guildId = process.env.GUILD_ID;

  // 1. Try to fetch live metrics directly from Mellow Bot HTTP API (if configured and running)
  if (botUrl) {
    try {
      // Set a strict 3.5s timeout for fast Vercel execution
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const botResponse = await fetch(`${botUrl.trim().replace(/\/$/, '')}/stats`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (botResponse.ok) {
        const botData = await botResponse.json();
        if (botData && botData.server) {
          // If bot returns successful payload, return it directly!
          res.setHeader('Cache-Control', 'no-store, max-age=0');
          return res.status(200).json(botData);
        }
      }
    } catch (botError) {
      console.warn('Mellow Bot API failed/offline. Falling back to public Discord APIs:', botError.message);
    }
  }

  // 2. Fallback: Fetch live server counts dynamically from Discord's official Invite API
  try {
    const inviteResponse = await fetch('https://discord.com/api/v10/invites/mellowcafe?with_counts=true');
    if (inviteResponse.ok) {
      const inviteData = await inviteResponse.json();
      const total = inviteData.approximate_member_count || 0;
      const online = inviteData.approximate_presence_count || 0;
      const offline = Math.max(0, total - online);
      
      stats.server = {
        total,
        online,
        offline,
        bots: 0,
        name: inviteData.guild?.name || "Mellow Cafe",
        description: inviteData.guild?.description || "",
        icon: inviteData.guild?.icon ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.webp?size=128` : null
      };
    }
  } catch (inviteError) {
    console.error('Discord Invite API failed:', inviteError.message);
  }

  // 3. Fallback: Fetch online member details from Discord's public Guild Widget API (if GUILD_ID is provided)
  if (guildId) {
    try {
      const widgetResponse = await fetch(`https://discord.com/api/guilds/${guildId.trim()}/widget.json`);
      if (widgetResponse.ok) {
        const widgetData = await widgetResponse.json();
        
        // Map currently online members returned in the widget
        stats.users = (widgetData.members || []).map(m => ({
          id: m.id,
          username: m.username,
          displayName: m.username,
          avatar: m.avatar_url,
          status: m.status || 'online',
          activities: m.game ? [{ name: m.game.name, type: 0, state: '', details: '' }] : []
        }));
      }
    } catch (widgetError) {
      console.error('Discord Widget API failed:', widgetError.message);
    }
  }

  // Disable Vercel caching to serve live real-time Discord presence updates
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json(stats);
}
