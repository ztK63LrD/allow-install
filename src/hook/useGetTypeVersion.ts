export const useGetTypeVersion = () => {
    if (!process.env?.npm_config_user_agent) {
        return undefined
    }
    const pmSpec = process.env?.npm_config_user_agent?.split(' ')[0] // 获取包管理器名称和版本号的组合字符串
    const separatorPos = pmSpec.lastIndexOf('/') // 获取版本号和包管理器名称的分隔符位置
    const name = pmSpec.substring(0, separatorPos) // 获取包管理器名称
    const registry = process.env?.npm_config_registry || '' // 获取当前使用镜像
    return {
        name: name === 'npminstall' ? 'cnpm' : name,
        version: pmSpec.substring(separatorPos + 1),
        registry
    }
}
