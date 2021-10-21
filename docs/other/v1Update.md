# v1迁移指南

> 本文档介绍从V1版本升级到V2.0的迁移指南，想要了解V2中的变化，请查看[PR](https://github.com/Umajs/Umajs/pull/74)。

V2版本和V1的最大改动是对目录文件夹的文件的默认约束，在V1时，框架对`controller,service,aspect,plugin,config`目录都进行了强制命名约束。这导致UMajs在启动时将不得不分配额外的时间去提前扫描加载文件；在V2中我们只保留了`controller`,`plugin`,`config`三个文件目录的约束不变。这导致我们在升级V2时，注意以下功能需要修改成V2最新的使用方法。

- 取消默认文件路由，所有路由必须被@Path修饰使用
- Aspect装饰器替换为Around
- Service，Inject装饰器只能接受函数引用
- 删除@umajs/path包
- Private装饰器已从@umajs/core中移除

## 取消默认文件路由，所有路由必须被@Path修饰使用

> 在V2版本中，为了降低开发者对路由的了解；默认取消了基于文件的路由。

以下路由匹配规则在V2版本中将无法匹配访问到资源。

```typescript
class User extends BaseController {
  // url: /user
  index() {}

  // url: /user/list
  list() {}
}
```

修改成：

```typescript
@Path('/user')
class User extends BaseController {
  @Path()    // url: /user
  index() {}

  @Path('/list')  // url: /user/list
  list() {}
}
```

所有被映射成路由的函数，都需要通过`@Path`装饰器进行修饰；这样的目的也是为了规范和对项目路由的管理，减少由于缺乏管理导致函数暴露的情况发生。

## Aspect装饰器替换为Around

> @umajs/core v2.0移除 before,after,afterReturing, afterThrowing钩子函数。对于之前使用Aspect装饰器的代码，升级使用Around进行装饰;这意味着你不能继续使用Aspect装饰器。

之前：

```typescript
// src/aspect/method.aspect.ts
import { IAspect, IJoinPoint, IProceedJoinPoint } from '@umajs/core'

export default class Method implements IAspect {
  before(point: IJoinPoint) {
    // 前置通知
  }
  after(point: IJoinPoint) {
    // 后置通知
  }
  async around(proceedPoint: IProceedJoinPoint) {
    const { proceed, args ，} = proceedPoint
    // 环绕通知before
    return await proceed(...args)
    // 环绕通知after
  }
  afterThrowing(e: Error) {
    // 异常通知
  }
  afterReturning(point: IJoinPoint, result: any) {
    // 返回通知
  }
}
```

现在：

```typescript
// src/aspect/method.aspect.ts
import { IProceedJoinPoint } from '@umajs/core';

export async function method(proceedPoint: IProceedJoinPoint<any>) {
    console.log('method: this is around');
    const { proceed , target, arg } = proceedPoint;
    // proceed 路由函数
    // target 等同于controller实例 this
    // arg 路由函数参数 数组类型
    const result = await proceed(); // 继续执行method函数
    console.log('method: this is around after');

    return result;
}
```

也可通过middlewareToAround转换成中间件的形式

```typescript
import { middlewareToAround } from '@umajs/core';

export const mw = middlewareToAround(async (ctx, next) => {
    console.log("****** mw before ******");
    await next();
    console.log("****** mw after *******");
});

```

同时，v2版本中提供了Middleware装饰器，可为路由函数在执行之前调用指定koa中间件，具体使用请查看文档。

现在，你在controller中需要将Aspect用法修改使用为Around装饰器方式。注：Aspect在V2中彻底被删除。

```typescript
    import { BaseController, Path, Around, Result } from '@umajs/core';
    import { method } from '../aspect/method.aspect';

    export default class Index extends BaseController {
    	// before
    	@Get('/reg/:name*')
      @Aspect('method')
      methodOld() {
          return Result.send(`this is reg router`);
      }
      
    	// after
      @Get('/reg/:name*')
      @Around(method)
      method() {
          return Result.send(`this is reg router`);
      }
     }
```

## Service，Inject装饰器只能接受函数引用

> 当使用IOC时，在V1版本中，我们可以通过`xxx.service.ts`文件命名约束，在`controller`中，我们在使用时可通过`@Service('xxx')`实现Service实例的注入。这很方便；但对于TS环境，我们不得不需要手动`import`对`Service`文件的类型声明。而在文件类型声明时我们将再次导入该文件的引用。所以在V2中我们直接取消了对`Service`的文件命名的`强制约束`，启动时也不再提前预加载扫描该目录。这带来的改变就是，**`Service,Inject`装饰器不在支持字符串方式实现class注入。**

```typescript
// before 
import { BaseController, Path, Around, Result } from '@umajs/core';
import UserService from '../service/user.service';

export default class Index extends BaseController {
  // before
  @Service('user')
  userService: UserService;
  @Path('/')
  indexOld() {
        return this.send(this.userService.getDefaultUserAge());
  }
  
  // after
  @Service(UserService)
  userService: UserService;
  @Path('/')
  index() {
        return this.send(this.userService.getDefaultUserAge());
  }
}
```

虽然框架默认取消了对文件命名的强制约束，但为了更好的阅读体验和一致的风格。我们依然建议的Service进行统一风格的命名和定义。