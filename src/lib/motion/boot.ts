/**
 * Shared by the server layout and the client motion provider, so it lives in a plain module
 * (a server component cannot read a constant out of a "use client" file).
 */

/** Where a visitor's choice to turn motion on is remembered. */
export const MOTION_STORAGE_KEY = 'partt-motion';

/**
 * Runs before the page paints (see app/layout.tsx): marks that JavaScript is on, and switches to the static
 * layout when the device asks for reduced motion and the visitor has not chosen otherwise.
 */
export const MOTION_BOOT_SCRIPT = `(function(){var d=document.documentElement,on=false;d.classList.add('js');try{on=localStorage.getItem('${MOTION_STORAGE_KEY}')==='on'}catch(e){}try{if(!on&&matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('rm')}catch(e){}})()`;
