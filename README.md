# Jun Wu Academic Homepage

个人学术主页：[junwu08.github.io](https://junwu08.github.io/)。

沿用 [Boyu Ning 的主页](https://boyuning.github.io/) 的 AcadHomepage 排版：顶部导航、左侧个人资料、单页履历、左图右文的一作论文展示。保留原站头像、个人经历、获奖与学术服务信息。

## 内容

- 10 篇一作期刊、4 篇一作会议、14 篇合作期刊、4 篇合作会议。
- 一作论文介绍、DOI/出版商入口、可用的 arXiv/PDF 链接、可展开及复制的 BibTeX。
- 8 张一作期刊原论文图、1 张 ICASSP 原论文图；另外两篇期刊使用明确标注 `Conceptual illustration` 的原创概念图。
- 自适应手机菜单、键盘焦点、返回顶部、旧链接兼容。

论文元数据依据 ORCID、Crossref、arXiv 和出版商资料核对，核对日期为 **2026-10-15**。个人经历、荣誉和 ESI 标识沿用用户原站，不代表本次独立核验了获奖或 ESI 数据库。

`data/publications.json` 保存每篇论文的来源、核对日期与插图出处。`summary` 为根据摘要改写的研究介绍，页面标为 `Abstract (summary)`；三个未取得原摘要的会议条目仅展示题名所支持的 `Research topic`，未补写未经证实的方法或结果。`early access` 与正式卷期信息分别呈现，不将 DOI 年份直接当作正式出版年份。

## 修改方法

1. 在 `templates/index.html` 修改个人资料、经历、新闻和荣誉。
2. 在 `data/publications.json` 更新论文信息，插图放在 `assets/papers/`。
3. 在仓库目录运行 `node scripts/build.mjs`，生成 `index.html` 和 `assets/publications.bib`。
4. 运行 `node scripts/check.mjs` 检查内部链接、资源、作者分类和引用完整性。

不需要安装依赖。最终网页为纯静态 HTML/CSS/JavaScript，禁用 JavaScript 后论文与摘要仍可阅读，主要导航仍然可用。部署时不需要服务器端运行 Node.js。

## GitHub Pages

使用 `main` 分支的根目录发布。`index.html` 必须位于仓库根目录。`.nojekyll` 防止静态文件被 Jekyll 忽略。

旧的 `publications.html` 自动转到主页论文区域；`#education`、`#publications`、`#awards` 等旧锚点由脚本兼容。

## 版式与素材来源

`assets/css/reference-theme.css` 来自 [boyuning/boyuning.github.io](https://github.com/boyuning/boyuning.github.io) 当前站点的已编译样式，保留其 MIT 许可于 `LICENSE-THEME`，上游为 AcadHomepage / Minimal Mistakes。`styles.css` 提供本网站的导航、可访问性与移动端适配。未使用参考作者的照片、论文图片或个人履历。

论文原图来自本人的 arXiv 投稿，逐图链接见 `data/publications.json`；本网站只保存用于展示的缩略图与必要署名，不托管出版商全文。概念图展示研究场景，不是原论文实验结果图。
