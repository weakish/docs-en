
{# Specify inheritance template #}  {% extends "./leanengine_webhosting_guide.tmpl" %} {% set productName = 'LeanEngine' %} {% set platformName = 'Node.js' %} {% set fullName = productName + ' ' + platformName %} {% set sdk_name = 'JavaScript' %} {% set leanengine_middleware = 'LeanEngine Node.js SDK' %}


{% block getting_started %}

将示例代码 node-js-getting-started 克隆到本地：
Clone the sample code node-js-getting-started to local:


git clone https://github.com/leancloud/node-js-getting-started.git
在根目录执行如下命令安装依赖：
Execute the following command in the root directory to install dependencies:

npm install 
{% endblock %}

{% block custom_runtime %} {% endblock %}

{% block project_constraint %}

项目骨架
Project skeleton
以示例项目为例，在根目录我们看到有一个 package.json 文件，注意：所有 Node.js 的项目必须包含package.json 才会正确地被云引擎识别为 Node.js 项目。
Take the example project as an example. In the root directory we see a package.json file. Note: All Node.js projects must contain package.json in order to be correctly recognized by the LeanEngine as a Node.js project.

因为一些历史遗留问题，请确保你的项目中 **没有** 名为 `cloud/main.js` 的文件。
Because of some historical issues, please make sure that there is ** no ** file named `cloud/main.js` in your project.
package.json
Node.js 的 package.json 中可以指定 很多选项，它通常看起来是这样：
There are many options that can be specified in the package.json of Node.js , which usually looks like this:

{
    "name": "node-js-getting-started",
    "scripts": {
        "start": "node server.js"
    },
    "engines": {
        "node": "8.x"
    },
    "dependencies": {
        "express": "4.12.3",
        "leanengine": "^3.0.2",
        "leancloud-storage": "^3.3.1"
    }
}
其中云引擎会尊重的选项包括：
Options that the LeanEngine will respect include:

scripts.start 启动项目时使用的命令；默认为 node server.js，如果你希望为 node 附加启动选项（如 --es_staging）或使用其他的文件作为入口点，可以修改该选项。
Scripts.start The command to start the project; the default is node server.js, which can be modified if you want to attach startup options to the node (such as --es_staging) or use other files as entry points.

scripts.prepublish 会在项目构建结束时运行一次；可以将构建命令（如 gulp build）写在这里。
Scripts.prepublish will be run once at the end of the project build up; you can write the build commands such as gulp build can be written here.

engines.node 指定所需的 Node.js 版本；出于兼容性考虑默认版本仍为比较旧的 0.12，因此建议大家自行指定一个更高的版本，建议使用 8.x 版本进行开发，你也可以设置为 * 表示总是使用最新版本的 Node.js。
engines.node specifies the required version of Node.js; for compatibility reasons, the default version is still the older 0.12, so it is recommended that you specify a higher version yourself. It is recommended to use the 8.x version for development, you can also set a * which means always using the latest version of Node.js.


dependencies 项目所依赖的包；云引擎会在部署时用 npm install --production 为你安装这里列出的所有依赖。如果某个依赖有 peerDependencies，请确保它们也被列在 dependencies（而不是 devDependencies）中。
dependency package for the dependencies project ; the LeanEngine will use npm install during deployment--production will list all the dependencies here for you. If a dependency has peerDependencies, please make sure they are also listed in dependencies (not devDependencies).

devDependencies 项目开发时所依赖的包；云引擎目前 不会 安装这里的依赖。
The package that devDependencies depends on when developing the project; the LeanEngine does not currently install the dependencies here.

建议你参考我们的 项目模板 来编写自己的 package.json。
I suggest you write your own package.json with reference to our project template.

我们也对 package-lock.json 和 yarn.lock 提供了支持：
We also provide support for package-lock.json and yarn.lock:


如果你的应用目录中含有 package-lock.json，那么会根据 lock 中的描述进行安装（需要 Node.js 8.0 以上）。
If your application directory contains package-lock.json, it will be installed as described in lock (requires Node.js 8.0 or higher).

如果你的应用目录中含有 yarn.lock，那么会使用 yarn install 代替 npm install 来安装依赖（需要 Node.js 4.8 以上）。
If your application directory contains yarn.lock, then yarn install will be used instead of npm install to install dependencies (requires Node.js 4.8 and above).

注意 `package-lock.json` 和 `yarn.lock` 中包含了下载依赖的 URL，因此如果你生成 lock 文件时使用了 npmjs.org 的源，那么在中国节点的部署可能会变慢；反之如果生成时使用了 cnpmjs.org 的源，那么在美国节点的部署可能会变慢。如果不希望使用 `package-lock.json` 和 `yarn.lock`，请将它们加入 `.gitignore`（Git 部署时）或 `.leanengineignore`（命令行工具部署时）。
{% endblock %}
Note that `package-lock.json` and `yarn.lock` contain the URLs for download dependencies, so if you use the source of npmjs.org when generating the lock file, then the deployment on the Chinese node may be slower; On the contrary,  if you use the source of cnpmjs.org is during the build up, the deployment on the US nodes may be slower. If you don't want to use `package-lock.json` and `yarn.lock`, add them to `.gitignore` (Git deployment) or `.leanengineignore` (when the command line tool is deployed).
{% endblock %}

{% block supported_frameworks %}

至此，�你已经部署了一个可以从外网访问的站点到云引擎，接下来�会介绍更多功能和技术点，帮助你开发出一个满足你需求的网站。
At this point, you have deployed a site that can be accessed from the external network to the LeanEngine. Next, we will introduce more features and technical points to help you develop a website that meets your needs.

接入 Web 框架
Access to the web framework

细心的开发者已经发现在示例项目中的 package.json 中引用了一个流行的 Node Web 框架 express。
If you are careful enough, you will find we have used a popular Node Web framework in the package.json in the sample project.

Node SDK 为 express 和 koa 提供了集成支持。
The Node SDK provides integrated support for express and koa.

如果你已经有了现成的项目使用的是这两个框架，只需通过下面的方式加载 Node SDK 提供的中间件到当前项目中即可：
If you already have a ready-made project using these two frameworks, simply load the middleware provided by the Node SDK into the current project by:

npm install --save leanengine leancloud-storage
引用和配置的代码如下：
The code for the reference and configuration is as follows:


Express
var express = require('express');
var AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || '{{appid}}',
  appKey: process.env.LEANCLOUD_APP_KEY || '{{appkey}}',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || '{{masterkey}}'
});

