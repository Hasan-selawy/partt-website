import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Media as MediaType } from '@/content/projects';

type Props = {
  media: MediaType;
  /** how wide the image is on screen, so the browser picks the right file size */
  sizes: string;
  /** fill the parent box (which must be positioned) instead of using the image's own shape */
  fill?: boolean;
  /** load early: only for images in the first screen */
  priority?: boolean;
  /** load with the page instead of when scrolled near. For images inside moving scenes, where late loading would show. */
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Every photo on the site goes through here so sizing, lazy loading and focus points stay consistent. */
export function Media({ media, sizes, fill = false, priority = false, eager = false, className, style }: Props) {
  const loading = priority ? undefined : eager ? 'eager' : 'lazy';
  const focus = media.focus ? { objectPosition: `${media.focus} 50%` } : null;
  if (fill) {
    return <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} loading={loading} className={className} style={{ objectFit: 'cover', ...focus, ...style }} />;
  }
  return <Image src={media.src} alt={media.alt} width={media.w} height={media.h} sizes={sizes} priority={priority} loading={loading} className={className} style={{ width: '100%', height: 'auto', ...focus, ...style }} />;
}
