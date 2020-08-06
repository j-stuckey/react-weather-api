'use strict';

const winston = require('winston');

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        morgan: 3,
        verbose: 4,
        debug: 5,
    },
    colors: {
        debug: 'bold yellow',
        info: 'bold green',
        morgan: 'bold blue',
        warn: 'magenta',
        error: 'bold red',
    },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.File({
            maxsize: '10000',
            filename: 'errors/error.log',
            level: 'error',
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            format: winston.format.simple(),
            filename: 'logs/combined.log',
        }),
    ],
});

//
// logs if not in production in a simple colorized
// format
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true
                }),
                winston.format.simple()
            ),
            level: 'debug',
        }),
    );
}

// removes the extra line from logging output for morgan
logger.stream = {
    write: function(message, encoding) {
        logger.morgan(message.replace(/\n$/, ''));
    },
};

module.exports = logger;