var app = express();
app.use(AV.express());
app.listen(process.env.LEANCLOUD_APP_PORT);
你可以使用 express 的路由定义功能来提供自定义的 HTTP API：
You can use the definition feature of the router to define a custom HTTP API:

app.get('/', function(req, res) {
  res.render('index', {title: 'Hello world'});
});

app.get('/time', function(req, res) {
  res.json({
    time: new Date()
  });
});

app.get('/todos', function(req, res) {
  new AV.Query('Todo').find().then(function(todos) {
    res.json(todos);
  }).catch(function(err) {
    res.status(500).json({
      error: err.message
    });
  });
});
更多最佳实践请参考我们的 项目模板 和 云引擎项目示例。
For more best practices, please refer to our project template and LeanEngine project examples.

Koa
var koa = require('koa');
var AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || '{{appid}}',
  appKey: process.env.LEANCLOUD_APP_KEY || '{{appkey}}',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || '{{masterkey}}'
});

var app = koa();
app.use(AV.koa());
app.listen(process.env.LEANCLOUD_APP_PORT);
你可以使用 koa 来渲染页面、提供自定义的 HTTP API：
You can use koa to render the page and provide a custom HTTP API:


app.use(function *(next) {
  if (this.url === '/todos') {
    return new AV.Query('Todo').find().then(todos => {
      this.body = todos;
    });
  } else {
    yield next;
  }
});
使用 Koa 时建议按照前面 package.json 一节将 Node.js 的版本设置为 4.x 以上。
When using Koa, it is recommended to set the version of Node.js to 4.x or higher according to the previous package.json section. 

其他 Web 框架
Other web framework

