export const getLanguageByRegistry = (registryUrl: string | undefined): 'en' | 'zh' => {
    // 定义镜像映射表
    const mirrors = new Map<string, string>([
        ['npm', 'https://registry.npmjs.org/'],
        ['yarn', 'https://registry.yarnpkg.com/'],
        ['tencent', 'https://mirrors.tencent.com/npm/'],
        ['cnpm', 'https://r.cnpmjs.org/'],
        ['taobao', 'https://registry.npmmirror.com/'],
        ['npmMirror', 'https://skimdb.npmjs.com/registry/'],
        ['huawei', 'https://repo.huaweicloud.com/repository/npm/']
    ]);
    // 获取npm官方镜像地址
    const npmRegistry = mirrors.get('npm');
    // 判断逻辑
    if (!registryUrl) return 'zh';
    if (registryUrl.trim() === npmRegistry) return 'en';
    return 'zh';
}