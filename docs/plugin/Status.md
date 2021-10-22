# 状态（Status）

为了方便用户对 response`不同状态码`情况和`错误`进行处理，`Uma`提供了状态处理插件 plugin-status

## 安装

```shell
$ npm install -S @umajs/plugin-status
```

## 开启

在 plugin.config.ts 中开启 plugin-status 插件

```javascript
// plugin.config.ts
export default {
  status: true,
}
```

> 具体开启方式请参考[plugin](../development/Plugin.md)一节中的配置方式

## 配置

```js
type statusOptions = {
  /**
   * 前缀
   * 默认：_
   */
  prefix?: string,

  /**
   * 状态或者错误调用方法
   * 错误方法参数 (err, ctx, next)
   * 状态方法参数 (ctx, next)
   */
  [key: string]: string | Function,
}
```

plugin-status 插件通过`对不同状态码设置处理函数`的方式来实现统一处理，函数名需要按照`${prefix}状态码`的格式来命令

例如，在`${URSA_ROOT}/config/${URSA_ENV}`目录下创建`status.config.ts`（也可以在 plugin.config.ts 的 status.options 配置）

```javascript
// status.config.ts
export default <statusOptions>{
    // ===> 404状态码处理方法
    _404(ctx) {
        return ctx.render('404.html');
    }
}
```

上面的配置为状态码 404 的请求添加了统一处理，当请求 404 的时候会返回 404.html 页面，函数接收`ctx`作为参数，开发者可以根据自己业务情况进行不同处理

除了对不同状态码情况进行处理外，插件还能`对未捕获的错误进行处理`

在上面的`status.config.ts`中添加`_error`方法可以捕获到未被捕获的错误

```javascript
// status.config.ts
import { IContext } from "@umajs/core";

export default {
    _404(ctx: IContext) {
        return ctx.render('404.html');
    }
    // ===> 未被捕获错误
    _error(e: Error, ctx: IContext) {
        // ...
    }
}
```

> 在[异常errorHanding](../other/errorHandling.md#使用Around)一节中我们介绍了@Around 可以用来处理方法调用时发生的异常，`当方法使用了@Around`进行修饰在代码中`使用了try-catch`，plugin-status 中配置的`_error方法就不会被调用`，plugin-status 的只会捕获到未 catch 住的错误