你也可以使用其他的 Web 框架进行开发，但你需要自行去实现 健康监测 中提到的逻辑。下面是一个使用 Node.js 内建的 http 实现的最简示例，可供参考：
You can also use other web frameworks for development, but you need to implement the logic mentioned in the health monitoring yourself. Here's a simple example of using the built-in http implementation of Node.js for reference:

require('http').createServer(function(req, res) {
  if (req.url == '/') {
    res.statusCode = 200;
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(process.env.LEANCLOUD_APP_PORT);
你需要将 Web 服务监听在 0.0.0.0 上（Node.js 和 express 的默认行为）而不是 127.0.0.1。
You need to listen to the web service on 0.0.0.0 (the default behavior of Node.js and of express) instead of 127.0.0.1.

路由超时设置
Routing timeout setting
因为 Node.js 的异步调用容易因运行时错误或编码疏忽中断，为了减少在这种情况下对服务器内存的占用，也为了客户端能够更早地收到错误提示，所以需要添加这个设置，一旦发生超时，服务端会返回一个 HTTP 错误码给客户端。
Because the asynchronous call of Node.js is easy to be interrupted due to runtime errors or coding inadvertently, in order to reduce the memory usage of the server in this case, and also for the client to receive the error prompt earlier, you need to add this setting once When a timeout occurs, the server will return an HTTP error code to the client.

使用框架实现的自定义路由的时候，请求默认的超时时间为 15 秒，该值可以在 app.js 中进行调整：
When using a custom route implemented by the framework, the default timeout for the request is 15 seconds, which can be adjusted in app.js:


// 设置默认超时时间 Set default timeout
app.use(timeout('15s'));
{% endblock %}

{% block use_leanstorage %}

使用数据存储服务 Use data storage service
数据存储服务 是 LeanCloud 提供的结构化数据存储服务，在网站开发中如果遇到需要存储一些持久化数据的时候，可以使用存储服务来保存数据，例如用户的邮箱，头像等。
The data storage service is a structured data storage service provided by LeanCloud. When you need to store some persistent data in web development, you can use the storage service to save data, such as the user's mailbox, avatar, and so on.

云引擎中的 Node SDK（leanengine）提供了服务器端需要的云函数和 Hook 相关支持，同时需要 JavaScript SDK（leancloud-storage）作为 peerDependency 一同安装，在升级 Node SDK 也请记得升级 JavaScript SDK：
The Node SDK (leanengine) in the LeanEngine provides the cloud functions that the server requires and related support for the Hook . It also needs the JavaScript SDK (leancloud-storage) to be installed together with the peerDependency. Please also upgrade the JavaScript SDK when upgrading the Node SDK:


npm install --save leanengine leancloud-storage
Node SDK 的 API 文档 和 更新日志 都在 GitHub 上。
The API documentation and update logs for the Node SDK are on GitHub.

// leanengine 和 leancloud-storage 导出的是相同的对象 
// Leanengine and leancloud-storage export the same object
var AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || '{{appid}}',
  appKey: process.env.LEANCLOUD_APP_KEY || '{{appkey}}',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || '{{masterkey}}'
});

// 你可以使用 useMasterKey 在云引擎中开启 masterKey 权限，将会跳过 ACL 和其他权限限制。
// You can use the useMasterKey to turn on the masterKey permission in the LeanEngine, which will skip ACLs and other permission restrictions.

AV.Cloud.useMasterKey();

// 使用 JavaScript 的 API 查询云存储中的数据。 Use JavaScript's API to query data in cloud storage.
new AV.Query('Todo').find().then(function(todos) {
  console.log(todos);
}).catch(function(err) {
  console.log(err)
});
{{ docs.note("如果需要单独在某些操作中关闭全局的 masterKey 权限，请参考 云函数·权限说明。") }}
If you need to turn off global masterKey permissions separately in some operations, please refer to LeanEngine Functions and Permissions Description.

Node SDK 的历史版本：
The historical version of the Node SDK:

0.x：最初的版本，对 Node.js 4.x 及以上版本兼容不佳，建议用户参考 升级到云引擎 Node.js SDK 1.0 来更新
0.x: The original version is not compatible with Node.js 4.x and above. It is recommended that users upgrade to the cloud engine Node.js SDK 1.0 to update

1.x：彻底废弃了全局的 currentUser，依赖的 JavaScript 也升级到了 1.x 分支，支持了 Koa 和 Node.js 4.x 及以上版本
1.x: The global currentUser is completely abandones, and the dependent JavaScript is also upgraded to the 1.x branch, supporting Koa and Node.js 4.x and above.

2.x：提供了对 Promise 风格的云函数、Hook 写法的支持，移除了一些被启用的特性（AV.Cloud.httpRequest），不再支持 Backbone 风格的回调函数
2.x: Provides support for Promise-style cloud functions, Hook writing, removes some enabled features (AV.Cloud.httpRequest), and no longer supports Backbone-style callback functions.

3.x：推荐使用 的版本，指定 JavaScript SDK 为 peerDependency（允许自定义 JS SDK 的版本），升级 JS SDK 到 3.x
3.x: Recommended version, specify the JavaScript SDK as peerDependency (allowing custom JS SDK), upgrade the JS SDK to 3.x

在示例项目中的 routes/todo.js 中可以看见如下代码：
You can see the following code in routes/todo.js in the sample project:


var router = require('express').Router();
var AV = require('leanengine');

···

// 新增 Todo 项目 Add a Todo project
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var todo = new Todo();
  todo.set('content', content);
  todo.save().then(function(todo) {
    res.redirect('/todos');
  }).catch(next);
});
这里演示的就是向数据存储服务存储一个 Todo 对象。更多用法请参考：数据存储开发指南 · JavaScript
The demonstration here is to store a Todo object to the data storage service. For more usage, please refer to: Data Storage Development Guide · JavaScript

