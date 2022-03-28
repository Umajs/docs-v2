# 跨域处理（Cors）

跨域处理插件

## 安装

```shell
$ npm install -S @umajs/plugin-cors
```

## 开启

在 plugin.config.ts 中开启 plugin-cors 插件

```javascript
// plugin.config.ts
export default {
    cors: true
}
```

> 具体开启方式请参考[plugin](../development/Plugin.md)一节中的配置方式