# 面向切面（AOP）

AOP(Aspect Oriented Programming)面向切面编程是与 OOP(Object Oriented Programming)面向对象编程并列的编程思想。相对于 IOC(依赖注入)而言，AOP 是一种可以在不修改源代码的情况下给程序动态添加功能的一种方式。

使用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

## 什么是切面(Aspect)

AOP 称为`面向切面编程`，所以切面(Aspect)是 AOP 中一个很关键的点。

假设我们有一个订单系统，有如下两条线的功能，提交订单和查询订单，每个事件流都需要执行“验证用户信息”的操作，将这个功能框起来后，你可以把它当块板子，这块板子插入了一些控制流程，这块板子就可以当成是 AOP 中的一个切面。

![AOP](../../public/images/AOP-aspect.png)

## 通知

`通知`是 AOP 中一个很重要的概念，所谓通知指的就是在拦截到方法之后要执行的代码。通知分为前置(before)、后置(after)、异常(afterThrowing)、最终(afterReturning)、环绕(around)通知五类。

- 前置通知：在目标方法之前执行
- 后置通知：在目标方法之后执行
- 异常通知：当执行目标方法出现异常时执行
- 最终通知：当目标方法有返回值之后执行，在后置通知之后
- 环绕通知：在最开始调用时执行，会将目标方法作为参数传入，对目标方法(proceed)及入参(args)、出参(result)进行拦截，此方法必须返回 Result

> 在 Uma 的 V1 版本我们实现了5个通知，在 V2 版本我们对通知进行了简化，减少用户对 AOP 理解的成本，保留了使用最多最灵活的 环绕`around`通知

## @Around修饰器

在 Uma 中，可以通过修饰器`@Around`的方式为方法添加环绕通知，Around修饰器接收一个参数，作为通知方法

### 类型声明

```ts
/**
 * @param around 要执行的通知方法，方法需要return Uma 提供的 Result结果
 */
Around(around: (point: IProceedJoinPoint) => Promise<Result<any>>)
```

### 示例

```javascript
import { BaseController, Result, Around } from '@umajs/core';
import { method } from '../aspect/method.aspect';

export default class Index extends BaseController {
    // 为index方法添加around修饰，method为对应要执行的around通知方法
    @Around(method)
    index() {
      return Result.send('ok');
    }
}
```

```javascript
// /aspect/method.aspect.ts
import { IProceedJoinPoint } from '@umajs/core';

export async function method(proceedPoint: IProceedJoinPoint<any>) {
    // 执行around before方法，即在被修饰方法执行前操作，当做一些前置校验的时候如果不满足可以直接return
    console.log('this is around');

    // 执行被修饰的方法
    const result = await proceedPoint.proceed();
    
    // 执行around after方法，即在被修饰方法执行后操作
    console.log('this is around after');

    return result;
}
```

### middlewareToAround

Uma 提供了将`Middleware(中间件)转Around(环绕)`的方法`middlewareToAround`，将中间件转为 Around 修饰器后，我们可以以 AOP 的装饰器形式使用中间件。 在V2版本之后，我们可以直接使用@Middleware修饰器直接将koa中间件作用于方法。具体参考 [Middleware 参考文档](./Middleware.md#aop-装饰器形式)
