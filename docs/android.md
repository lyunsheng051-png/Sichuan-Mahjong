# 安卓横屏版

## 当前工程

- 使用 Capacitor 8 封装现有 Vue 训练程序，应用名“上桌·川麻练习室”。
- 包名：`io.github.lyunsheng051.shangzhuo`，版本号 `0.1.1` / `versionCode 2`。
- 主 Activity 配置 `sensorLandscape`：在普通手机上请求横屏，支持两侧旋转。部分平板、折叠屏和分屏模式可能由系统决定方向，布局仍需适配实际窗口。
- 手机横屏采用窄导航、左侧牌桌、右侧作答；提交后在右侧显示解析，下一题按钮固定在栏底。长解析只在右侧内部滚动。
- 记忆与听牌作答按花色切换九宫格，花色按钮显示已选数量，切换不会丢失选择。
- 提示与设置在弹层中显示；打开弹层期间暂停手牌观察倒计时。系统栏与刘海留白由 Capacitor 的原生安全区处理；真机体验尚需安装 APK 核对。
- 使用本地打包资源，无 `server.url`，安装后练习不依赖电脑或在线网站。
- Android 7.0 / API 24 起，另外要求 Android System WebView / Chrome 内核版本至少109；较老设备需要先更新 WebView。

App 和桌面浏览器是独立的数据空间，不会自动搬运现有浏览器记录。当前记录仍使用 WebView 的本地存储；清除 App 数据或卸载会丢失进度。

## 开发约定

日常前端检查仍然只运行：

```powershell
npm run typecheck
```

生成离线 APK 必须额外编译网页资源。`android:sync`、`android:apk` 均包含这一步，不能把它们当成普通类型检查。手动运行云端打包工作流时，会执行这项必要编译。

后续约定：修复完成后直接打包 APK，不运行云端安卓模拟器、UI 回归或截图验证，手机安装效果由用户自行验证。

## GitHub Actions 云端打包（推荐）

