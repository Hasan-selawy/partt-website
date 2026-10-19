import * as migration_20261018_104955_initial_careers from './20261018_104955_initial_careers';

export const migrations = [
  {
    up: migration_20261018_104955_initial_careers.up,
    down: migration_20261018_104955_initial_careers.down,
    name: '20261018_104955_initial_careers'
  },
];
