'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import { clients, type Client } from '@/content/clients';
import { clientsLabel } from '@/content/home';

function Row({ list, dir, hidden = false }: { list: Client[]; dir: 1 | -1; hidden?: boolean }) {
  // the list is printed twice so the row can loop without a gap
  return (
    <div className="mq" data-dir={dir} aria-hidden={hidden || undefined}>
      {[0, 1].map((copy) =>
        list.map((client) => (
          <Image key={`${copy}-${client.name}`} src={client.logo} alt={copy === 0 && !hidden ? client.name : ''} width={client.w} height={client.h} sizes="(max-width:820px) 60vw, 24vw" loading="eager" style={{ '--k': client.scale } as CSSProperties} />
        )),
      )}
    </div>
  );
}

/**
 * Scene 3. Two rows of client logos looping in opposite directions, like a video: they run on their own, with
 * motion on or off (styles/home.css), and the button pauses them.
 */
export function ClientMarquee() {
  const [paused, setPaused] = useState(false);
  const second = [5, 3, 6, 0, 2, 4, 1].map((i) => clients[i % clients.length]);
  return (
    <section className={`logos${paused ? ' paused' : ''}`} id="logos" aria-label={clientsLabel}>
      <div className="lab">
        <p>{clientsLabel}</p>
        <button type="button" className="mq-toggle" aria-pressed={paused} aria-label={paused ? 'Play the logo rows' : 'Pause the logo rows'} onClick={() => setPaused((p) => !p)}>
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
      <Row list={clients} dir={-1} />
      <Row list={second} dir={1} hidden />
    </section>
  );
}