无需在自己的电脑上配置 JDK 21 或 Android SDK。仓库提供手动触发的 [Android APK 工作流](https://github.com/lyunsheng051-png/Sichuan-Mahjong/actions/workflows/android-apk.yml)，使用 GitHub 的 Ubuntu 24.04 标准 runner，Node.js 24、JDK 21 和 Android SDK Platform 36。

1. 登录 GitHub，打开仓库的 **Actions → Android APK**。
2. 点击 **Run workflow**，选择要打包的分支，再点击运行。工作流仅编译打包，不运行安卓模拟器、UI 回归或截图验证；安装后的显示与交互由使用者在手机上验证。
3. 等待运行成功，打开该次运行，找到底部的 **Artifacts**。
4. 下载 `shangzhuo-android-0.1.1-运行序号` ZIP，解压得到 `shangzhuo-0.1.1-debug.apk` 和 `SHA256SUMS.txt`。
5. 将 APK 传到手机安装。附件保存7天，过期后重新运行工作流即可。

工作流先执行 `npm ci`、`npm run typecheck`，再运行 `npm run android:apk`，最后用 `apksigner` 验证签名、读取包信息并生成 SHA256 校验文件。仅上传 APK 和校验文件，不上传签名密钥。

### 固定签名与备份

仓库已配置 `ANDROID_DEBUG_KEYSTORE_BASE64` Actions Secret。每次运行恢复同一份调试签名，通过 `SHANGZHUO_DEBUG_KEYSTORE` 显式传入 Gradle，并对比生成 APK 与密钥库的证书摘要。Secret 缺失或证书不符时工作流会直接失败，不会发布改用其他签名的安装包。

本次密钥的私有备份位于本地未跟踪的 `.tools/android-signing/debug.keystore`，请另行妥善备份该目录；不要提交到 Git、作为 Actions 附件上传或公开分享。别名 `androiddebugkey`，密钥库及密钥密码均为标准调试值 `android`。密码不是保密边界，应保护密钥文件本身。此签名仅用于当前个人练习调试包。

若在 fork 中首次配置，需要自己用 `keytool` 生成密钥，再将整个文件的 Base64 内容保存到 **Settings → Secrets and variables → Actions → New repository secret**，名称为 `ANDROID_DEBUG_KEYSTORE_BASE64`。密钥需符合上述别名和密码；不要复制本仓库的私有密钥。已有安装用户不能随意替换签名。

云端打包仍需 JDK，由工作流自动配置；本机的 Java 17 环境不会被更改。当前工作流不自动发布 GitHub Release，也不上传应用商店。

## 打包工具链

本工程使用 JDK 21、Android SDK Platform 36 和 Gradle Wrapper 8.14.3。Gradle Wrapper、原生项目源代码已纳入仓库，不需要预先安装全局 Gradle。

若已安装 Android Studio，可使用它的 JDK / SDK。仅在当前打包终端配置以下变量，避免改动日常 Java 17 环境（路径替换为实际目录）：

```powershell
$env:JAVA_HOME = 'D:\tools\jdk-21'
$env:ANDROID_HOME = 'D:\tools\android-sdk'
npm run android:apk
```

也可以在未跟踪的 `android/local.properties` 中配置 `sdk.dir`。第一次原生编译需要从网络下载 Gradle 和 Maven 依赖，安装 SDK 前需要接受 Google SDK 许可。

打包脚本会先检查 APK 所需的 SDK 配置、Platform 36 和 Java 版本，再编译网页、同步原生资源、执行 `assembleDebug`。仅当 Gradle 成功且 APK 文件存在时，才复制到：

```text
artifacts/shangzhuo-0.1.1-debug.apk
```

`npm run android:sync` 只完成网页编译和原生同步；`npm run android:open` 用 Android Studio 打开工程。

## v0.1.1 修复

- 修正启动主题：不再将启动图设置为所有控件的背景；在窗口创建前安装 AndroidX SplashScreen，并统一使用无标题栏主题，处理顶部出现重复图标与名称的白色横条。
- 修正浅色背景下系统状态栏文字的对比度。退出入口使用 SVG 图标，避免手机字体缺字显示成方框。
- 安卓导航栏底部新增固定的“退出”按钮。确认后关闭 Activity；取消后继续练习，退出弹窗打开期间暂停看牌倒计时。已保存的练习记录保留，未提交答案不保存。
- 版本号升级为 `0.1.1` / `2`，保持原包名和固定签名，可直接覆盖 v0.1.0。

## 安装和更新

将真实生成的 APK 通过 USB、聊天文件或其他常用方式传到手机，点击文件安装即可。此版本是个人练习用的调试安装包，不是应用商店发行包。

同包名、同签名的新版 APK 可以覆盖更新并保留 App 数据；不要为了更新先卸载。应保留签名备份，切换电脑或重建签名可能导致无法覆盖安装。若要用本机生成能覆盖云端版本的 APK，在打包终端设置 `$env:SHANGZHUO_DEBUG_KEYSTORE` 为同一份备份的绝对路径，再运行 `npm run android:apk`。不设置时，本地 Gradle 使用默认调试签名，与云端签名可能不同。签名文件与本地 SDK、JDK 均不提交到仓库。

本地脚本只在 `artifacts/` 生成 APK；云端工作流将 APK 上传到该次运行的 Artifacts。

## 本次验证范围

- `npm run typecheck` 通过。
- 浏览器核对740×360、844×390横屏：手牌完整显示、按花色切换保留选择、提交判分、解析区滚动与底部下一题按钮。
- 核对设置弹层打开和关闭，以及390×844竖屏、1024×768桌面布局兼容。
- 2026-10-22：[v0.1.0 云端构建成功](https://github.com/lyunsheng051-png/Sichuan-Mahjong/actions/runs/39722626363)，完成离线网页编译、Capacitor 同步、Gradle 原生编译、APK 签名验证及固定签名证书比对；输出附件 `shangzhuo-android-0.1.0-3`。
- 2026-10-22：[v0.1.1 打包成功](https://github.com/lyunsheng051-png/Sichuan-Mahjong/actions/runs/39727492072)，本次未运行云端模拟器或 UI 测试，输出附件 `shangzhuo-android-0.1.1-9`。
- v0.1.1 安装包约5.21 MB，已核对包名、版本 `0.1.1` / `2`、离线资源与 SHA256。华为等实际设备的显示效果仍需安装核对。

## 参考

- [Capacitor Android](https://capacitorjs.com/docs/android)
- [Capacitor SystemBars 与安全区](https://capacitorjs.com/docs/apis/system-bars)
- [Android Activity 方向配置](https://developer.android.com/guide/topics/manifest/activity-element.html)
