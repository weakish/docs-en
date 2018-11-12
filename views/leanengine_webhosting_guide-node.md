
{# Specify inheritance template #}  {% extends "./leanengine_webhosting_guide.tmpl" %} {% set productName = 'LeanEngine' %} {% set platformName = 'Node.js' %} {% set fullName = productName + ' ' + platformName %} {% set sdk_name = 'JavaScript' %} {% set leanengine_middleware = 'LeanEngine Node.js SDK' %}

{% block getting_started %}

Clone the sample code node-js-getting-started to local:

```sh
git clone https://github.com/leancloud/node-js-getting-started.git
```

Execute the following command in the root directory to install dependencies:


```sh
npm install
```

{% endblock %}

{% block custom_runtime %} {% endblock %}

{% block project_constraint %}


Project skeleton
Take the example project as an example, in the root directory we see a `package.json` file. Note: **All Node.js projects must contain `package.json` in order to be correctly recognized by LeanEngine as a Node.js project.

Because of some historical issues, please make sure that there is ** no ** file named `cloud/main.js` in your project.

#### package.json

There are [many options](https://docs.npmjs.com/files/package.json)that can be specified in the `package.json`of Node.js , which usually looks like this:


```json
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
```

Options that LeanEngine will respect include:
* `scripts.start` The command to start the project; the default is `node server.js`, which can be modified if you want to attach startup options to the node (such as `--es_staging`) or use other files as entry points.
* `scripts.prepublish`will be run once at the end of the project build up; you can write the build commands such as `gulp build`can be written here.
* `engines.node` specifies the required version of Node.js; for compatibility reasons, the default version is still the older 0.12, so it is recommended that you specify a higher version yourself. It is recommended to use the 8.x version for development, you can also set a `*`  which means you are always using the latest version of Node.js.
* `dependencies`  for the dependencies project ; LeanEngine will use `npm install --production` during deployment to list all the dependencies here for you. If a dependency has peerDependencies, please make sure they are also listed in `dependencies` (not `devDependencies`).

* `devDependencies` The package that devDependencies depends on when developing the project; currently, LeanEngine does **not** install the dependencies here.

We suggest you write your own `package.json` with reference to our [project template](https://github.com/leancloud/node-js-getting-started/blob/master/package.json).

We also provide support for `package-lock.json` and `yarn.lock` :


- If your application directory contains `package-lock.json`, it will be installed as described in lock (requires Node.js 8.0 or higher).
- If your application directory contains`yarn.lock`, then `yarn install` will be used instead of `npm install` to install dependencies (requires Node.js 4.8 and above).



<div class="callout callout-info"> Note that `package-lock.json` and `yarn.lock` contain the URLs for download dependencies, so if you use the source of npmjs.org when generating the lock file, then the deployment on the Chinese node may be slower; On the contrary,  if you use the source of cnpmjs.org is during the build up, the deployment on the US nodes may be slower. If you don't want to use `package-lock.json` and `yarn.lock`, add them to `.gitignore` (Git deployment) or `.leanengineignore` (when the command line tool is deployed).</div>
{% endblock %}

{% block supported_frameworks %}


At this point, you have deployed a site that can be accessed from the external network to LeanEngine. Next, we will introduce more features and technical points to help you develop a website that meets your needs.


## Access to the web framework

If you are careful enough, you will find we have used a popular Node Web framework [express](http://expressjs.com/) in the `package.json` in the sample project.

The Node SDK provides integrated support for[express](http://expressjs.com/) and [koa](http://koajs.com/). 

If you already have a ready-made project using these two frameworks, simply load the middleware provided by the Node SDK into the current project by:


```sh
npm install --save leanengine leancloud-storage
```

The code for the reference and configuration is as follows:


#### Express

```js
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
```
You can use the definition feature of the router to define a custom HTTP API:

```js
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

```
For more best practices, please refer to our [Project template](https://github.com/leancloud/node-js-getting-started) and [LeanEngine project examples](leanengine_examples.html).

#### Koa

```js
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
```

You can use koa to render the page and provide a custom HTTP API:


```js
app.use(function *(next) {
  if (this.url === '/todos') {
    return new AV.Query('Todo').find().then(todos => {
      this.body = todos;
    });
  } else {
    yield next;
  }
});

```

When using Koa, it is recommended to set the version of Node.js to 4.x or higher according to the previous [package.json](#package_json) section. 


#### Other web framework

You can also use other web frameworks for development, but you need to implement the logic mentioned in [the health monitoring section](#Health monitoring) yourself. Here's a simple example of using the built-in [http](https://nodejs.org/api/http.html)  implementation of Node.js for reference:

```js
require('http').createServer(function(req, res) {
  if (req.url == '/') {
    res.statusCode = 200;
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(process.env.LEANCLOUD_APP_PORT);
```

You need to listen on `0.0.0.0`(the default behavior of Node.js and of express) instead of `127.0.0.1`.

#### Routing timeout setting

Because the asynchronous call of Node.js is easy to be interrupted due to runtime errors or coding inadvertently, in order to reduce the memory usage of the server in this case, and also for the client to receive the error prompt earlier, you need to add this setting once When a timeout occurs, the server will return an HTTP error code to the client.


When using a custom route implemented by the framework, the default timeout for the request is 15 seconds, which can be adjusted in `app.js`:

```js
// Set default timeout
app.use(timeout('15s'));
```
{% endblock %}

{% block use_leanstorage %}

## Use data storage service

The [data storage service](storage_overview.html) is a structured data storage service provided by LeanCloud. When you need to store some persistent data in web development, you can use the storage service to store data, such as the user's mailbox, profile photo and so on.


The Node SDK (leanengine) in LeanEngine provides the cloud functions that the server requires and related support for the Hook . It also needs the JavaScript SDK (leancloud-storage) to be installed together with the peerDependency. Please also upgrade the JavaScript SDK when upgrading the Node SDK:


```bash
npm install --save leanengine leancloud-storage
```

The[API documentation](https://github.com/leancloud/leanengine-node-sdk/blob/master/API.md) and [Update logs](https://github.com/leancloud/leanengine-node-sdk/releases)of the Node SDK are on GitHub.

```js
// leanengine 和 leancloud-storage 
// Leanengine and leancloud-storage export the same object
var AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || '{{appid}}',
  appKey: process.env.LEANCLOUD_APP_KEY || '{{appkey}}',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || '{{masterkey}}'
});


// You can use the useMasterKey to turn on the masterKey permission in LeanEngine, which will skip ACLs and other permission restrictions.

AV.Cloud.useMasterKey();

// Use JavaScript's API to query data in cloud storage.
new AV.Query('Todo').find().then(function(todos) {
  console.log(todos);
}).catch(function(err) {
  console.log(err)
});

```
{{ docs.note("If you need to turn off global masterKey permissions separately in some operations, please refer to [LeanEngine Functions·Permission Description](leanengine_cloudfunction_guide-node.html#Master_Key_and super permission)。") }}


The historical version of the Node SDK:

* `0.x` The original version is not compatible with Node.js 4.x and above. It is recommended that users upgrade to LeanEngine Node.js SDK 1.0 to update
* `1.x`：The global `currentUser` is completely abandoned, and the dependent JavaScript is also upgraded to the 1.x branch, supporting Koa and Node.js 4.x and above.
* `2.x`： Provides support for Promise-style cloud functions, Hook writing, removes some enabled features (AV.Cloud.httpRequest), and no longer supports Backbone-style callback functions.
* `3.x`：**Recommended version**, specify the JavaScript SDK as peerDependency (allowing custom JS SDK), upgrade the JS SDK to 3.x

You can see the following code in `routes/todo.js` in the sample project:

```js
var router = require('express').Router();
var AV = require('leanengine');

···

// Add a new Todo project
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var todo = new Todo();
  todo.set('content', content);
  todo.save().then(function(todo) {
    res.redirect('/todos');
  }).catch(next);
});
```
The demonstration here is to store a Todo object to the data storage service. For more usage, please refer to:[Data Storage Development Guide · JavaScript](leanstorage_guide-js.html)

{% endblock %}

{% block get_env %}

```js
var NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') { 
  // The current environment is the "development environment", which is started by the command line tool.

} else if(NODE_ENV == 'production') {
  // The current environment is the "production environment" and is the official online environment.

} else { 
  // The current environment is the "prepared environment"

}
```
{{ docs.alert("`NODE_ENV` is a reserved system variable, such as the value of production in the production environment and value of the staging in the standby environment. Developers cannot override their values through custom environment variables.") }} 
{% endblock %}

{% block cookie_session %}

### Managing on the server-end

If your page is primarily rendered by the server (for example, using ejs, pug), and the front end does not need to use the JavaScript SDK for data manipulation, then it is recommended that you use a `CookieSession` middleware we provide to maintain user state in the cookie:

```js
app.use(AV.Cloud.CookieSession({ secret: 'my secret', maxAge: 3600000, fetchUser: true }));
```

Koa needs to add a  `framework: 'koa'`parameters:

```js
app.use(AV.Cloud.CookieSession({ framework: 'koa', secret: 'my secret', maxAge: 3600000, fetchUser: true }));
```
{{ docs.alert("while you are using a CookieSession, you need a [CSRF Token](leanengine_webhosting_guide-node.html#CSRF_Token) to protect against CSRF attacks.") }}

You need to pass in a secret for signing the cookie (must be provided). This middleware will record the login status information of  `AV.User` into the cookie. The user will automatically check if the user has logged in the next login. If you have already logged in, you can obtain the current login user via  `req.currentUser`.

The options supported by `AV.Cloud.CookieSession` include:

* **fetchUser** : **Whether or not automatically fetch the currently logged in AV.User object. The default is false.** If it is set to true, every HTTP request will initiate a LeanCloud API call to fetch the user object. If it is set to false, by default you can only access the `id` of the req.currentUser (the ObjectId recorded by `_User` table) and the `sessionToken` attribute, and you can manually fetch the entire user when needed.
* **name**： The name of the cookie. The default is `avos.sess`.
* **maxAge**： Set the expiration time of the cookie. In milliseconds.

After Node SDK 1.x we are no longer allowed to get the login user's information via `AV.User.current()` (detail see [upgrade to Leanengine Node.js SDK 1.0](leanengine-node-sdk-upgrade-1.html#abandon_currentUser)），instead, you need：

* In LeanEngine method,you use `request.currentUser` to obtain user information.
* In web hosting, you use `request.currentUser` to obtain user information
* Pass the user object explicitly in subsequent calls.

You can easily implement a site with login capabilities like this:

```js
// Handling login requests (may come from forms in the login interface)
app.post('/login', function(req, res) {
  AV.User.logIn(req.body.username, req.body.password).then(function(user) {
    res.saveCurrentUser(user); // Cookie Save current user to cookie
    res.redirect('/profile'); // Jump to the profile page
  }, function(error) {
    // Login failed, jump to login page
    res.redirect('/login');
  });
})

// View profile
app.get('/profile', function(req, res) {
  // Determine if the user has logged in
  if (req.currentUser) {
    // If the user has already logged in, send the current login user information.
    res.send(req.currentUser);
  } else {
    // If not, jump to the login page.
    res.redirect('/login');
  }
});

// Log out
app.get('/logout', function(req, res) {
  req.currentUser.logOut();
  res.clearCurrentUser(); // 从 Cookie 中删除用户 Remove users from cookies
  res.redirect('/profile');
});
```

#### Maintained on the browser side

If your page is mainly rendered by the browser (for example, using Vue, React, Angular), and mainly using JavaScript SDK for data operations on the frontend, it is recommended to use `AV.User.login` to login on the frontend, use the login status of the frontend as the standard.

When the backend needs to do some work using the current status of the login user, the frontend gets the `user.getSessionToken()`  through user.getSessionToken(), and then sends the sessionToken to the backend via HTTP Header.

For example on the frontend:

```javascript
AV.User.login(user, pass).then( user => {
  return fetch('/profile', headers: {
    'X-LC-Session': user.getSessionToken()
  });
});
```

Also on the backend:

```javascript
app.get('/profile', function(req, res) {
  //  Query current user based on sessionToken
  AV.User.become(req.headers['x-lc-session']).then( user => {
    res.send(user);
  }).catch( err => {
    res.send({error: err.message});
  });
});

app.post('/todos', function(req, res) {
  var todo = new Todo();
  // Specify sessionToken when performing data operations
  todo.save(req.body, {sessionToken: req.headers['x-lc-session']}).then( () => {
    res.send(todo);
  }).catch( err => {
    res.send({error: err.message});
  });
});

```
{% endblock %}

{% block http_client %}

It is recommended to use the [request](https://www.npmjs.com/package/request), a third-party module to complete the HTTP request.

Install request:

```sh
npm install request --save
```
Code example:

```js
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
```
{% endblock %}

{% block code_get_client_ip_address %}
```js
app.get('/', function(req, res) {
  var ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ipAddress);
  res.send(ipAddress);
});
```
{% endblock %}

{% block upload_file_special_middleware %} 
Then configure the app to use [multiparty](https://www.npmjs.com/package/multiparty) middleware: 

```nodejs
var multiparty = require('multiparty');
```
{% endblock %}

{% block code_upload_file_sdk_function %}

```nodejs
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
```
{% endblock %}

{% block custom_session %} If you need to save some properties in the session. You can add the generic  `cookie-session` component. For details, see [express.js &middot; cookie-session](https://github.com/expressjs/cookie-session). This component and the `AV.Cloud.CookieSession` component can coexist.

 `express.session.MemoryStore ` in <div class="callout callout-info">express framework can not working normally in LeanEngine. Because LeanEngine runs in multiple processes and hosts, in-memory sessions cannot be shared. It is recommended to use [express.js &middot; cookie-session middleware](https://github.com/expressjs/cookie-session).</div>
{% endblock %}

{% block csrf_token %}In express, you can realise CSRF Token by using the library of [csurf](https://github.com/expressjs/csurf).
{% endblock %}


{% block leancache %} 
First add the relevant dependencies into`package.json`  :

```json
"dependencies": {
  ...
  "redis": "2.2.x",
  ...
}
```

Then you can get the Redis connection using the following code:

```js
var client = require('redis').createClient(process.env['REDIS_URL_<Example Name>']);
// It is recommended to increase the client's on error event processing. Otherwise, the application process may be quit due to network fluctuations or redis server master-slave switching.
client.on('error', function(err) {
  return console.error('redis err: %s', err);
});
```
{% endblock %}

{% block https_redirect %} Express:

```js
app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());
```
Koa:

```js
app.proxy = true;
app.use(AV.Cloud.HttpsRedirect({framework: 'koa'}));
```
{% endblock %}

{% block extra_examples %}

### Multi-process operation

Because of the single-threaded model of Node.js itself, you can't make full use of multiple CPU cores, so if you use an instance of 2CPU or above, you need to configure the multi-process operation by using [cluster](https://nodejs.org/api/cluster.html) of Node.js's to create a `server-cluster.js`:

```js
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
```
Then in `package.json`, change `scripts.start` to`node server-cluster.js` :

```json
"scripts": {
  "start": "node server-cluster.js"
}
```

<div class="callout callout-info"> Multi-process operation requires that your program does not maintain global state (such as locks) in memory. It is recommended to perform sufficient tests when switching to multi-process or multi-instance for the first time.</div>

{% endblock %}

{% block depentencyCache %} For example, if the node project is deployed twice in a row and `package.json` is not modified, then the cached dependencies are used directly. 
{% endblock %}


{% block code_calling_custom_variables %}

```nodejs
// Use custom environment variables in LeanEngine Node.js environment
var MY_CUSTOM_VARIABLE = process.env.MY_CUSTOM_VARIABLE;
console.log(MY_CUSTOM_VARIABLE);
```
{% endblock %}

{% block loggerExample %}

```nodejs
console.log('hello');
console.error('some error!');
```
{% endblock %}

{% block loggerExtraDescription %} 
You can print a web request sent by the LeanCloud SDK by setting an environment variable of `DEBUG=leancloud:request`. You can start the program with such a command when debugging locally:

```sh
env DEBUG=leancloud:request lean up
```
When there is a call to LeanCloud, you can see a log like this:

```
leancloud:request request(0) +0ms GET https://{{host}}/1.1/classes/Todo?&where=%7B%7D&order=-createdAt { where: '{}', order: '-createdAt' }
leancloud:request response(0) +220ms 200 {"results":[{"content":"1","createdAt":"2016-08-09T06:18:13.028Z","updatedAt":"2016-08-09T06:18:13.028Z","objectId":"57a975a55bbb5000643fb690"}]}
```

We do not recommend opening this log on the production environment online, otherwise a large number of logs will be printed.

{% endblock %}

{% block section_timezone %} 
You need to pay attention to the different methods of the Date type in JavaScript. Some will return UTC time and some will return to local time (Beijing time in China):

Function timezone result
--------|--------|-------

`toISOString`|UTC time| 2015-04-09T03:35:09.678Z
`toJSON`（JSON Serialization）|UTC time|2015-04-09T03:35:09.678Z
`toUTCString`|UTC time|Thu, 09 Apr 2015 03:35:09 GMT
`getHours`|UTC time|3
`toString`（`console.log` printing time）|local time|Thu Apr 09 2015 03:35:09 GMT+0000 (UTC)
`toLocaleString`|local time|Thu Apr 09 2015 03:35:09 GMT+0000 (UTC)

Also note that when constructing a Date object, you should also pass to Date a object with a time zone object (either UTC or local time zone, for example, 2011-10-10T14:48:00.000Z instead of 2011-10-10T14:48:00) Otherwise, Date will [not know how to understand this time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).

Reminding to everyone that you need to pay attention to the distinction between constructing and displaying time objects, the phenomenon of 「deviation of eight hours」 will occur. 
{% endblock %}



