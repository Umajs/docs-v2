# express迁移

> 对于一些历史项目，我们可以采取逐步升级，将 umajs 集成到 express 项目中。新的接口和逻辑通过 Umajs 来写，然后再慢慢将老的逻辑迁移到 Umajs 中。

## Uma.callback

> 通过 uma.callback 函数可以获取到框架实例化后的 koa.callback.然后采用中间件形式集成到 express,connect 框架中。

## 接入方式步骤

```ts
//app.ts
import { Uma } from '@umajs/core'
import express from 'express'
;(async () => {
  const callback = <any>await Uma.callback(options)
  const app = express()
  /** 老项目中间件加载 **/

  // callback在express放到最后一个中间件中
  app.use((req, res, next) =>
    callback(req, res).then(() => {
      if (res.headersSent) return
      next()
    })
  )
})()
```

## 注意事项

1、建议在 umajs 中间件中重置 ctx.status=200 状态码。

2、umajs 中配置的 view 插件和 express 中使用的模板引擎保持一致.或者直接通过插件挂载到 context 和 Result 对象

3、express 老项目中如果有存储的 token 和 session 建议通过 umajs 自定义插件转移到 ctx 后再 uma 逻辑中进行复用

4、在 express 中使用 Umajs 时，Umajs 中间件的执行顺序需要在 express 所有中间件之后，如果之前项目有设置 404 路由需要删掉 404 中间件。

## 其他方案

> 对于只想使用 express 框架路线的项目，框架也提供了 express 版本的 Umajs.API 几乎与 Umajs 保持一致，详情查看[umajs-express](https://github.com/Umajs/umajs-express)
