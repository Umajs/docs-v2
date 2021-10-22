# 依赖注入（IOC）

IOC(Inversion of Control)控制反转，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。

## 什么是 IOC

`控制反转(Inversion of Control)`是一种借助于`第三方容器`，实现对具有依赖关系的`对象之间解耦`的一种`代码设计思路`。

例如我们的程序中有对象 A、B、C、D 像齿轮一样相互依赖的运作着，如下图：

![images](../../public/images/IOC-di4.png)

我们可以看到，在这样的齿轮组中，如果有一个齿轮出了问题，就可能会影响到整个齿轮组的正常运转。

为了解决对象之间的耦合度过高的问题，软件专家 Michael Mattson 提出了 IOC 理论，借助于“第三方容器”实现对象之间的解耦，如下图：

![images](../../public/images/IOC-di5.png)

由于引进了中间位置的“第三方容器”，也就是`IOC容器`，使得 A、B、C、D 这 4 个对象没有了耦合关系，齿轮之间的传动全部依靠“第三方容器”了，全部对象的控制权全部上缴给“第三方”IOC 容器。

当对象 A 需要用到对象 B 的时候，只需要通过 IOC 容器来获取`对象B的实例`，而不需要自己创建一个对象 B 实例。而 IOC 容器又通过`依赖注入`的方式将对象 A 需要的对象 B 实例`注入`到对象 A 中。

![images](../../public/images/IOC-di3.png)

## @Resource、@Inject 修饰器

Uma 提供了`@Resource修饰器`和`@Inject修饰器`来实现`IOC容器`和`依赖注入`

@Resource 修饰器可以修饰`${URSA_ROOT}中的任意class`，被@Resource 修饰的 class，将会在 IOC 容器中加入一个该`class的实例`

> Resource 装饰器还可以传入参数作为 class 的实例化参数。
> export declare function Resource(...props: any[]): Function;

```js
@Resource('user')
class Test {
    constructor(readonly tablename) {
    }
}
```

@Inject 修饰器可以将`被@Resource修饰过`的 class 的`实例`注入到指定变量中

例如，我们在`${URSA_ROOT}/model`中创建一个`user.model.ts`，并使用@Resource 将该类实例化后加入到资源容器中.

**注意**`inject`装饰器在V2版本之后只接受函数类型参数。

```javascript
import { Resource } from '@umajs/core'

// ===> @Resource修饰器
@Resource()
export default class UserModel {
  findAll() {
    // ...
    return []
  }
}
```

然后我们可以在 controller 中获取该 model 实例

```javascript
import {
  BaseController,
  Path,
  Inject,
} from '@umajs/core'
import UserModel from '../model/user.model'

export default class Index extends BaseController {
  // ===> 获取实例，实例的名称为@Resource修饰的class所在的文件名
  @Inject(UserModel)
  user: UserModel
  @Path('/getUser')
  async testModel() {
    // ===> 这里不需要创建user实例，@Resource已经将userModel实例化保存在容器中
    const userList = await this.user.findAll()
    return this.json(userList)
  }
}
```

@Resource 可以对`任何class进行修饰`，即任何资源都可以加入到容器中，然后通过依赖注入的方式使用。

`@Resource修饰器支持传入参数`，传入的参数将会被作为修饰类实例化时的`构造参数`使用。

## @Service修饰器

除了提供的 `Resource` 和 `Inject` 装饰器，还有一个特殊的依赖注入装饰器 `Service`，`@Service` 装饰器仅提供 `Controller` 使用，为了方便使用，Service 注入中内置了 ctx，框架默认将`${URSA_ROOT}/service`下的文件实例化加入到`service的容器中`，当我们使用的时候，通过`@Service修饰器`去获取该实例。

```javascript
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
import { BaseService } from '@umajs/core'

export default class Demp extends BaseService {
  loadAll() {
    // return
  }
}
```

> @Service 和@Resource 最大的不同是，在@Service 修饰的方法中可以访问到`ctx`上下文对象，而@Resource 没有

### 非 Controller 中使用 @Service 时，必须传入 ctx 进行实例化才能使用或者 service 类不继承 BaseService,使用@Resource 容器修饰此 class。

[Service 参考文档](./Service.md)
