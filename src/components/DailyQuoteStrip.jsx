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
        <Sparkles size={12} color="var(--primary)" className="quote-sparkle-icon" />
        <span className="quote-strip-text">
          <ShinyText
            text={`“${quote.text}”`}
            color={isDarkMode ? '#BDB7AE' : '#6B655D'}
            shineColor="var(--primary)"
            speed={3}
            spread={100}
          />
          {quote.author && <span className="quote-strip-author"> — {quote.author}</span>}
        </span>
        <button
          className="quote-refresh-btn"
          onClick={() => loadQuote(true)}
          title="Get another quote"
        >
          <RefreshCw size={11} className={isLoading ? 'spin-anim' : ''} />
        </button>
      </div>
    </div>
  );
}
