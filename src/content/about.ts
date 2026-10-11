/** About page content. The "who we are" and "approach" wording is partt's own. */

export const about = {
  heroLines: ['Part of', 'your team.'] as [string, string],
  lede: 'partt is a strategic marketing agency built on the principle of true partnership.',

  story: [
    'We operate as an integrated part of our clients’ teams, embedding ourselves across every stage of the brand journey, from strategy and brand development to execution, growth, and long-term sustainability.',
  ],

  name: {
    title: 'The name is the idea.',
    text: 'partt comes from two words: part and partner. The mark says the same thing: four pieces that only make sense once they lock together.',
    equation: ['Part', 'partner', 'partt'] as [string, string, string],
  },

  approach: {
    title: 'How we think',
    lead: 'Our approach is driven by insight, analysis, and strategic thinking. Through data-informed decisions and well-considered execution, we help brands strengthen their market presence and achieve sustainable, measurable growth.',
    body: [
      'We bridge the gap between complex business challenges and innovative solutions by leveraging real-time data and market insights.',
      'Our commitment to transparency ensures that every move we make is aligned with your long-term objectives.',
    ],
  },

  /**
   * The three ideas partt's brand is built on. The one-line descriptions are DRAFT copy written during the
   * website build: please confirm or replace.
   */
  pillars: [
    { name: 'Partnership', text: 'Your goals become our goals. We sit on your side of the table.' },
    { name: 'Teamwork', text: 'One team, one plan, every move shared openly with you.' },
    { name: 'Growth', text: 'Data-informed decisions that build sustainable, measurable growth.' },
  ],

  /** CONTENT NEEDED: names, roles and photos. The page shows a placeholder until this array has entries. */
  team: [] as { name: string; role: string; photo?: string }[],
};
