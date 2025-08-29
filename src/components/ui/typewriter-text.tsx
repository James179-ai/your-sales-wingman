import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  className?: string;
  triggerKey?: string | number; // Key to trigger re-typing
}

export const TypewriterText = ({ 
  texts, 
  speed = 50, 
  className = "",
  triggerKey = 0
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const currentTextRef = useRef("");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Reset and start typing when triggerKey changes
    setDisplayedText("");
    setIsComplete(false);
    hasStartedRef.current = false;
    
    // Select random text
    const randomIndex = Math.floor(Math.random() * texts.length);
    currentTextRef.current = texts[randomIndex];
  }, [triggerKey, texts]);

  useEffect(() => {
    if (isComplete || hasStartedRef.current) return;
    
    hasStartedRef.current = true;
    let index = 0;
    
    const typeText = () => {
      if (index < currentTextRef.current.length) {
        setDisplayedText(currentTextRef.current.slice(0, index + 1));
        index++;
        setTimeout(typeText, speed);
      } else {
        setIsComplete(true);
      }
    };

    const startDelay = setTimeout(typeText, 300); // Small delay before starting
    
    return () => clearTimeout(startDelay);
  }, [speed, triggerKey]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};