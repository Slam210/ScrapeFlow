import {
  Log,
  LogCollector,
  LogFunction,
  LogLevel,
  LogLevels,
} from "@/types/log";

/**
 * Creates an in-memory log collector with per-level logging functions.
 *
 * The returned object exposes a `getAll` function and one log function for each level in `LogLevels`.
 * Calling a level function (e.g., `info('msg')`) synchronously appends a `Log` entry `{ message, level, timestamp }`
 * to an internal array. `getAll()` returns the internal logs array (live reference) so callers can read the accumulated entries.
 *
 * @returns A `LogCollector` containing `getAll` and per-level log functions that record timestamped log entries.
 */
export function createLogCollector(): LogCollector {
  const logs: Log[] = [];
  const getAll = (): Log[] => logs.slice();

  const logFunctions = {} as Record<LogLevel, LogFunction>;
  LogLevels.forEach(
    (level) =>
      (logFunctions[level] = (message: string) => {
        logs.push({ message, level, timestamp: new Date() });
      })
  );
  return {
    getAll,
    ...logFunctions,
  };
}
