import chalk from 'chalk';

// 定义打印
const log = console.log;

// 单个打印对象，封装了不同级别的日志输出方法。
const logger = {
    info: (message: string) => {
        log(chalk.blue(`[INFO] ${message}`));
    },
    warn: (message: string) => {
        log(chalk.yellow(`[WARN] ${message}`));
    },
    error: (message: string) => {
        log(chalk.red(`[ERROR] ${message}`));
    },
    success: (message: string) => {
        log(chalk.green(`[SUCCESS] ${message}`));
    },
    debug: (message: string) => {
        log(chalk.gray(`[DEBUG] ${message}`));
    },
    verbose: (message: string) => {
        log(chalk.gray(`[VERBOSE] ${message}`));
    },
    silly: (message: string) => {
        log(chalk.gray(`[SILLY] ${message}`));
    },
    trace: (message: string) => {
        log(chalk.gray(`[TRACE] ${message}`));
    },
    custom: (message: string) => {
        log(chalk.gray(`[CUSTOM] ${message}`));
    },
    blue: (message: string) => {
        log(chalk.blue(message));
    },
    green: (message: string) => {
        log(chalk.green(message));
    }
};

export {
    logger
};