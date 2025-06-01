export const container = (str: string): string => {
    const lines = str.trim().split("\n");
    const width = lines.reduce((maxLength, line) => Math.max(maxLength, line.length), 0);
    // 辅助函数：为每行添加边框和填充
    const surround = (line: string): string => `║   \x1b[0m${line.padEnd(width)}\x1b[31m   ║`;
    // 绘制顶部、底部边框
    const bar = '═'.repeat(width);
    const top = `\x1b[31m╔═══${bar}═══╗`;
    const bottom = `╚═══${bar}═══╝\x1b[0m`;
    // 空行，用于填充
    const pad = surround('');
    // 返回带有边框的文本框
    return [top, pad, ...lines.map(surround), pad, bottom].join('\n');
};
