import {afterEach, beforeEach, describe, expect, jest, test} from '@jest/globals';
import { useCheck } from '@/hook/useCheck';
import { existsSync } from 'fs';
import { useGetTypeVersion } from '@/hook/useGetTypeVersion';
import * as chalk from '@/utils/chalk'; // 导入整个模块
import { getLanguageByRegistry } from '@/utils/language';

jest.mock('fs');
jest.mock('@/hook/useGetTypeVersion');
jest.mock('@/utils/chalk');
jest.mock('@/utils/language');

describe('useCheck', () => {
    let processExitSpy: any;
    let loggerInfoSpy: any;
    beforeEach(() => {
        // 重置模拟函数和环境变量
        jest.resetAllMocks();
        // 模拟process.exit方法，以便在测试中捕获退出调用并抛出错误以避免实际退出进程。
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });

        // 获取原始logger.info实现
        const originalModule: any = jest.requireActual('@/utils/chalk');
        
        // 部分模拟chalk模块，保留info方法的原始功能
        (chalk.logger as jest.Mocked<typeof chalk.logger>).info = originalModule.logger.info;
        
        // 创建info方法的spy
        loggerInfoSpy = jest.spyOn(chalk.logger, 'info');

        (existsSync as jest.Mock).mockReturnValue(true); // 模拟文件存在的情况
        (useGetTypeVersion as jest.Mock).mockReturnValue({ name: 'pnpm', registry: 'https://registry.npmjs.org/' }); // 模拟useGetTypeVersion返回值
        (getLanguageByRegistry as jest.Mock).mockReturnValue('en'); // 模拟getLanguageByRegistry返回值
        process.argv = ['node', 'script.js']; // 模拟命令行参数
    });
    afterEach(() => {
        processExitSpy.mockRestore(); // 恢复原始方法
        loggerInfoSpy.mockRestore(); // 恢复原始方法
    });

    // 01 确保当前工作目录不在node_modules目录中运行,假设当前工作目录在node_modules中，则抛出错误并退出程序。
    test('假设当前工作目录在node_modules目录中运行', () => {
        jest.spyOn(require('@/constant'), 'getRoot').mockReturnValue('/path/to/node_modules'); // 模拟获取root的函数返回node_modules路径
        expect(() => useCheck()).toThrow('process.exit called'); // 断言抛出错误
        expect(loggerInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/请在项目根目录下运行此脚本！|Please run this script in the project root directory!/));
        expect(processExitSpy).toHaveBeenCalledWith(1); // 验证退出代码为1
    });

    // 02 确保当前工作目录存在package.json文件,假设当前工作目录不存在package.json文件，则抛出错误并退出程序。
    test('假设当前工作目录不存在package.json文件', () => {
        jest.spyOn(require('@/constant'), 'getRoot').mockReturnValue('/path/to/project'); // 模拟获取root的函数返回项目路径
        (existsSync as jest.Mock).mockReturnValue(false); // 模拟文件不存在的场景
        expect(() => useCheck()).toThrow('process.exit called');
        expect(loggerInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/package.json文件不存在|The 'package.json' file does not exist/));
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });
    
    // 03 测试没有提供包管理器参数的情况
    test('测试没有提供包管理器参数的情况', () => {
        process.argv = ['node', 'script.js'];
        // 断言useCheck()会抛出包含'process.exit called'的错误
        expect(() => useCheck()).toThrow('process.exit called');
        // 验证日志和exit调用，处理中英文
        expect(loggerInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/请提供想要使用的包管理器|Please specify the wanted package manager/));
        expect(processExitSpy).toHaveBeenCalledWith(1); // 验证退出代码为1
    });

    // 04 测试提供了无效的包管理器参数的情况
    test('测试提供了无效的包管理器参数的情况', () => {
        process.argv = ['node', 'script.js', 'abc'];
        expect(() => useCheck()).toThrow('process.exit called');
        expect(loggerInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/不是有效的包管理器|not a valid package manager/));
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    // 04 测试提供了有效的包管理器参数的情况
    test('测试提供了有效的包管理器参数的情况', () => {
        process.argv = ['node', 'script.js', 'pnpm'];
        useCheck(); // 应该不抛出错误，也不调用exit或info方法
        expect(loggerInfoSpy).not.toHaveBeenCalled();
        expect(processExitSpy).not.toHaveBeenCalled();
    });

    // 05 测试当前项目使用的包管理器与用户选择的包管理器不一致的情况
    test('测试当前项目使用的包管理器与用户选择的包管理器不一致的情况', () => {
        process.argv = ['node', 'script.js', 'cnpm']; // 假设用户选择的是npm，但实际使用的是pnpm
        (useGetTypeVersion as jest.Mock).mockReturnValue({ name: 'pnpm' }); // 模拟useGetTypeVersion返回pnpm信息
        expect(() => useCheck()).toThrow('process.exit called'); // 断言抛出错误并退出程序
        expect(loggerInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/包管理器与设置的|package manager is inconsistent with the set/));
        expect(processExitSpy).toHaveBeenCalledWith(1); // 验证退出代码为1
    });
});    