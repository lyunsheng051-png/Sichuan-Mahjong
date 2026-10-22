# 安卓横屏版

## 当前工程

- 使用 Capacitor 8 封装现有 Vue 训练程序，应用名“上桌·川麻练习室”。
- 包名：`io.github.lyunsheng051.shangzhuo`，版本号 `0.1.0` / `versionCode 1`。
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

生成离线 APK 必须额外编译网页资源。`android:sync`、`android:apk` 均包含这一步，不能把它们当成普通类型检查；应在本次打包获得允许后执行。

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
artifacts/shangzhuo-0.1.0-debug.apk
```

`npm run android:sync` 只完成网页编译和原生同步；`npm run android:open` 用 Android Studio 打开工程。

## 安装和更新

将真实生成的 APK 通过 USB、聊天文件或其他常用方式传到手机，点击文件安装即可。此版本是个人练习用的调试安装包，不是应用商店发行包。

同包名、同签名的新版 APK 可以覆盖更新并保留 App 数据；不要为了更新先卸载。应保留本机用于签名的 `~/.android/debug.keystore`，切换电脑或重建签名可能导致无法覆盖安装。签名文件与本地 SDK、JDK 均不提交到仓库。

当前没有添加自动上传 APK 或推送 GitHub 的操作。

## 本次验证范围

- `npm run typecheck` 通过。
- 浏览器核对740×360、844×390横屏：手牌完整显示、按花色切换保留选择、提交判分、解析区滚动与底部下一题按钮。
- 核对设置弹层打开和关闭，以及390×844竖屏、1024×768桌面布局兼容。
- 按当前约定暂不打包：未编译网页资源、未执行 Gradle、未生成 APK，也未做安卓真机验证。原生资源的完整同步需要先生成 `dist`，留待后续允许打包时由脚本完成。

## 参考

- [Capacitor Android](https://capacitorjs.com/docs/android)
- [Capacitor SystemBars 与安全区](https://capacitorjs.com/docs/apis/system-bars)
- [Android Activity 方向配置](https://developer.android.com/guide/topics/manifest/activity-element.html)
