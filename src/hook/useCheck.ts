import { existsSync } from "fs"
import { PMList, root, resolves, messages, messages_en } from "@/constant"
import { useGetTypeVersion } from "@/hook/useGetTypeVersion"
import { logger } from "@/utils/chalk"
import { getLanguageByRegistry } from "@/utils/language"

// 校验用户输入的内容是否符合规范
export const useCheck = () => {
    const argv = process.argv.slice(2) // 获取命令行参数
    const wantedPM = argv[0] // 获取用户选择的包管理器名称
    const usedPM = useGetTypeVersion() // 获取当前项目使用的包管理器信息

    // 确保当前工作目录不在node_modules目录中运行
    if (root?.includes('node_modules')) {
        logger.error('请在项目根目录下运行此脚本！\n')
        process.exit(1)
    }
    // 确保当前工作目录存在package.json文件
    if (!existsSync(resolves.get('pkg_path'))) {
        log("NO_PKG")
        process.exit(1)
    }
    // 校验命令行参数是否为空，若是则退出程序执行并提示用户选择包管理器名称
    if (argv.length === 0) {
        log('NO_PM_PROVIDER')
        process.exit(1)
    }
    // 校验用户选择的包管理器是否有效，若是则退出程序执行并提示用户选择有效的包管理器名称
    if (!PMList.includes(wantedPM)) {
        log("NONLICET_PM", wantedPM)
        process.exit(1)
    }
    // 若当前项目使用的包管理器与用户选择的包管理器不一致，则退出程序执行并提示用户使用正确的命令进行安装
    if (usedPM && usedPM.name !== wantedPM) {
        log("MIS_MATCH", usedPM.name, wantedPM)
        process.exit(1)
    }
}

// 校验输出语言并输出提示信息
const log = (str: string, ...args: any[]) => {
    const type = useGetTypeVersion();
    const language = getLanguageByRegistry(type?.registry);
    const messageMap = language === 'zh' ? messages : messages_en;
    const msg = messageMap.get(str);
    if (!msg) {
        logger.warn(`[未知消息] ${str}`);
        return;
    }
    // 处理动态参数
    if (typeof msg === 'function') {
        logger.info(msg(...args));
    } else {
        logger.info(msg);
    }
}
    