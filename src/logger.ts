import winston from "winston";
import config from "./config";
import DailyRotateFile from "winston-daily-rotate-file";

// pag ang log level ay info pero ginamit mo ay log.debug,
// hindi to magpapakita kasi lower priority ang debug.
// ang magpakita lang eh info level pataas so logger.info, logger.warning
// at logger.error
const loglevels = {
  error: 0, // highest priority
  warning: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: loglevels,
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    winston.format.printf(
      ({ level, message, timestamp, logMetadata, stack }) => {
        return `${timestamp} ${level}: ${logMetadata ? `${logMetadata} ` : ""}${message} ${stack || ""}`;
      },
    ),
  ),
  transports: [new winston.transports.Console()],
});

const fileRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
});
logger.add(fileRotateTransport);

export default logger;