{% endblock %}

{% block get_env %}

var NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') {
  // 当前环境为「开发环境」，是由命令行工具启动的 
  // The current environment is the "development environment", which is started by the command line tool.

} else if(NODE_ENV == 'production') {
  // 当前环境为「生产环境」，是线上正式运行的环境
  // The current environment is the "production environment" and is the official online environment.

} else {
  // 当前环境为「预备环境」 
  // The current environment is the "prepared environment"

}
{{ docs.alert("NODE_ENV is a reserved system variable, such as the value of production in the production environment and value of the staging in the standby environment. Developers cannot override their values through custom environment variables.") }} {% endblock %}

{% block cookie_session %}

在服务器端管理 Management on the server side
如果你的页面主要是由服务器端渲染（例如使用 ejs、pug），在前端不需要使用 JavaScript SDK 进行数据操作，那么建议你使用我们提供的一个 CookieSession 中间件，在 Cookie 中维护用户状态：
If your page is primarily rendered by the server (for example, using ejs, pug), and the front end does not need to use the JavaScript SDK for data manipulation, then it is recommended that you use a CookieSession middleware we provide to maintain user state in the cookie:

app.use(AV.Cloud.CookieSession({ secret: 'my secret', maxAge: 3600000, fetchUser: true }));
Koa 需要添加一个 framework: 'koa' 的参数：
Koa needs to add a framework: 'koa' parameters:


app.use(AV.Cloud.CookieSession({ framework: 'koa', secret: 'my secret', maxAge: 3600000, fetchUser: true }));
{{ docs.alert("while you are using a CookieSession, you need a CSRF Token to protect against CSRF attacks.") }}

你需要传入一个 secret 用于签名 Cookie（必须提供），这个中间件会将 AV.User 的登录状态信息记录到 Cookie 中，用户下次访问时自动检查用户是否已经登录，如果已经登录，可以通过 req.currentUser 获取当前登录用户。
You need to pass in a secret for signing the cookie (must be provided). This middleware will record the login status information of AV.User into the cookie. The user will automatically check if the user has logged in the next login. If you have already logged in, you can obtain the current login user via req.currentUser.

AV.Cloud.CookieSession 支持的选项包括：
The options supported by AV.Cloud.CookieSession include:


