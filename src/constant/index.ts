import path from "path"

const PMList = ['npm', 'cnpm', 'pnpm', 'yarn', 'bun']
const orders = new Map([ // 包管理器命令映射表，用于将包管理器的名称映射到其安装依赖的命令。
    ['npm', 'npm install'],
    ['cnpm', 'cnpm install'],
    ['pnpm', 'pnpm install'],
    ['yarn', 'yarn'],
    ['bun', 'bun install']
])
const npmName = 'allow-install' // 包名
const root = process.env.INIT_CWD || process.cwd() // 获取当前工作目录路径
const sep = path.sep // 文件路径分隔符，比如在 Windows 上是 \ ，在 Linux 和 macOS 上是 /
const useredPkgVestigital = { // 锁定文件映射表，用于锁定文件和包管理器的映射关系。
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
    'npm': 'package-lock.json',
    'yarn': 'yarn.lock',
    'pnpm': 'pnpm-lock.yaml',
    'cnpm': 'npm-register-none-lock'
}

// 路径映射表，用于将不同的文件或目录的名称和路径进行映射。例如，可以将'node_modules_path'映射到项目根目录下的'node_modules'文件夹的绝对路径。
const resolves = new Map<string, any>([
    ['node_modules_path', path.resolve(root, 'node_modules')],
    ['npminstall_err_path', path.resolve(root, 'npminstall-debug.log')],
    ['lock_path', (PM: keyof typeof useredPkgVestigital) => path.resolve(root, useredPkgVestigital[PM])],
    ['pkg_path', path.resolve(root, 'package.json')],
    ['cache_path', path.resolve(root, '.npm-only-allow')],
    ['config_path', path.resolve(__filename, '../../../cache/config.json')],
    ['dynamic_path', (filePath: any) => path.resolve(filePath)],
    ['pnpm_err_path', path.resolve(root, '.pnpm-debug.log')],
    ['ignore_path', path.resolve(root, '.gitignore')],
])
// 消息映射表，用于将不同的错误或提示信息与其对应的文本进行映射。例如，可以将'NO_PM_PROVIDER'映射到一条询问用户提供包管理器的信息的消息。
const messages = new Map<string, any>([
    ['NO_PM_PROVIDER', `请提供想要使用的包管理器: allow-install <${PMList.join('、')}>`],
    ['NONLICET_PM', (extra: string) => `${extra && extra} 不是有效的包管理器. 请从如下包管理器中任选其一: ${PMList.join('、')}`],
    ['MIS_MATCH', (current: string, setted: string) => `当前运行的${current ? '(' + current + ')' : ''}包管理器与设置的${setted ? '(' + setted + ')' : ''}不一致`],
    ['EXIT', '依赖安装失败！请删除（如果有）npminstall-debug.log文件后重试'],
    ['UN_INSTALLED', (PM: string) => `node_modules不存在，请使用${orders.get(PM) || 'npm i'}进行安装`],
    ['UN_MATCHED_INSTALL', (puts: any) => `检测到您可能使用了不匹配的包管理器安装了依赖${puts.length ? '（' + puts.join('、') + ')' : ''},请卸载或使用正确的管理器安装后重试`],
    ['GUIDE', '这可能是由于您本地存在多个lock文件，如果您认为该检测是不准确的，您可以删除lock文件尝试跳过'],
    ['GUIDE_NO_LOCK', '您可能错误的删除了lock文件，请重新生成'],
    ['GUIDE_MIS_MATCH_PNPM', '请删除（如果有）.pnpm-debug.log文件后重试'],
    ['NO_PKG', 'package.json文件不存在'],
    ['NO_PRE_HOOK', '未定义preinstall'],
    ['MORE_USED', '您应当仅在开始(如：start)和preinstall中使用该脚本']
])
// 英文提示信息映射表，用于将不同的错误或提示信息的文本进行国际化处理。例如，可以将'NO_PM_PROVIDER'映射到一条询问用户提供包管理器的信息的消息（英文版）。
const messages_en = new Map<string, any>([
    ['NO_PM_PROVIDER', `Please specify the wanted package manager:  allow-install <${PMList.join('、')}>`],
    ['NONLICET_PM', (extra: string) => `${extra && extra} not a valid package manager. the alternative: ${PMList.join('、')}`],
    ['MIS_MATCH', (current: string, setted: string) => `The current used ${current ? '(' + current + ')' : ''} package manager is inconsistent with the set ${setted ? '(' + setted + ')' : ''}`],
    ['EXIT', 'If npminstall-debug.log exists , delete it and try again'],
    ['UN_INSTALLED', (PM: string) => `'node_modules' is not present，install with ${orders.get(PM) || 'npm i'}`],
    ['UN_MATCHED_INSTALL', (puts: any) => `Detected that you may have installed a dependency ${puts.length ? '（' + puts.join('、') + ')' : ''} using a mismatched package manager ,please uninstall or use correct PM ant try again`],
    ['GUIDE', 'This may be due to the presence of multiple lock files locally, if you think the detection is inaccurate, you can remove the lock file to try to skip'],
    ['GUIDE_NO_LOCK', 'You may have deleted the lock file by mistake. Please regenerate it'],
    ['GUIDE_MIS_MATCH_PNPM', `If '.pnpm-debug.log' exists , delete it and try again`],
    ['NO_PKG', `The 'package.json' file does not exist`],
    ['NO_PRE_HOOK', 'Undefined preinstall'],
    ['MORE_USED', 'You should only use this script at the start (e.g., start) and preinstall'],
])

export {
    PMList,
    npmName,
    root,
    sep,
    resolves,
    messages,
    messages_en,
}