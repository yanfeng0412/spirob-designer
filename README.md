# SpiRob 参数化设计计算器

基于 SpiRobs 论文几何关系的浏览器设计工具，无需安装依赖或构建。

## 功能

- 长度、尖端包络直径、锥角与单元数计算。
- 三线 / 四线穿线布局与三维几何预览。
- 单元剖面、截面和整臂展开尺寸图。
- 相邻单元缩放比例与逐单元尺寸。
- JSON、CSV、带标注 SVG 和 OpenSCAD 导出。

## GitHub Pages

仓库 Settings → Pages → Source 选择 Deploy from a branch。
分支选择 main，目录选择 / (root)。提交后 GitHub Pages 自动发布。

## 本地运行

直接打开 index.html；也可以在当前目录运行 `python -m http.server 8000`。

## 模型边界

- 论文：https://arxiv.org/pdf/2303.09861
- 正式版：https://doi.org/10.1016/j.device.2024.100646
- 三线参考论文；四线是工程改型。
- 卷曲预览是几何插值，不是收线正运动学或力学仿真。
- 当前没有 STL 或 STEP 直接导出；SCAD 需用 OpenSCAD 渲染。
- 模型尚未进行强度、疲劳、自接触与制造验证。
