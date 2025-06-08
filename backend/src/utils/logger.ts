export class Logger {
  static info(message: string) {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`);
  }
  static error(message: string) {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`);
  }
}