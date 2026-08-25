import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getDailyMotivationalQuote } from '../services/quotesApi';
import ShinyText from './ShinyText';

export default function DailyQuoteStrip({ isDarkMode }) {
  const [quote, setQuote] = useState({
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadQuote = async (force = false) => {
    setIsLoading(true);
    try {
      const q = await getDailyMotivationalQuote(force);
      if (q) setQuote(q);
    } catch {
      // Fallback is already handled in quotesApi
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuote(false);
  }, []);

  return (
    <div className="daily-thin-quote-strip">
      <div className="quote-strip-content">
        <Sparkles size={13} color="var(--primary)" className="quote-sparkle-icon" />
        <span className="quote-strip-text">
          <ShinyText
            text={`“${quote.text}”`}
            color={isDarkMode ? '#FAF8F5' : '#423E3B'}
            shineColor="var(--primary)"
            speed={3}
            spread={100}
          />
          {quote.author && <span className="quote-strip-author"> — {quote.author}</span>}
        </span>
        <button
          className="quote-refresh-btn"
          onClick={() => loadQuote(true)}
          title="Get another inspiring quote"
          aria-label="Refresh quote"
        >
          <RefreshCw size={12} className={isLoading ? 'spin-anim' : ''} />
        </button>
      </div>
    </div>
  );
}
