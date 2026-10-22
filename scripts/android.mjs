import { spawnSync } from 'node:child_process'
import { access, copyFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2]
if (!['sync', 'apk'].includes(mode)) throw new Error('用法：npm run android:sync 或 npm run android:apk')

function run(executable, args, cwd = root) {
  const result = spawnSync(executable, args, { cwd, stdio: 'inherit', env: process.env })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`命令执行失败（${result.status}）：${path.basename(executable)} ${args.join(' ')}`)
}

try {
  if (mode === 'apk') {
    // 先检查原生工具链，避免缺 SDK 时先做不必要的资源编译。
    const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
    const localProperties = await readFile(path.join(root, 'android', 'local.properties'), 'utf8').catch(() => '')
    if (!sdk && !/^sdk\.dir\s*=/m.test(localProperties)) throw new Error('未配置 Android SDK。请设置 ANDROID_HOME 或 android/local.properties，参见 docs/android.md。')
    if (sdk) await access(path.join(sdk, 'platforms', 'android-36', 'android.jar'))
    const java = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', process.platform === 'win32' ? 'java.exe' : 'java') : 'java'
    const check = spawnSync(java, ['-version'], { encoding: 'utf8', env: process.env })
    if (check.error) throw check.error
    const major = Number(`${check.stderr}${check.stdout}`.match(/version\s+"(\d+)/)?.[1])
    if (check.status !== 0 || major < 21 || !Number.isFinite(major)) throw new Error('安卓工程需要 JDK 21 或更高版本。请仅为打包终端设置 JAVA_HOME，保留日常 Java 17 环境。')
  }

  // 此编译用于把离线网页装入 APK；日常前端检查只运行 typecheck。
  const { build } = await import('vite')
  await build({ root, build: { target: 'chrome109' } })
  run(process.execPath, [path.join(root, 'node_modules', '@capacitor', 'cli', 'bin', 'capacitor'), 'sync', 'android'])
  if (mode === 'apk') {
    const android = path.join(root, 'android')
    if (process.platform === 'win32') {
      // cmd 仅执行固定的 Gradle 入口与参数；不拼接文件操作或不可信参数。
      run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'gradlew.bat assembleDebug --no-daemon'], android)
    } else run('sh', ['./gradlew', 'assembleDebug', '--no-daemon'], android)
    const output = path.join(root, 'artifacts', 'shangzhuo-0.1.0-debug.apk')
    await mkdir(path.dirname(output), { recursive: true })
    await copyFile(path.join(android, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'), output)
    console.log(`可安装的调试 APK：${output}`)
  }
} catch (error) {
  console.error(`安卓打包未完成：${error.message}`)
  process.exitCode = 1
}
