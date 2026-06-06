export default function handler(req, res) {
  const projects = [
      {
          id: 1,
          title: 'Security Bot',
          description: 'Advanced anti-nuke and moderation bot. Features real-time threat detection, auto-banning for malicious links, and strict server lockdown protocols.',
          tech: ['Python', 'Discord.py', 'MongoDB'],
          link: '#'
      },
      {
          id: 2,
          title: 'Music Bot',
          description: 'High-quality music streaming bot with Lavalink integration. Supports YouTube, Spotify, and custom filters with a sleek button-based UI.',
          tech: ['Java', 'JDA', 'Lavalink'],
          link: '#'
      },
      {
          id: 3,
          title: 'Activity Bot',
          description: 'Real-time activity tracking and leveling system. Monitors voice channel statistics, message counts, and assigns dynamic roles.',
          tech: ['Node.js', 'Discord.js', 'PostgreSQL'],
          link: '#'
      },
      {
          id: 4,
          title: 'Custom Bot',
          description: 'A fully tailored utility bot built for the Mellow Cafe server. Features custom onboarding, ticket systems, and premium profile management.',
          tech: ['Python', 'React', 'FastAPI'],
          link: '#'
      }
  ];
  res.status(200).json(projects);
}
