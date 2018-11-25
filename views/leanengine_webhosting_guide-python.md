{# Specify inherited template #}
{% extends "./leanengine_webhosting_guide.tmpl" %}

{% set productName = 'LeanEngine' %}
{% set platformName = 'Python' %}
{% set fullName = productName + ' ' + platformName %}
{% set sdk_name = 'Python' %}
{% set leanengine_middleware = '[LeanCloud Python SDK](https://github.com/leancloud/python-sdk)' %}


{% block getting_started %}

将示例代码 [leancloud/python-getting-started](https://github.com/leancloud/python-getting-started) 克隆到本地：
Clone the example code [leancloud/python-getting-started](https://github.com/leancloud/python-getting-started) to local:

```sh
git clone https://github.com/leancloud/python-getting-started.git
```

在本地运行 LeanEngine Python 应用，首先需要这几个依赖：
First you need these dependencies to launch LeanEngine Python Application locally:

- **python**：请确保本地安装的 Python 版本与线上使用的相同，以免不同版本之间的兼容性导致问题。推荐使用 [pyenv](https://github.com/pyenv/pyenv) 来管理本地 Python 版本。
Please make sure the local python version is identical with the online python version to avoid compatibility issues. It is recommended to use [pyenv](https://github.com/pyenv/pyenv)  to locally manage your Python versions.
- **pip**：用来安装第三方依赖。Used to install third-party dependencies
- **virtualenv**：可选，建议使用 virtualenv 或者类似的工具来创建一个独立的 Python 环境，以免项目使用到的依赖与系统／其他项目的版本产生冲突。
Optional, it is recommended to use virtualenv or similar tool to create an independent Python environment to avoid conflict between dependencies used by the project and used by the system/other projects.
请确保以上依赖都已经在本机上安装就绪，然后在项目目录下执行如下命令，来安装项目用到的第三方依赖：
Please make sure the above dependencies are installed locally properly, then execute the following command under the project directory to install the third-party dependencies for the project.

```sh
pip install -r requirements.txt
```

更多有关命令行工具和本地调试的内容请参考 [命令行工具使用指南](leanengine_cli.html)。
Please refer to [Command line tool usage guide](leanengine_cli.html) for more detail on command line tool and locally debugging.


{% endblock %}

{% block project_constraint %}

## 项目骨架 Project skeleton

参照示例项目，你的项目需要遵循一定格式才会被云引擎识别并运行。
Your project has to follow the following structure to be recognized by LeanEngine and operate properly.

{{fullName}} 使用 WSGI 规范来运行项目，项目根目录下必须有 `wsgi.py` 与 `requirements.txt` 文件，可选文件 `.python-version`、`runtime.txt`。云引擎运行时会首先加载 `wsgi.py` 这个模块，并将此模块的全局变量 `application` 做为 WSGI 函数进行调用。因此请保证 `wsgi.py` 文件中包含一个 `application` 的全局变量／函数／类，并且符合 WSGI 规范。

{{fullName}} uses WSGI specification to run the project. There must be mandatory files `wsgi.py` and `requirements.txt` and optional file `.python-version`and`runtime.txt` in the project root directory. LeanEngine will start to load module `wsgi.py` first, and call the WSGI function which uses the global variable of this module. Hence please make sure the `wsgi.py` file contains a global  `application` variables/function/class that is in accordance with the WSGI specification.



More information about **WSGI 函数**,please refer to [WSGI port](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001432012393132788f71e0edad4676a3f76ac7776f3a16000) or [PEP333](https://www.python.org/dev/peps/pep-0333/)。


{% endblock %}
{% block custom_runtime %}
### 添加第三方依赖模块 Add third-party dependency module

`requirements.txt` 中填写项目依赖的第三方模块，每行一个，如：fill in the third-party modules for the project dependency, one module per line,like this:

```
# 井号至行尾为注释 From # sign to the end of the line are comments
leancloud>=2.0.0,<3.0.0
Flask>=0.10.1,<1.0.0                               # 可以指定版本号／范围  specify version number/range of versions
git+https://github.com/foo/bar.git@master#egg=bar  # 可以使用 Git/SVN 等版本管理工具的远程地址 Use the remote addresses of version management tool such as Git/SVN
```

Detail format please refer to [pip Document &middot; Requirements Files](https://pip.pypa.io/en/stable/user_guide/#requirements-files)。


应用部署到云引擎之后，会自动按照 `requirements.txt` 中的内容进行依赖安装。在本地运行和调试项目的时候，可以在项目目录下使用如下命令安装依赖：
After deploying to LeanEngine, LeanEngine will automatically install dependencies based on `requirements.txt`. You can use the following command to install dependencies when running and debugging locally:


```sh
pip install -r requirements.txt
```

另外当你部署应用的时候，建议将依赖的包的版本都按照 `foo==1.0.0` 这种格式来明确指定版本号（或版本的范围），防止因为依赖的模块升级且不再兼容老的 API 时，当再次部署时会导致应用运行失败。
Also when deploying the application, it is suggested to use the version format of `foo==1.0.0` for dependency packages to specify version number(or range of versions) to avoid the redeploy failure when the updated dependency module is no longer compatible with the old API.


### 指定 Python 版本 Sepecify Python version

你可以选择运行代码的 Python 版本，选择方法与 [pyenv](https://github.com/pyenv/pyenv) 相同，即在项目根目录的 `.python-version` 中写入需要的 Python 版本即可，比如 `3.6.1`。这样将代码部署到云引擎之后，系统会自动选择对应的 Python 版本。
You can select the Python version to run the code, the selection method is the same as [pyenv](https://github.com/pyenv/pyenv). As in you write the required Python version in `.python-version` under the project root directory, for example: `3.6.1`. The system will select the corresponding Python version after the code being deployed to LeanEngine.


如果在本地开发时已使用了 pyenv，pyenv 也会根据此文件来自动使用对应的 Python 运行项目。我们建议本地开发使用 pyenv，以保证本地环境与线上相同。pyenv 的安装方法请参考 [pyenv 官方网站](https://github.com/pyenv/pyenv)。
If pyenv has already be used in local development, pyenv will also use the corresponding Python project based on this file. It is recommended to use pyenv in local development to ensure the local and online environment are identical. Installation for pyenv please refer to [pyenv Official site](https://github.com/pyenv/pyenv)。

目前仅支持 CPython 版本，暂时不支持 pypy、jython、iron python 等其他 Python 实现。另外建议尽量使用 3.5 或以上版本的 Python 进行开发，如果仍然在使用 Python2 ，请使用 Python2.7 进行开发。
Currently, only CPython is supported, pypy、jython、iron python and other Python implementation are not supported. It is recommended to use Python3.5 or above, if you are still using Python2, please use Python2.7.

{{ docs.note("在之前版本的云引擎中，你可以在项目根目录的 `runtime.txt` 中填写 `python-3.5` 或者 `python-2.7` 来指定 Python 版本。如果当前项目仍然在使用此方法，建议使用上面介绍的方式来指定。") }}
In previous LeanEngine version, you can fill in `python-3.5` or `python-2.7` in `runtime.txt` under project root directory. If the current project is still using this method, it is recommended to specify the verion with the method mentioned above.

{% endblock %}


{% block supported_frameworks %}
如前所述，只要兼容 Python WSGI 规范的框架都可以在云引擎运行。目前比较流行的 Python Web 框架对此都有支持，比如 [Flask](http://flask.pocoo.org)、[Django](https://www.djangoproject.com)、[Tornado](http://www.tornadoweb.org)。
As mentioned earlier, any framework that is compatible with the Python WSGI specification can run on the LeanEngine like current popular Python Web framework, say [Flask](http://flask.pocoo.org)、[Django](https://www.djangoproject.com)、[Tornado](http://www.tornadoweb.org)。

我们提供了 Flask 和 Django 两个框架的示例项目作为参考，你也可以直接把它们当作一个应用项目的初始化模版：
Here are two example projects that use framework Flask and Django , you can use them as initialization templates for the application:

- [Flask](https://github.com/leancloud/python-getting-started)
- [Django](https://github.com/leancloud/django-getting-started)
{% endblock %}

### 锁定第三方依赖版本 Lock third-party dependency version

Python 云引擎每次在重新构建时，都会去执行 `pip install -r requirements.txt`，因此如果没有明确指定第三方依赖的版本的话，可能会导致完全相同的代码因第三方依赖的改动而产生不一致的行为。
Python LeanEngine will execute  `pip install -r requirements.txt` on every reconstruct. Thus, if the third-party dependency version is not specified, the same code might output different results due to the modification of the third-party dependency. 

为了避免这种情况的发生，建议在 `requirements.txt` 中明确指定全部第三方依赖的版本。使用 `pip freeze` 命令，可以查看当前 `pip` 安装的第三方模块的版本。如果使用 `virtualenv` 来进行开发，并且当前 `virtualenv` 只包含当前项目的依赖的话，可以考虑将 `pip freeze` 的所有内容都写到 `requirements.txt` 中。

To avoid this issue, it is recommended to specify versions of all third-party dependencies in `requirements.txt`. Using command `pip freeze` to view the version of the current installing third-party module by `pip`. If you use `virtualenv` to develop, and the current  `virtualenv` only contains the dependencies of the current project, you can write all the content of `pip freeze` into `requirements.txt`.

{% block use_leanstorage %}

## 使用数据存储服务 Use LeanStorage

在云引擎中你可以使用 LeanCloud 提供的 [数据存储](storage_overview.html) 作为应用的后端数据库，以及使用其他 LeanCloud 提供的功能。 LeanCloud Python SDK 可以让你更加方便地使用这些功能。
In LeanEngine, you can use [LeanStorage](storage_overview.html) provided by LeanCloud as the application backend database, as well as using other features provided by LeanCloud. LeanCloud Python SDK makes it easier to use these features.

### 安装 Installation

将 `leancloud` 添加到 `requirements.txt` 中，部署到线上即可自动安装此依赖。在本地运行和调试项目的时候，可以在项目目录下使用如下命令进行依赖安装：
Add `leancloud` into `requirements.txt` to automatically install this dependency when deploying to the online environment. When running and debugging locally, use the following command to install dependency under project directory:
```sh
pip install -r requirements.txt
```

### Update to leancloud SDK 2.x 

LeanCloud Python SDK 目前最新版本已经升级到了 2.0.0，与之前的 1.x 版本相比有了一些不兼容的改动，主要是移除了一些已经废弃的方法，详情参考 [SDK 发布页面](https://github.com/leancloud/python-sdk/releases/tag/v2.0.0)。

LeanCloud Python SDK  has the latest version 2.0.0 with some modification on compatibility issue comparing to the 1.x versions by removing some useless methods. Refer to [SDK Release page](https://github.com/leancloud/python-sdk/releases/tag/v2.0.0) for more detail.

不过目前云引擎上有一部分使用者，没有在 requirements.txt 中指定依赖的 Python SDK 版本，因此我们暂时没有将 2.x 分支的代码发布到 pypi 的 [leancloud-sdk](https://pypi.python.org/pypi/leancloud-sdk/) 这个包下，防止对这部分使用者正在运行的代码造成影响。因此目前如果需要使用 2.x 版本的 SDK 的话，请使用 [leancloud](https://pypi.python.org/pypi/leancloud/) 这个包名。
However, there are some users on LeanEngine didn't specify Python SDK version in the requirements.txt; for this reason, we haven't released the code of version2.x to package of [leancloud-sdk](https://pypi.python.org/pypi/leancloud-sdk/) under pypi to ensure the code of these users can still run properly. Thus, if you need to use SDK version2.x, please use the package name of [leancloud](https://pypi.python.org/pypi/leancloud/).

### 初始化 Initialization

因为 `wsgi.py` 是项目最先被执行的文件，推荐在此文件进行 LeanCloud Python SDK 的初始化工作：
Because `wsgi.py`is the first file being executed, it is recommended to initialize the LeanCloud Python SDK in this file. 


```python
import os

import leancloud

APP_ID = os.environ['LEANCLOUD_APP_ID']                # Obtain the app id from the environment variable LEANCLOUD_APP_ID.
APP_KEY = os.environ['LEANCLOUD_APP_KEY']              # Obtain the app key from the environment variable LEANCLOUD_APP_KEY.
MASTER_KEY = os.environ['LEANCLOUD_APP_MASTER_KEY']    # Obtain the master key from the environment variable LEANCLOUD_APP_MASTER_KEY .

leancloud.init(APP_ID, app_key=APP_KEY, master_key=MASTER_KEY)
# If you need to use the master key to access LeanCLoud service, set value ture here.
leancloud.use_master_key(False)
```

接下来就可以在项目的其他部分中使用 LeanCloud Python SDK 提供的功能了。更多用法请参考 [LeanCloud Python SDK 数据存储开发指南](leanstorage_guide-python.html)。
Then you can use other LeanCloud Python SDK features in your project, for more usage please refer to [LeanCloud Python SDK Data storage developement guide](leanstorage_guide-python.html).
{% endblock %}

{% block get_env %}
```python
import os

env = os.environ.get('LEANCLOUD_APP_ENV')
if env == 'development':
  # The current environment is 「Development environment」, launch by command line tool.
  do_some_thing()
elif env == 'production':
  # The current environment is 「Production environment」, it is the official online environment.
  do_some_thing()
elif env == 'staging':
  # The current environment is 「Prepared environment」.
  do_some_thing()
```
{% endblock %}

{% block cookie_session %}
Python SDK 提供了一个 `leancloud.engine.CookieSessionMiddleware` 的 WSGI 中间件，使用 Cookie 来维护用户（`leancloud.User`）的登录状态。要使用这个中间件，可以在 `wsgi.py` 中将：
Python SDK provides a WSGI middleware `leancloud.engine.CookieSessionMiddleware` that uses Cookie to maintain the login status of the user ( `leancloud.User`). Modify the code like following in `wsgi.py` to use this middleware:

replace 

```python
application = engine
```

into:

```python
application = leancloud.engine.CookieSessionMiddleware(engine, secret=YOUR_APP_SECRET)
```

你需要传入一个 secret 的参数，用户签名 Cookie（必须提供），这个中间件会将 `AV.User` 的登录状态信息记录到 Cookie 中，用户下次访问时自动检查用户是否已经登录，如果已经登录，可以通过 `leancloud.User.get_current()` 获取当前登录用户。
You need to pass in a secret parameter, the Cookie signed by the client(mandatory), this middleware will record the login status of `AV.User` in the Cookie and check if the user has logged in the next visit. You can obtain the current login user via `leancloud.User.get_current()`.

`leancloud.engine.CookieSessionMiddleware` 初始化时支持的非必须选项包括：
Optional options supported by `leancloud.engine.CookieSessionMiddleware` in initiliaztion include:

* **name**: 在 cookie 中保存的 session token 的 key 的名称，默认为 "leancloud:session"。Name of the key of session token in cookie - "leancloud:session" by default.
* **excluded_paths**: 指定哪些 URL path 不处理 session token，比如在处理静态文件的 URL path 上不进行处理，防止无谓的性能浪费。接受参数类型 `list`。Indicate which URL path will not process the session token. For example, there is no processing for the URL path that handles the static files to reduce resource waste. Accept parameter type
* **fetch_user**: 处理请求时是否要从存储服务获取用户数据，如果为 False 的话，`leancloud.User.get_current()` 获取到的用户数据上除了 `session_token` 之外没有任何其他数据，需要自己调用 `fetch()` 来获取。为 `True` 的话，会自动在用户对象上调用 `fetch()`，这样将会产生一次数据存储的 API 调用。默认为 False。
Whether or not to obtain the user data from storage service when processing the requirement. If it is false, the user data obtained by `leancloud.User.get_current()` will not contain any data other than `session_token`; you need to obtain them by calling  `fetch()`. If it is true, it will automatically call `fetch()` on the user object to generate an API calling for data storage.  False by default.

* **expires**: Set expired date for cookie（refer to [Werkzeug Document](http://werkzeug.pocoo.org/docs/0.12/http/#werkzeug.http.dump_cookie)）。 
* **max_age**: 设置 cookie 在多少秒后失效 Set how many seconds for cookie to expire（refer [Werkzeug Document](http://werkzeug.pocoo.org/docs/0.12/http/#werkzeug.http.dump_cookie)）。

{% endblock %}


{% block http_client %}
你可以使用任意 Python 的模块来发送 HTTP 请求，比如内置的 urllib。不过我们推荐 [requests](http://www.python-requests.org/) 这个第三方模块。
You can use any Python module to send HTTP request like the built-in urllib. It is recommended to use the third-party module [requests](http://www.python-requests.org/).

在 `requirements.txt` 中新增一行 `requests>=2.11.0`，然后在此目录重新执行 `pip install -r requirements.txt` 就可以安装这个模块。
Add a new line  `requests>=2.11.0` in `requirements.txt`, then execute `pip install -r requirements.txt` again under this directory to install this module.

```python
import requests

response = requests.post('http://www.example.com/create_post', json={
    'title': 'Vote for Pedro',
    'body': 'If you vote for Pedro, your wildest dreams will come true',
})

print(response.json())
```

{% endblock %}

{% block code_get_client_ip_address %}
Flask:

```python
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/')
def index():
    print(request.headers['x-real-ip'])
    return 'ok'
```

Django:

根据 [Django 的官方文档](https://docs.djangoproject.com/el/1.10/ref/request-response/#django.http.HttpRequest.META)，第三方定义的 HTTP Header 会加上 `HTTP_` 的前缀，并且 `-` 会被替换成 `_`，所以要通过 `HTTP_X_REAL_IP` 来访问。
Based on [Django Official document](https://docs.djangoproject.com/el/1.10/ref/request-response/#django.http.HttpRequest.META), the third-party HTTP Header will add prefix of `HTTP_`;  `-` will be replaced into `_`. Thus use `HTTP_X_REAL_IP` to visit. 

```python
def index(request):
    print(request.META['HTTP_X_REAL_IP'])
    return render(request, 'index.html', {})
```

其他框架请参考对应文档。Other frameworks please refer to corresponding files.

{% endblock %}

{% block https_redirect %}
```python
import leancloud

application = get_your_wsgi_func()

# use this WSGI middleware `leancloud.HttpsRedirectMiddleware` to pack the original WSGI function provided to LeanEngine.
application = leancloud.HttpsRedirectMiddleware(application)
```
{% endblock %}

{% block loggerExample %}

**Python 2**

```python
import sys

print 'hello!'  # info
print >> sys.stderr, 'some error'  # error
```

**Python 3**

```python
import sys

print('hello!')  # info
print('some err', file=sys.stderr)  # error
```
{% endblock %}

{% block code_calling_custom_variables %}
```python
# 在云引擎 Python 环境中使用自定义的环境变量 Use custom environment variables in LeanEngine Python Environment
import os

MY_CUSTOM_VARIABLE = os.environ.get('MY_CUSTOM_VARIABLE')
print(MY_CUSTOM_VARIABLE)
```
{% endblock %}

{% block code_upload_file_sdk_function %}
Flask:

```python
# app is your Flask instance

@app.route('/upload', methods=['POST'])
def upload():
    upload_file = request.files['iconImage']
    f = leancloud.File(upload_file.filename, data=upload_file.stream)
    print(f.url)
    return 'upload file ok!'
```

其他 Web 框架，请参考对应文档。 Other Web frameworks please refer to corresponding files.

{% endblock %}

{% block leancache %}
首先添加相关依赖到云引擎应用的 `requirements.txt` 中：
First add the related dependencies into  `requirements.txt`  of LeanEngine application:

``` python
Flask>=0.10.1,<1.0.0
leancloud>=2.0.0,<3.0.0
...
redis>=2.10.5,<3.0.0
```

然后可以使用下列代码获取 Redis 连接：
Then obtain the Redis connection:

``` python
import os
import redis

r = redis.from_url(os.environ.get("REDIS_URL_<实例名称>"))
```
{% endblock %}

{% block custom_session %}
推荐使用 Web 框架自带的 session 组件。It is recommended to use the built-in session component of Web Framework.
{% endblock %}
