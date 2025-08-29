import { useState, useEffect } from "react";

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  delay?: number;
  className?: string;
}

export const TypewriterText = ({ 
  texts, 
  speed = 50, 
  delay = 3000, 
  className = "" 
}: TypewriterTextProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      if (displayedText.length < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, speed);
      } else {
        // Finished typing, wait before switching to next text
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setDisplayedText("");
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, delay);
      }
    } else {
      // Start typing the next text
      setIsTyping(true);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, currentTextIndex, isTyping, texts, speed, delay]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};