# 断点调试（Debugger）

为了方便用户的调试，通过 cli 工具生成的项目中，为大家预置了调试配置。

## 开启调试

### vscode

开启断点调试要求开发者使用`VSCode`作为开发工具，在 VSCode 中按`F5`快捷键即可 debug 断点调试模式，此时在代码中设置断点，即可拦截客户端发来的请求。

### chrome

1、打开两个命令窗口，分别顺序执行下面两行命令（如果想要热调试，可以把 node 替换成 supervisor 等热部署的命令）

```shell
$ tsc -w --inlineSourceMap
$ node --inspect lib/app.js
```

然后就会得到下面的输出

```
Debugger listening on ws://127.0.0.1:9229/4dc825ec-a204-46f8-8edc-4afadc8da61a
For help see https://nodejs.org/en/docs/inspector
```

2、在 Chrome 中打开 chrome://inspect/#devices，可以看到页面右边的 Remote Target，在 Target 中选中启动文件下方的 inspect 就可以进入调试。
