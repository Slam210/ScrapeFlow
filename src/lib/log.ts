import {
  Log,
  LogCollector,
  LogFunction,
  LogLevel,
  LogLevels,
} from "@/types/log";

/**
 * Creates an in-memory log collector that records timestamped entries per log level.
 *
 * The returned object exposes a `getAll` function and one function for each level in `LogLevels`.
 * Calling a level function (e.g., `info('msg')`) synchronously appends a `Log` entry `{ message, level, timestamp }`
 * (where `timestamp` is a `Date`) to an internal array. `getAll()` returns a shallow copy of the accumulated logs.
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
