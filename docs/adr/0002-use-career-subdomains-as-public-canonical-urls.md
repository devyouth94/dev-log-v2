# Use career subdomains as public canonical URLs

Resume and portfolio pages keep their internal App Router paths under `/resume` and `/portfolio`, but their public canonical URLs are the career subdomains. This keeps the implementation simple while making shared links, sitemap entries, and Open Graph metadata point at the audience-facing surfaces: `resume.youngzin-log.com` and `portfolio.youngzin-log.com`.