fetchUser：是否自动 fetch 当前登录的 AV.User 对象。默认为 false。 如果设置为 true，每个 HTTP 请求都将发起一次 LeanCloud API 调用来 fetch 用户对象。如果设置为 false，默认只可以访问 req.currentUser 的 id（_User 表记录的 ObjectId）和 sessionToken 属性，你可以在需要时再手动 fetch 整个用户。
fetchUser: Whether or not automatically fetch the currently logged in AV.User object. The default is false. If it is set to true, every HTTP request will initiate a LeanCloud API call to fetch the user object. If it is set to false, by default you can only access the id of the req.currentUser (the ObjectId of the _User table record) and the sessionToken attribute, and you can manually fetch the entire user when needed.



name：Cookie 的名字，默认为 avos.sess。
Name: The name of the cookie. The default is avos.sess.

maxAge：设置 Cookie 的过期时间。单位毫秒。
maxAge: Set the expiration time of the cookie. In milliseconds.

在 Node SDK 1.x 之后我们不再允许通过 AV.User.current() 获取登录用户的信息（详见 升级到云引擎 Node.js SDK 1.0），而是需要你：
After Node SDK 1.x we are no longer allowed to get the login user's information via AV.User.current() (see upgrade to Cloud Engine Node.js SDK 1.0 for detail), but you need:


在云引擎方法中，通过 request.currentUser 获取用户信息。 In the LeanEngine method,use request.currentUser to obtain user information.
在网站托管中，通过 request.currentUser 获取用户信息。 In web hosting, use request.currentUser to obtain user information


>>>>>>>>在后续的方法调用显示传递 user 对象。In the subsequent method call display delivery of the user object.


你可以这样简单地实现一个具有登录功能的站点： You can easily implement a site with login capabilities like this:


// 处理登录请求（可能来自登录界面中的表单） Handling login requests (may come from forms in the login interface)
app.post('/login', function(req, res) {
  AV.User.logIn(req.body.username, req.body.password).then(function(user) {
    res.saveCurrentUser(user); // 保存当前用户到 Cookie Save current user to cookie
    res.redirect('/profile'); // 跳转到个人资料页面 Jump to the profile page
  }, function(error) {
    //登录失败，跳转到登录页面 Login failed, jump to login page
    res.redirect('/login');
  });
})

// 查看个人资料 View profile
app.get('/profile', function(req, res) {
  // 判断用户是否已经登录 Determine if the user has logged in
  if (req.currentUser) {
    // 如果已经登录，发送当前登录用户信息。 If the user has already logged in, send the current login user information.
    res.send(req.currentUser);
  } else {
    // 没有登录，跳转到登录页面。 If not, jump to the login page.
    res.redirect('/login');
  }
});

// 登出账号 Log out
app.get('/logout', function(req, res) {
  req.currentUser.logOut();
  res.clearCurrentUser(); // 从 Cookie 中删除用户 Remove users from cookies
  res.redirect('/profile');
});
在浏览器端维护 Maintained on the browser side
如果你的页面主要是由浏览器端渲染（例如使用 Vue、React、Angular），主要在前端使用 JavaScript SDK 进行数据操作，那么建议在前端使用 AV.User.login 登录，以前端的登录状态为准。
If your page is mainly rendered by the browser (for example, using Vue, React, Angular), and mainly using JavaScript SDK for data operations on the front end, it is recommended to use AV.User.login login on the front end, which is subject to the login status of the front end.

当后端需要以当前用户的身份完成某些工作时，前端通过 user.getSessionToken() 获取 sessionToken，然后通过 HTTP Header 等方式将 sessionToken 发送给后端。
When the backend needs to do some work using the current status of the login user, the frontend gets the sessionToken through user.getSessionToken(), and then sends the sessionToken to the backend via HTTP Header.

例如在前端：For example at the front end:

AV.User.login(user, pass).then( user => {
  return fetch('/profile', headers: {
    'X-LC-Session': user.getSessionToken()
  });
});
同时在后端：Also at the back end

app.get('/profile', function(req, res) {
  // 根据 sessionToken 查询当前用户 Query current user based on sessionToken
  AV.User.become(req.headers['x-lc-session']).then( user => {
    res.send(user);
  }).catch( err => {
    res.send({error: err.message});
  });
});

app.post('/todos', function(req, res) {
  var todo = new Todo();
  // 进行数据操作时指定 sessionToken
  todo.save(req.body, {sessionToken: req.headers['x-lc-session']}).then( () => {
    res.send(todo);
  }).catch( err => {
    res.send({error: err.message});
  });
});
{% endblock %}

