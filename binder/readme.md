## binder机制

* glob匹配文件 √
* require模块 √
* 检查是否有controller √
* 绑定到路由 √
* 绑定到app √

## 约定规则:

1. 文件扫描: 默认去找app.js(process.mainModule.filename)统一层级的`controller`目录, 然后扫描其中所有的`.js .coffee`结尾的文件
2. 路由导出: binder会require所有匹配到的文件, 看是否有`controllers`属性导出
3. url预处理: `controllers`数组中的每一个对象的url, 都应该是基于当前文件相对`./controller`目录的路径之外的url值, 即最终处理出来的绑定的url, 是`路由文件相对路径 + 文件中声明的url`, 如: `./controller/post/index.js`中有一个url: `/:id`, 那么最终绑定的就是`/post/:id`,

**注意:**
1. 文件名也会被添加到url中, `index.js`除外
2. 正则表达式的路由url, 不会进行处理, 按用户手写的值进行绑定
3. 文件名也会被添加, 那就需要注意不要有同一层级内文件名和文件夹名字一样, 路由url文件名一样
