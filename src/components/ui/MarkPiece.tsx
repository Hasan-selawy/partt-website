import { MARK_PIECES } from '@/content/mark';

/** One of the four pieces of the mark, framed on its own. Colour comes from CSS `fill`. */
export function MarkPiece({ index, className }: { index: number; className?: string }) {
  const piece = MARK_PIECES[index % MARK_PIECES.length];
  return (
    <svg className={className} viewBox={piece.viewBox} aria-hidden="true" focusable="false">
      <use href={`#${piece.id}`} />
    </svg>
  );
}