{% block http_client %}

推荐使用 request 这个第三方模块来完成 HTTP 请求。
It is recommended to use the request third-party module to complete the HTTP request.

安装 request: Install request:

npm install request --save
代码示例： Code example:

var request = require('request');

request({
  method: 'POST',
  url: 'http://www.example.com/create_post',
  json: {
    title: 'Vote for Pedro',
    body: 'If you vote for Pedro, your wildest dreams will come true'
  }
}, function(err, res, body) {
  if (err) {
    console.error('Request failed with response code ' + res.statusCode);
  } else {
    console.log(body);
  }
});
{% endblock %}

{% block code_get_client_ip_address %}

app.get('/', function(req, res) {
  var ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ipAddress);
  res.send(ipAddress);
});
{% endblock %}

{% block upload_file_special_middleware %} 然后配置应用使用 multiparty 中间件：Then configure the app to use multiparty middleware: 

var multiparty = require('multiparty');
{% endblock %}

{% block code_upload_file_sdk_function %}

var fs = require('fs');
app.post('/upload', function(req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    var iconFile = files.iconImage[0];
    if(iconFile.size !== 0){
      fs.readFile(iconFile.path, function(err, data){
        if(err) {
          return res.send('Failed to read file');
        }
        var theFile = new AV.File(iconFile.originalFilename, data);
        theFile.save().then(function(theFile){
          res.send('Uploaded successfully!');
        }).catch(console.error);
      });
    } else {
      res.send('Please select a file.');
    }
  });
});
{% endblock %}

{% block custom_session %} 有时候你需要将一些自己需要的属性保存在 session 中，你可以增加通用的 cookie-session 组件，详情可以参考 express.js · cookie-session。该组件和 AV.Cloud.CookieSession 组件可以并存。
Sometimes you need to save some of the properties you need in the session. You can add the generic cookie-session component. For details, see express.js · cookie-session. This component and the AV.Cloud.CookieSession component can coexist.

express 框架的 `express.session.MemoryStore` 在云引擎中是无法正常工作的，因为云引擎是多主机、多进程运行，因此内存型 session 是无法共享的，建议用 [express.js · cookie-session 中间件](https://github.com/expressjs/cookie-session)。
The express framework's `express.session.MemoryStore` can not working in the LeanEngine. Because the LeanEngine is multi-host and multi-process running so that the memory session cannot be shared. It is recommended to use [express.js · cookie-session Middleware] (https://github.com/expressjs/cookie-session)
{% endblock %}
{% block csrf_token %} You can realise CSRF Token by using Csurf library in Express {% endblock %}



{% block leancache %} 首先添加相关依赖到 package.json 中：
First add the relevant dependencies into package.json :

"dependencies": {
  ...
  "redis": "2.2.x",
  ...
}
然后可以使用下列代码获取 Redis 连接：
Then you can get the Redis connection using the following code:

var client = require('redis').createClient(process.env['REDIS_URL_<实例名称>']);
// 建议增加 client 的 on error 事件处理，否则可能因为网络波动或 redis server 主从切换等原因造成短暂不可用导致应用进程退出。
// It is recommended to increase the client's on error event processing. Otherwise, the application process may be quit due to network fluctuations or redis server master-slave switching.
client.on('error', function(err) {
  return console.error('redis err: %s', err);
});
{% endblock %}

{% block https_redirect %} Express:

app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());
Koa:

app.proxy = true;
app.use(AV.Cloud.HttpsRedirect({framework: 'koa'}));
{% endblock %}

{% block extra_examples %}

多进程运行 Multi-process operation
因为 Node.js 本身的单线程模型，无法充分利用多个 CPU 核心，所以如果你使用了 2CPU 或以上的实例，需要自行使用 Node.js 的 cluster 配置多进程运行，创建一个 server-cluster.js：
Because of the single-threaded model of Node.js itself, you can't make full use of multiple CPU cores, so if you use an instance of 2CPU or above, you need to configure the multi-process run by using Node.js's cluster to create a server-cluster.js:

var cluster = require('cluster');

