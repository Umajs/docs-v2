# 统一返回（Result）

在 koa 和大多数框架中，没有统一返回，这样在使用框架返回数据的时候需要额外处理，如果要对返回结果做处理可能需要修改很多地方，但是在进行了统一返回之后这些都变得很简单。

## Result

#### `Result.send(val, status)`

用于快捷返回文本内容，第二个参数为返回状态码。

#### `Result.json(data)`

返回 json 数据，并将`content-type`设置为`application/json`。

#### `Result.jsonp(data, callback)`

以 jsonp 的形式返回数据。

#### `Result.view(templatePath, data)`

通过渲染模板的方式将数据返回。

#### `Result.stream(data, fileName)`

将文件以流（stream）的方式返回

```js
    @Path('/stream')
    donwStream() {
        const rs = fs.createReadStream(path.resolve(__dirname, './template.controller.ts'));
        return Result.stream(rs, 'controller.ts');
    }
```

#### `Result.download(filePath, opts)`

下载文件

```js
    @Path('/download')
    downFile() {
        return Result.download('/src/controller/template.controller.ts');
    }
```


#### `Result.done()`

使用 ctx 进行完了操作，不需要使用 Result 进行其它的返回时使用此方法，常用于框架的迁移。

> 例如下面两个方法 `json1` 和 `json2` 表示的意思是一样的。

```js
export default class extends BaseController {
  json1() {
    this.ctx.body = 'Hello' // ctx 响应

    return Result.done()
  }

  json2() {
    return Result.send('Hello')
  }
}
```

## 实例

### controller 实例

Uma 在需要的模板返回的数据中加入 version，这里我们用 Around 可以很容易做到。

```javascript
// version.aspect.ts
import { IJoinPoint, IProceedJoinPoint, Result } from '@umajs/core';

export const version =  async(proceedPoint: IProceedJoinPoint<any>) {
        const result: Result = await proceedPoint.proceed();

        result.data.version = 'v1.0.0';

        return result;
}

// info.controller.ts
import { BaseController, Aournd, Result } from '@umajs/core';
import { version } from './aspect/version.aspect'
export default class Info extends BaseController {

    @Aournd(version)
    info() {
        return Result.view('info.html', {});
    }
}
```

### controller 参数实例

[createArgDecorator 参考文档](./Decorator.html#自定义参数装饰器-createargdecorator)

## 扩展

想要扩展 `Result` 的返回方法，请使用 `plugin` 的扩展方式，示例如下：

> 扩展带状态的 redirect 方法

```js
// plugin.config.ts
export default {
  redirect: true,
}
```

```js
// plugins/redirect/index.ts
import { IContext, TPlugin, RequestMethod, Result as R } from '@umajs/core'

type TRedirect2 = {
  url: string,
  status: number,
}

export class Result extends R {
  static redirect2(url: string, status: number) {
    return new Result({
      type: 'redirect2',
      data: {
        url,
        status,
      },
    })
  }
}

export default (): TPlugin => {
  return {
    results: {
      redirect2(ctx: IContext, data: TRedirect2) {
        const { url, status } = data

        ctx.status = status

        return ctx.redirect(url)
      },
    },
  }
}
```

```js
// index.controller.ts
import { BaseController, Path } from '@umajs/core'
import { Result } from '../plugins/test/index'

export default class Index extends BaseController {
  @Path('/r')
  extendResult() {
    return Result.redirect2('/', 301)
  }
}
```
