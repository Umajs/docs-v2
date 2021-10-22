# 中间件（Middleware）

Uma 基于 Koa2，兼容 middleware。在已有中间件的基础上提供两种使用形式：插件形式、AOP 形式。

## 插件形式

### 使用

`Uma` 的插件机制很大部分是借用了 `Koa` 的中间件，通过插件来使用中间件更易于开发和维护，请尽量用插件形式来使用中间件，插件开发和使用请参阅
[Plugin 参考文档](./Plugin.md#插件开发)

### 其它

为了方便插件使用已发布的中间件，插件配置（plugin.config.ts）可以配置中间件便捷使用，配置如下

```js
// types
[middlewareName: string]: {
    type: 'middleware',         // 仅在使用中间件的时候配置 type
    handler: Koa.Middleware,
}
```

```js
// plugin.config.ts
// 基于 koa-views 配置模板中间件
import * as views from 'koa-views'

export default {
  view: {
    type: 'middleware',
    handler: views('./views', {
      map: { html: 'nunjucks' },
    }),
  },
}
```

> 请不要在插件配置（ plugin.config.ts ）中进行中间件的开发，让插件的配置更加纯粹。如需要请使用插件开发。[Plugin 参考文档](./Plugin.md#插件开发)
>
> 如果要动态的加载中间件，请使用复合插件形式。[Plugin 参考文档](./Plugin.md#复合插件形式)

## Middleware装饰器

> Middleware装饰器(v2+)目前只支持函数装饰，可将koa中间件作用于特定的controller函数。这可以更灵活的控制避免全局中间件的影响；将中间件局部应用于单一或者多个路由。

```ts

const middleware = async (ctx,next)=>{
    console.log("****** middleware before ******");
    await next();
    console.log("****** middleware after *******");
}

export default class Index extends BaseController {
    @Middleware(middleware)
    @Path('/')
    index() {
        return this.view('index.html', {
            frameName: this.testService.returnFrameName(),
        });
    }
```

## AOP 装饰器形式

中间件和 Around 方式很相似，都是包裹异步方法。中间件是 next，around 是 proceed，但是他们有一些区别：

> 1、中间件不能处理参数，不能处理返回结果
>
> 2、切面可以对参数进行修改、判断、注入等操作，还可以对返回结果进行修改、校验、统一封装等操作

对于在中间件需要对参数，返回结构进行统一处理和校验，推荐使用 AOP 形式代码结构更清晰，可读性更强。[AOP 参考文档](./AOP.md)
