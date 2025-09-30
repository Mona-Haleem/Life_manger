// src/utils/logger.ts
export class Logger {
  static info(message: string, ...meta: any[]) {
    console.log(`ℹ️  [INFO] ${message}`, ...meta);
  }

  static warn(message: string, ...meta: any[]) {
    console.warn(`⚠️  [WARN] ${message}`, ...meta);
  }

  static error(message: string, ...meta: any[]) {
    console.error(`❌ [ERROR] ${message}`, ...meta);
  }

  static debug(message: string, ...meta: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🐛 [DEBUG] ${message}`, ...meta);
    }
  }
}
