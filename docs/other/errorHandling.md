# 错误处理（ErrorHandler）

程序在执行过程中总会遇到一些可预测或者不可预测的异常，如果对这些异常不做处理，可能会导致程序的崩溃，所以我们需要对程序的异常进行捕获并做相应的处理。下面介绍下在使用 Uma 进行开发时有哪些方法可以捕获程序的异常。

## 在方法中 try-catch

在需要的地方进行`try-catch`是开发语言为我们提供的捕获错误方法，我们将可能出错的代码通过`try-catch`进行包裹，在`catch`中对异常进行处理。

```ts
import { BaseController } from '@umajs/core'

export default class Index extends BaseController {
  index() {
    try {
      // ......
      return this.json({ code: 100, msg: 'success' })
    } catch (err) {
      // 出现错误时处理
      return this.json({ code: -100, msg: 'error' })
    }
  }
}
```

## 使用Around

Uma 提供的 Aspect 中，我们可以通过`Around`来处理异常。

在[AOP](./AOP.md#通知)一节中我们介绍了，当方法执行过程中，Around装饰器传入的函数可以拦截目标函数的执行，我们可以在函数执行过程中通过try,catch捕获异常并且进行统一返回处理。

```javascript
// ${URSA_ROOT}/aspect/err.aspect.ts
// /aspect/method.aspect.ts
import { IProceedJoinPoint } from '@umajs/core';

export async function throwErr(proceedPoint: IProceedJoinPoint<any>) {
    let result;
    try{
       // 执行被修饰的方法
      const result = await proceedPoint.proceed();
    }catch(e:Error){
      return Result.json({code:1,message:'执行方法异常！',stack:e.stack})
    }
   
    return result;
}

// ${URSA_ROOT}/controller/index.controller.ts
export default class Index extends  BaseController {
    // 添加异常处理切面方法，当index执行出错时会执行afterThrowing
    @Around(throwErr)
    index() {
        throw new Error('error');
    }
}
```

## 中间件方式

在[plugin](../development/Plugin.md#插件配置实例)中，我们可以通过插件加载全局中间件，而在中间件中我们可以对next中间件进行捕获，因为插件中引入的中间件执行顺序总是在controller函数被调用之前。

```ts
// plugin/error-handler/index.ts
export default (uma: Uma, options: TView = {}): Koa.Middleware => {
    // uma 实例化对象；options 插件配置的 options，等同于 uma.plugin['error-handler'].options
    return async(ctx,next)=>{
        try{
          await next();
        }catch(e){
          console.error('error-handler插件捕获异常',e);
        }
    };
};
```

## 使用 plugin-status

[plugin-status](../plugin/Status.md)是 Uma 为了方便用户对 response`不同状态码`情况和`错误`进行处理提供的插件。

具体使用方法可以参考[插件/Status](../plugin/Status.md)一章

```javascript
// status.config.ts
export default {
    // 针对状态码进行处理
    _404(ctx) {
        return ctx.render('404.html');
    }
    // 针对未被捕获错误进行处理
    _error(e: Error, ctx) {
        // ...
    }
}
```

## 三种错误处理方式的使用场景

- try-catch: 适合对方法`单独`进行错误处理
- Around: 更具`可复用性`，可以对多个方法进行错误处理
- 中间件方式: 属于全局异常兜底策略，适用于全局范围内未知异常捕获处理
- plugin-status: 对整个系统在运行中未被捕获的错误的`兜底操作`，让系统更健壮，同时除了错误处理外，更多的是`对不同状态码的统一处理`