var workers = process.env.LEANCLOUD_AVAILABLE_CPUS || 1;

if (cluster.isMaster) {
  for (var i = 0; i < workers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker %s died, restarting...', worker.process.pid);
    cluster.fork();
  });
} else {
  require('./server.js')
}
然后在 package.json 中将 scripts.start 改为 node server-cluster.js 即可：
Then change scripts.start to node server-cluster.js in package.json :

"scripts": {
  "start": "node server-cluster.js"
}
多进程运行要求你的程序中没有在内存中维护全局状态（例如锁），建议在首次切换到多进程或多实例运行时进行充分的测试。
Multi-process operation requires that your program does not maintain global state (such as locks) in memory. It is recommended to perform sufficient tests when switching to multi-process or multi-instance for the first time.

{% endblock %}

{% block depentencyCache %} For example, if the node project is deployed twice in a row and package.json is not modified, then the cached dependencies are used directly. {% endblock %}


{% block code_calling_custom_variables %}

// 在云引擎 Node.js 环境中使用自定义的环境变量 Use custom environment variables in the cloud engine Node.js environment
var MY_CUSTOM_VARIABLE = process.env.MY_CUSTOM_VARIABLE;
console.log(MY_CUSTOM_VARIABLE);
{% endblock %}

{% block loggerExample %}

console.log('hello');
console.error('some error!');
{% endblock %}

{% block loggerExtraDescription %} 你可以通过设置一个 DEBUG=leancloud:request 的环境变量来打印由 LeanCloud SDK 发出的网络请求。在本地调试时你可以通过这样的命令启动程序：
You can print a web request sent by the LeanCloud SDK by setting an environment variable of DEBUG=leancloud:request. You can start the program with such a command when debugging locally:

env DEBUG=leancloud:request lean up
当有对 LeanCloud 的调用时，你可以看到类似这样的日志：
When there is a call to LeanCloud, you can see a log like this:

leancloud:request request(0) +0ms GET https://{{host}}/1.1/classes/Todo?&where=%7B%7D&order=-createdAt { where: '{}', order: '-createdAt' }
leancloud:request response(0) +220ms 200 {"results":[{"content":"1","createdAt":"2016-08-09T06:18:13.028Z","updatedAt":"2016-08-09T06:18:13.028Z","objectId":"57a975a55bbb5000643fb690"}]}
我们不建议在线上生产环境开启这个日志，否则将会打印大量的日志。
We do not recommend opening this log on the production environment online, otherwise a large number of logs will be printed.

{% endblock %}

{% block section_timezone %} 需要注意 JavaScript 中 Date 类型的不同方法，一部分会返回 UTC 时间、一部分会返回当地时间（在中国区是北京时间）：
You need to pay attention to the different methods of the Date type in JavaScript. Some will return UTC time and some will return to local time (Beijing time in China):

函数	时区	结果
Function timezone result

toISOString	UTC time	2015-04-09T03:35:09.678Z
toJSON（JSON Serialization）	UTC time	2015-04-09T03:35:09.678Z
toUTCString	UTC time	Thu, 09 Apr 2015 03:35:09 GMT
getHours	UTC time	3
toString（console.log Printing time）	Local time	Thu Apr 09 2015 03:35:09 GMT+0000 (UTC)
toLocaleString	Local time	Thu Apr 09 2015 03:35:09 GMT+0000 (UTC)
同时在构造 Date 对象时也要注意传递给 Date 一个带时区（无论是 UTC 还是本地时区，例如要使用 2011-10-10T14:48:00.000Z 而不是 2011-10-10T14:48:00）的对象，否则 Date 将 不知道以什么样的方式来理解这个时间。
Also note that when constructing a Date object, you should also pass to Date a object with a time zone object (either UTC or local time zone, for example, 2011-10-10T14:48:00.000Z instead of 2011-10-10T14:48:00) Otherwise, Date will not know how to understand this time.

提醒大家需要在构造和展示时间对象时注意区分，否则就会出现时间「偏差八小时」的现象。 {% endblock %}
Reminding to everyone that you need to pay attention to the distinction between constructing and displaying time objects, the phenomenon of "deviation of eight hours" will occur. {% endblock %}



