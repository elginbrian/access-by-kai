import React, { JSX } from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  const formatText = (inputText: string): JSX.Element[] => {
    const parts: JSX.Element[] = [];
    let currentIndex = 0;
    let keyCounter = 0;

    const patterns = [
      {
        regex: /\*\*([^*]+)\*\*/g,
        component: (match: string, content: string, key: number) => (
          <strong key={key} className="font-bold">
            {content}
          </strong>
        ),
      },
      {
        regex: /\*([^*]+)\*/g,
        component: (match: string, content: string, key: number) => (
          <em key={key} className="italic">
            {content}
          </em>
        ),
      },
      {
        regex: /`([^`]+)`/g,
        component: (match: string, content: string, key: number) => (
          <code key={key} className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
            {content}
          </code>
        ),
      },
      {
        regex: /~~([^~]+)~~/g,
        component: (match: string, content: string, key: number) => (
          <span key={key} className="line-through">
            {content}
          </span>
        ),
      },
    ];

    const allMatches: Array<{
      start: number;
      end: number;
      content: string;
      component: (match: string, content: string, key: number) => JSX.Element;
    }> = [];

    patterns.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

      while ((match = regex.exec(inputText)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          component: pattern.component,
        });
      }
    });

    allMatches.sort((a, b) => a.start - b.start);

    const validMatches: { start: number; end: number; content: string; component: (match: string, content: string, key: number) => JSX.Element }[] = [];
    for (const match of allMatches) {
      const isOverlapping = validMatches.some((existing) => match.start < existing.end && match.end > existing.start);
      if (!isOverlapping) {
        validMatches.push(match);
      }
    }

    for (const match of validMatches) {
      if (currentIndex < match.start) {
        const textBefore = inputText.slice(currentIndex, match.start);
        if (textBefore) {
          parts.push(<span key={keyCounter++}>{textBefore}</span>);
        }
      }

      parts.push(match.component(inputText.slice(match.start, match.end), match.content, keyCounter++));
      currentIndex = match.end;
    }

    if (currentIndex < inputText.length) {
      const remainingText = inputText.slice(currentIndex);
      if (remainingText) {
        parts.push(<span key={keyCounter++}>{remainingText}</span>);
      }
    }

    return parts.length > 0 ? parts : [<span key={0}>{inputText}</span>];
  };

  const lines = text.split("\n");

  return (
    <div className={className}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
          {formatText(line)}
        </div>
      ))}
    </div>
  );
};

export default FormattedText;
