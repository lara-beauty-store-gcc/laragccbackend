import { config } from './config.js';

const levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };

function canLog(level) {
  return (levels[level] ?? 2) <= (levels[config.logLevel] ?? 2);
}

export const log = {
  info: (...args) => canLog('INFO') && console.log('[INFO]', ...args),
  warn: (...args) => canLog('WARN') && console.warn('[WARN]', ...args),
  error: (...args) => canLog('ERROR') && console.error('[ERROR]', ...args),
  debug: (...args) => canLog('DEBUG') && console.debug('[DEBUG]', ...args),
};
