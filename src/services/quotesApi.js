/**
 * Motivational Quotes Service
 * Fetches daily inspiring quotes from public APIs with daily rotation, filtering, and offline fallbacks.
 */

const FALLBACK_QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" }
];

export async function getDailyMotivationalQuote(forceRefresh = false) {
  const todayDateStr = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const cachedQuoteData = localStorage.getItem('timora_daily_quote_data');

  if (!forceRefresh && cachedQuoteData) {
    try {
      const parsed = JSON.parse(cachedQuoteData);
      if (parsed.date === todayDateStr && parsed.quote?.text) {
        return parsed.quote;
      }
    } catch {
      // ignore parse error
    }
  }

  // Fetch new quote from API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // Primary source: DummyJSON Quotes API (fast, reliable, CORS enabled)
    const response = await fetch('https://dummyjson.com/quotes/random', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.quote) {
        const quoteObj = {
          text: data.quote.trim(),
          author: data.author?.trim() || 'Anonymous'
        };

        // Cache for today
        localStorage.setItem('timora_daily_quote_data', JSON.stringify({
          date: todayDateStr,
          quote: quoteObj
        }));

        return quoteObj;
      }
    }
  } catch {
    // API network fail or timeout -> fallback to daily indexed offline quote
  }

  // Daily deterministic offline fallback based on day of year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const fallbackQuote = FALLBACK_QUOTES[dayOfYear % FALLBACK_QUOTES.length];

  localStorage.setItem('timora_daily_quote_data', JSON.stringify({
    date: todayDateStr,
    quote: fallbackQuote
  }));

  return fallbackQuote;
}
