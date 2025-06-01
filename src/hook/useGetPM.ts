import { useGetTypeVersion } from './useGetTypeVersion'
import { availablePMList, availablePMWordEn } from '@/constant'
import { container } from '@/utils/container'

export const useGetPM = () => {
    const argv = process.argv.slice(2) // 获取命令行参数
    if (argv.length === 0) { // 校验命令行参数是否为空，若是则退出程序执行并提示用户选择包管理器名称
        console.log(`Please specify the wanted package manager: allow-install <${availablePMList.join('|')}>`)
        process.exit(1)
    }
    const wantedPM = argv[0] // 获取用户选择的包管理器名称
    if (!availablePMList.includes(wantedPM)) { // 校验用户选择的包管理器是否有效，若是则退出程序执行并提示用户选择有效的包管理器名称
        const pmStr = `${availablePMList.slice(0, -1).join(', ')} or ${availablePMList[availablePMList.length - 1]}`
        console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: ${pmStr}.`)
        process.exit(1)
    }
    const usedPM = useGetTypeVersion() // 获取当前项目使用的包管理器信息
    const cwd = process.env.INIT_CWD || process.cwd() // 获取当前工作目录路径
    const isInstalledAsDependency = cwd.includes('node_modules') // 判断当前项目是否为依赖包安装模式
    // 若当前项目使用的包管理器与用户选择的包管理器不一致，则退出程序执行并提示用户使用正确的命令进行安装
    if (usedPM && usedPM.name !== wantedPM && !isInstalledAsDependency) {
        switch (wantedPM) {
            case 'npm':
                console.log(container(availablePMWordEn.npm))
                break
            case 'cnpm':
                console.log(container(availablePMWordEn.cnpm))
                break
            case 'pnpm':
                console.log(container(availablePMWordEn.pnpm))
                break
            case 'yarn':
                console.log(container(availablePMWordEn.yarn))
                break
            case 'bun':
                console.log(container(availablePMWordEn.bun))
                break
        }
        process.exit(1)
    }
}