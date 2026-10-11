import type { ReactNode } from 'react';
import { MarkPiece } from './MarkPiece';

type Props = {
  /** the title, one entry per display line */
  lines: string[];
  lede?: string;
  /** ground colour of the hero */
  theme?: 'paper' | 'ink' | 'deep' | 'red' | 'orange';
  /** which mark piece floats beside the title */
  piece?: number;
  children?: ReactNode;
};

/** The opening of every inner page: oversized title, one line of introduction, one piece of the mark. */
export function PageHero({ lines, lede, theme = 'paper', piece = 0, children }: Props) {
  return (
    <header className={`ph t-${theme}`} data-nav={theme}>
      <MarkPiece index={piece} className="ph-piece" />
      <h1 className="ph-title disp">
        {lines.map((line, i) => (
          <span className="ln" key={i}>
            <span className="in" style={{ animationDelay: `${i * 0.12}s` }}>
              {line}
            </span>
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h1>
      {(lede || children) && (
        <div className="ph-row">
          {lede ? <p className="ph-lede">{lede}</p> : null}
          {children}
        </div>
      )}
    </header>
  );
}
