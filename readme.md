## 参数校验方法

###road map
* first koa, then express
* get value, type check, value check(range, enum, hasKey, and so on)
* test drive, debugable, benchmark


### todo
* 最新版的`koa-router`已经不太一样了, 看上去用法和最新版的express一样: `router.get().post()`, 将路由先挂在router上, 都挂好之后, 最后`app.use(router.routers())`应用到app上. 可以适应一下, 将`koa-router`当做内部依赖, 用来绑定路由.  √
* 多handler的情况, 没有param设定的情况
* 参数校验设定和路由不符的时候: url中没有:key, 却要从url中取, 方法不是post/put 却要从body中取. 在绑定的时候抛出错误

### 原理解析
* binder: 扫描和绑定路由, 在启动程序时执行   [80%]()
* docer: 提供api列表, 文档说明, api试用    [0%]()
* checker: 参数获取和校验, 在请求过来&进入handler之前执行   [30%]()
