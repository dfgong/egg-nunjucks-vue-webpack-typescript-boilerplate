## 简介
基于 egg-nunjucks-vue-webpack-typescript-boilerplate 多页面服务器渲染工程骨架项目；

## 使用

### Development
```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy
```bash
$ npm run build
$ npm run tsc
$ npm start
```

### Requirement
- Node.js 8.x
- Typescript 2.8+

### 注意点
- app/web，页面入口为page下的ts文件
- egg-view-nunjucks
- html-withimg-loader用于html片段的引用
- node端ts用tsconfig编译，前端ts用ts-loader编译。