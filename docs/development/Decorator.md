# 修饰器（Decorator）

框架大量功能都是以 Decorator（修饰器）的方式使用。

## @Resource、@Inject 修饰器

[IOC 参考文档](./IOC.md#resource、-inject-修饰器)

## @Service 修饰器

[Service 参考文档](./IOC.md#service修饰器)

## @Around 修饰器

[Acpect 参考文档](./AOP.md#around修饰器)

## Middleware 修饰器

[Middleware 参考文档](./Middleware.md#middleware装饰器)

## @Path

[Router 参考文档](./Router.md#path修饰器)

## 参数装饰器 [@Param , @Query, @Body](../other/ArgDecorator.md)

## 自定义参数装饰器 createArgDecorator

### 注意

> 从 v1.1.\* 版本开始，`createArgDecorator` 更新了参数方式，使传入参数不受一个的限制。

```js
// v1.0.*
function createArgDecorator(fn: (argKey: string, ctx: IContext) => any): (...argProps: any[]) => ParameterDecorator;

// v1.1.*
function createArgDecorator(fn: (ctx: IContext, ...argProps: any[]) => any): (...argProps: any[]) => ParameterDecorator;
```

### 示例如下

```js
// user.controller.ts
import { BaseController, Param } from '@umajs/core'
import { AgeCheck } from '../decorator/AgeCheck'

export default class User extends BaseController {
  save(@Param('name') name: string, @AgeCheck('age') age: number) {
    // ...
  }
}

// decorator/AgeCheck.ts
import { createArgDecorator, Result, IContext } from '@umajs/core'

/**
 * 1、参数的聚合 Model
 * 2、参数的校验
 * 3、参数的转换
 * 4、便捷方法
 * 5、utils、config 等也可以通过此装饰器快速引用
 */
export const AgeCheck = createArgDecorator((ctx: IContext, ageKey: string) => {
  let age = ctx.query[ageKey]

  if (age === undefined)
    return Result.json({
      code: 0,
      msg: '请加上 age 参数',
    })

  age = +age

  if (Number.isNaN(age) || age < 0 || age > 120)
    return Result.json({
      code: 0,
      msg: '请传入正确的 age 参数',
    })

  return age
})
```
