# 上桌应用图标 / Shangzhuo app icon

两张玉色麻将牌与三筒牌纹，采用翡翠绿、米白与少量朱红。图标不使用文字，以便缩小到手机桌面尺寸时识别。

Two jade-and-ivory mahjong tiles with a three-dot face. The icon uses forest green, ivory, and small vermilion accents, without lettering.

## 来源 / Source

- 使用内置 `image_gen` 工具生成，未使用 CLI / API fallback。
- 透明前景原图为1254×1254，保存于 `icon-foreground.png`。
- 完整生成提示词保存在 [prompt.txt](prompt.txt)。
- 此图标是本次单独生成的品牌素材，不是第三方麻将牌面库中的图片。

Created with the built-in `image_gen` tool, without the CLI/API fallback. The original transparent foreground is preserved at 1254×1254. The exact prompt is retained in [prompt.txt](prompt.txt). This is separately generated branding artwork, not an image from the credited third-party tile library.

## 文件 / Files

| 文件 / File | 用途 / Purpose |
| --- | --- |
| `icon-foreground.png` | 原始透明前景 / Original transparent foreground |
| `app-icon.png` | 512×512无外框裁切的合成图 / Unmasked composite |
| `icon-preview.png` | 512×512圆角方形预览 / Rounded-square preview |
| `icon-preview-round.png` | 512×512圆形预览 / Circular preview |
| `prompt.txt` | 完整生成提示词 / Exact generation prompt |

## 安卓适配 / Android integration

安卓8.0及以上使用独立渐变背景与透明前景。前景在108dp图层每边内缩约12dp，随后由系统应用图标遮罩。预览模拟中央72dp视窗及圆形 / 圆角方形裁切，不是安卓真机截图。

Android 8.0+ uses separate background and foreground layers. Fractional foreground insets correspond to roughly 12dp per side in a 108dp layer. The previews simulate the central 72dp viewport and launcher masks; they are not device screenshots.

已同步旧版合成图、五种密度的启动器图标，以及192×192网页图标。这里只导出图标资源，未执行网页 build、Gradle 或 APK 打包。

Legacy composites, five launcher densities, and a 192×192 browser icon are exported as well. No web build, Gradle build, or APK packaging was run for this icon update.

参考 / Reference: [Android adaptive icon guidance](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive).
