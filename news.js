// Busca manchetes de futebol de feeds RSS públicos.
// Mostramos só título, fonte e link para a matéria original —
// nunca o texto completo, por respeito aos direitos autorais dos jornais.

const FEEDS = [
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
  { url: "https://www.espn.com/espn/rss/soccer/news", source: "ESPN" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCZiYbVptd3PVPf4f6eR6UaQ", source: "CazéTV" },
  { url: "https://news.google.com/rss/search?q=site:ge.globo.com+futebol&hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "GE Globo" },
];

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  return match[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractLink(block) {
  // RSS: <link>https://...</link>  |  Atom (YouTube): <link rel="alternate" href="https://..."/>
  const hrefMatch = block.match(/<link[^>]*href="([^"]+)"/i);
  if (hrefMatch) return hrefMatch[1];
  return extractTag(block, "link");
}

function parseRSS(xml, source) {
  const items = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const block of blocks.slice(0, 12)) {
    let title = extractTag(block, "title");
    const link = extractLink(block);
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "published");
    // O Google News adiciona " - nome do site" no final do título; removemos isso.
    if (source === "GE Globo") title = title.replace(/\s+-\s+[^-]+$/, "");
    if (title && link) {
      items.push({ title, link, pubDate, source });
    }
  }
  return items;
}

exports.handler = async function () {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ApitoNewsBot/1.0)" },
      });
      const xml = await res.text();
      return parseRSS(xml, feed.source);
    })
  );

  let allNews = [];
  for (const r of results) {
    if (r.status === "fulfilled") allNews = allNews.concat(r.value);
  }

  allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300",
    },
    body: JSON.stringify({ news: allNews.slice(0, 20) }),
  };
};
