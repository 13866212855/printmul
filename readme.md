# A4 一键批量打印 (printmul)

纯本地、无服务器依赖的高性能多格式文件合并打印 Web 应用。

## 核心特性
- **支持格式**：PDF（逐页高清渲染）、Word（.docx 分页解析）、Excel（.xlsx / .xls / .csv 自动分页并重复表头）、PPT（.pptx 幻灯片转卡片）、各类图片（JPG/PNG/WebP/GIF 等）、纯文本及 Markdown/代码。
- **一键打印**：仅弹出一次打印对话框，所有文件依次按物理顺序连续打印到 A4 纸上。
- **独立起页**：每个文件严格从新的一页开始，不同文件内容绝不共用同一张纸。
- **零多余空页**：严格遵循 `@page` 与 CSS `break-after` 分页规范，最后一页无额外分页符。
- **本地离线安全**：全部文件在用户浏览器本地直接处理，绝不上传到任何远程服务器。
- **合并 PDF 导出**：支持把全部待打页面直接合成单个 A4 PDF 文件下载。

---

## 本地快速开发

```bash
# 1. 安装依赖
npm install --legacy-peer-deps

# 2. 启动开发服务器 (端口 3000)
npm run dev

# 3. 生产打包
npm run build

# 4. 生产运行
npm start
```

---

## Docker 容器化部署

本项目已针对 Windows Docker Desktop 和 Linux 生产环境进行了工业级配置（镜像名与容器名均为 `printmul`，对外端口 `7897`）。

### 1. 部署文件说明
- `Dockerfile`：生产级两阶段多架构镜像构建规范（带国内镜像加速、网络重试和缓存挂载，非 root 用户运行）。
- `Dockerbak.txt`：与 `Dockerfile` 完全一致的备份副本。
- `.dockerignore`：排除构建上下文多余文件。
- `redeploy.bat`：Windows 本地 Docker Desktop 一键部署脚本（包含构建、停删旧容器、启动新容器、健康检查）。
- `upload2remote.bat`：构建后打包并 scp 上传到远程服务器（172.29.173.42）一键加载运行脚本。

### 2. 关键经验与依赖锁文件策略
- **构建采用多阶段方案**：依赖按 `package-lock.json` 以 `npm ci --legacy-peer-deps` 精确安装，避免 Docker 构建时在线解析版本产生依赖冲突或 SSL 中断。
- **锁文件更新规则**：若更新或删除过锁文件，必须先在宿主机执行以下命令重新生成，再运行部署脚本：
  ```bash
  npm install --legacy-peer-deps --package-lock-only
  ```
- **Windows 批处理注意事项**：
  - `redeploy.bat` 和 `upload2remote.bat` 均采用严格的 ASCII 字符集并保持 CRLF 换行。
  - 本地部署挂载路径为 `D:\docker\printmul\data:/app/data`。
  - 远程部署挂载路径为 `/bak/docker/printmul/data:/app/data`。

### 3. 一键运行部署
在 Windows 环境下双击或在命令行运行：
- **本地部署**：`redeploy.bat` -> 部署完成后访问 `http://localhost:7897`
- **远程部署**：`upload2remote.bat` -> 部署完成后访问 `http://172.29.173.42:7897`
