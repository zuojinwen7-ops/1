# 发布为可以直接打开的网址

网站源码与发布工作流已推送到 `zuojinwen7-ops/1` 的 `main`（首个网站提交 `2f090a3`）。**尚未确认公网发布完成**。云环境界面显示“环境已发布”，只表示开发环境已保存，不表示网站已经上线。

## 发布目标与访问状态

发布目标为已有公开仓库 `zuojinwen7-ops/1`。2026 年 10 月 24 日复查时，网络访问已恢复，当前平台身份已刷新为 `zuojinwen7-ops`，原仓库的推送及管理权限均已确认，Git 推送预检通过。集成不支持创建新仓库，因此继续使用此前已授权的原仓库。不要在聊天中提供令牌。

网站发布使用以下已配置域名，保留原有的软件包管理器预设：

- `api.github.com`：核对仓库权限、查询和启用 Pages、检查发布结果。
- `zuojinwen7-ops.github.io`：上线后验证实际网站、样式与功能。

API 请求和实际代码推送已成功，不需要因先前的网络拒绝重复申请凭据。当前集成仍缺少首次开通 Pages 的权限：POST Pages 接口返回 `Resource not accessible by integration`。这与仓库角色显示 `admin:true` 并不矛盾，App 安装令牌另有权限范围。

用户只需在 https://github.com/zuojinwen7-ops/1/settings/pages 的 **Build and deployment → Source** 选择 **GitHub Actions**。开通后重试发布即可，不需要在聊天中提供密钥。官方 `actions/configure-pages@v5` 的 `enablement` 选项也要求额外权限，不能用默认 `GITHUB_TOKEN` 绕过首次开通。

首个发布运行：https://github.com/zuojinwen7-ops/1/actions/runs/40053041829 。继续前先查看这个运行和 Pages 当前状态；用户开通后可重跑失败任务或重新触发工作流。不要因为首次配置失败就重置仓库或重新申请网络权限。

## 访问恢复后的发布流程

使用已有平台认证检查仓库、Pages 支持情况和写入权限，不打印令牌，不额外索要已存在的凭据。具体发布流程：

1. 构建并验证：`python3 scripts/build.py`、`python3 tests/test_site.py`、`python3 tests/test_preview.py`。
2. 审查本地改动和远程 `main`；保留用户已有工作，不强推或覆盖远程提交。将网站源码与 `.github/workflows/deploy-pages.yml` 正常提交、推送到 `main`。
3. 将仓库 Settings → Pages 的 Source 设为 **GitHub Actions**。如果已有 Pages 配置，先检查并保留需要的设置；不要覆盖既有自定义域名。首次启用需要当前 GitHub 身份有相应管理权限，仓库和账户套餐也须支持 Pages。
4. 等待 `Publish study website` 工作流的构建和发布成功，读取实际部署输出的 `page_url`，不凭规则拼接一个网址当成已上线。
5. 对实际网址请求验证，再用浏览器检查样式、计划切换、答题、保存与手机布局。确认后才向用户提供“可以直接打开”的网址。

工作流只上传 `dist` 内的网站，不上传仓库元数据、测试文件或用户浏览器记录。网站代码和讲义将可被网站访问者读取；学习记录仍仅存在各自浏览器中，不会因上线而自动同步设备。

## 文件预览与离线备用

`index.html` 与 `dist/index.html` 均为包含样式和脚本的完整文件，不再需要预览器加载旁边的 CSS/JS。若聊天应用自己的 HTML 预览仍限制脚本执行，应下载后使用常规浏览器打开，或使用发布成功的公网网址。

开发时修改 `src/index.template.html`、`styles.css`、`study-data.js`、`app.js`，然后重新运行构建。不要直接改生成文件后忘记更新源文件。
