import winston from 'winston';

const customLevelColors = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'cyan',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'white',
    }
}


const createLogger = env => {
    if (env == 'PROD') {
        return winston.createLogger({
            levels: customLevelColors.levels,
            transports: [
                new winston.transports.Console({ 
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize({colors: customLevelColors.colors}),
                        winston.format.timestamp(),
                        winston.format.simple(),
                    )
                }),
                new winston.transports.File({
                    filename: './logs/errors.log',
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize({colors: customLevelColors.colors}),
                        winston.format.timestamp(),
                        winston.format.simple()
                    )
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: customLevelColors.levels,
            transports: [
                new winston.transports.Console({ 
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.colorize({colors: customLevelColors.colors}),
                        winston.format.timestamp(),
                        winston.format.simple(),
                    )
                })
            ]
        })
    }
}

const logger = createLogger(process.env.ENVIRONMENT)

export default logger