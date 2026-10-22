#!/usr/bin/env sh
set -eu

mkdir -p artifacts/native-ui
collect_screenshots() {
  adb pull /sdcard/Pictures/ShangzhuoNativeUi/. artifacts/native-ui/ || true
}
trap collect_screenshots EXIT

# 仅运行应用回归，避免执行 Capacitor/Cordova 依赖自身的测试工程。
sh ./android/gradlew -p android :app:connectedDebugAndroidTest --no-daemon
