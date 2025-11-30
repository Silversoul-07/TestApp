declare module 'expo-sqlite/next' {
  import type { SQLiteDatabase } from 'expo-sqlite';

  export function openDatabaseSync(name: string): SQLiteDatabase & {
    execAsync: (sql: string) => Promise<void>;
  };
}
