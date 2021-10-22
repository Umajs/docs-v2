# 服务（Service）

## 使用

### cli 工具在初始化会自动生成 service 目录，可直接在 service 目录中编写 service

```
app
|- src
  |-middleware
  |-config
  |-controller
  |-service
    |-demo.service.ts
```

### 命名规范: `*.service.ts`

### 编写 service 时需继承默认 baseService 以便我们将 service 挂载到 ctx 中

```javascript
import { BaseService } from '@umajs/core'

export default class demo extends BaseService {
  demoService() {
    return 'this is demo service'
  }
}
```

### controller 中使用

- 引入 service
- 依赖注入 `@Service(serviceClazz)` , *注意*：在V2之后，Service参数装饰器只接受class类型参数。不再支持传入文件名字符串。
- 注入之后可直接使用无需再进行实例

```javascript
// controller
import DemoService from '../service/demo.service'

export default class Index extends BaseController {
  @Service(DemoService)
  demoService: DemoService

  @Path('/demo')
  demoService() {
    // return this.demoService.loadAll();
  }
}
```

```javascript
// service
import { BaseService } from '@umajs/core'

export default class Demp extends BaseService {
  loadAll() {
    // return
  }
}
```

### 在非 Controller 中使用 Service 时，必须传入 ctx 进行实例化才能使用。

> 如果`Service`不需要传入`ctx` ,则无需继承`BaseService`

- 在插件中使用

```javascript
// plugin
import DemoService from '../service/demo.service';

export default (uma: Uma, options: any = {}): Koa.Middleware => {
    return (ctx, next) = > {
        const demoService: DemoService = new DemoService(ctx);
        // ...
    };
};
```

- 在 Around 面向切面编程时使用

```javascript
// src/aspect/demo.aspect.ts
import DemoService from '../service/demo.service'

export default async around(proceedPoint: IProceedJoinPoint) {
    const { target, proceed, args } = proceedPoint

    const demoService: DemoService = new DemoService(target.ctx)

    const result = await proceed(...args)

    return result
  }
```

**此外，框架还提供了@Resource 和@Inject 装饰器来实现`IOC容器`和`依赖注入`**

[IOC 参考文档](./IOC.md)
