#!/usr/bin/env sh
set -eu

mkdir -p artifacts/native-ui
collect_screenshots() {
  adb pull /sdcard/Pictures/ShangzhuoNativeUi/. artifacts/native-ui/ || true
}
trap collect_screenshots EXIT

# Google API 镜像的 Pixel Launcher 首次启动可能 ANR；只处理临时模拟器的桌面。
adb shell am start -W -a android.settings.SETTINGS > /dev/null
adb shell pm disable-user --user 0 com.google.android.apps.nexuslauncher

# 仅运行应用回归，避免执行 Capacitor/Cordova 依赖自身的测试工程。
sh ./android/gradlew -p android :app:connectedDebugAndroidTest --no-daemon
