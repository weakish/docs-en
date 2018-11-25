{# Specify inherited template #}
{% extends "./leanengine_webhosting_guide.tmpl" %}

{% set productName = 'LeanEngine' %}
{% set platformName = 'Python' %}
{% set fullName = productName + ' ' + platformName %}
{% set sdk_name = 'Python' %}
{% set leanengine_middleware = '[LeanCloud Python SDK](https://github.com/leancloud/python-sdk)' %}


{% block getting_started %}

Clone the example code [leancloud/python-getting-started](https://github.com/leancloud/python-getting-started) to local:

```sh
git clone https://github.com/leancloud/python-getting-started.git
```

First you need the following dependencies to launch LeanEngine Python Application locally:

- **python**：Please make sure the local and online python version are identical to avoid compatibility issues. It is recommended to use [pyenv](https://github.com/pyenv/pyenv)  to locally manage your Python versions.
- **pip**：Used to install third-party dependencies.
- **virtualenv**：Optional, it is recommended to use virtualenv or similar tools to create an independent Python environment to avoid conflict between dependencies used by the project and used by the system/other projects.

Please make sure the above dependencies are installed locally properly, then execute the following command under the project directory to install the third-party dependencies for the project.

```sh
pip install -r requirements.txt
```


Please refer to [Command line tool usage guide](leanengine_cli.html) for more detail on command line tool and locally debugging.


{% endblock %}

{% block project_constraint %}

## Project skeleton

Your project has to follow the following structure to be recognized by LeanEngine and operate properly.

{{fullName}} uses WSGI specification to run the project. There must be mandatory files `wsgi.py` and `requirements.txt` and optional file `.python-version`and`runtime.txt` in the project root directory. LeanEngine will start by loading module `wsgi.py` first, and call the WSGI function which uses the global variable of this module. Hence please make sure the `wsgi.py` file contains a global  `application` variables/function/class that is in accordance with the WSGI specification.



More information about **WSGI function**,please refer to [WSGI port](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001432012393132788f71e0edad4676a3f76ac7776f3a16000) or [PEP333](https://www.python.org/dev/peps/pep-0333/)。


{% endblock %}
{% block custom_runtime %}
### Add third-party dependency module

In`requirements.txt`, fill in the third-party modules for the project dependency, one module per line,like this:

```
# From # sign to the end of the line are comments
leancloud>=2.0.0,<3.0.0
Flask>=0.10.1,<1.0.0                               # Specify version number/range of versions
git+https://github.com/foo/bar.git@master#egg=bar  # Use the remote addresses of version management tool such as Git/SVN
```

Detail format please refer to [pip Document &middot; Requirements Files](https://pip.pypa.io/en/stable/user_guide/#requirements-files)。


After deploying to LeanEngine, LeanEngine will automatically install dependencies based on `requirements.txt`. You can use the following command to install dependencies when running and debugging locally:


```sh
pip install -r requirements.txt
```

Also when deploying the application, it is suggested to use the version format of `foo==1.0.0` for dependency packages to specify version number(or range of versions) to avoid the redeploy failure when the updated dependency module is no longer compatible with the old API.


### Sepecify Python version

You can select the Python version to run the code. The selection method is the same as [pyenv](https://github.com/pyenv/pyenv), as in you write the required Python version in `.python-version` under the project root directory, for example: `3.6.1`. The system will select the corresponding Python version after the code being deployed to LeanEngine.


If pyenv has already be used in local development, pyenv will also use the corresponding Python project based on this file. It is recommended to use pyenv in local development to ensure the local and online environment are identical. Installation for pyenv please refer to [pyenv Official site](https://github.com/pyenv/pyenv)。

Currently, only CPython is supported, pypy、jython、iron python and other Python implementation are not supported. It is recommended to use Python3.5 or above, if you are still using Python2, please use Python2.7.

{{ docs.note("In previous LeanEngine version, you can fill in `python-3.5` or `python-2.7` in `runtime.txt` under project root directory to specify a Python version. If the current project is still using this method, it is recommended to specify the verion with the method mentioned above.") }}


{% endblock %}


{% block supported_frameworks %}

As mentioned earlier, any framework that is compatible with the Python WSGI specification can run on the LeanEngine like current popular Python Web framework, say [Flask](http://flask.pocoo.org)、[Django](https://www.djangoproject.com)、[Tornado](http://www.tornadoweb.org)。

Here are two example projects that use framework Flask and Django , you can use them as initialization templates for the application:

- [Flask](https://github.com/leancloud/python-getting-started)
- [Django](https://github.com/leancloud/django-getting-started)
{% endblock %}

### Lock third-party dependency version


Python LeanEngine will execute  `pip install -r requirements.txt` on every reconstruct. Thus, if the third-party dependency version is not specified, the same code might output different results due to the modification of the third-party dependency. 

To avoid this issue, it is recommended to specify versions of all third-party dependencies in `requirements.txt`. Using command `pip freeze` to view the version of the current installing third-party module by `pip`. If you use `virtualenv` to develop, and the current  `virtualenv` only contains the dependencies of the current project; you can write all the content of `pip freeze` into `requirements.txt`.

{% block use_leanstorage %}

## Use LeanStorage

In LeanEngine, you can use [LeanStorage](storage_overview.html) provided by LeanCloud as the application backend database, as well as using other features provided by LeanCloud. LeanCloud Python SDK makes it easier to use these features.

### Installation

Add `leancloud` into `requirements.txt` to automatically install this dependency when deploying to the online environment. When running and debugging locally, use the following command to install dependency under project directory:
```sh
pip install -r requirements.txt
```

### Update to leancloud SDK 2.x 

LeanCloud Python SDK  has the latest version 2.0.0 with some modification on compatibility issue by removing some useless methods comparing to the 1.x versions . Refer to [SDK Release page](https://github.com/leancloud/python-sdk/releases/tag/v2.0.0) for more detail.

However, there are some users on LeanEngine didn't specify Python SDK version in the requirements.txt; for this reason, we haven't released the code of version2.x to package of [leancloud-sdk](https://pypi.python.org/pypi/leancloud-sdk/) under pypi to ensure the code of these users can still run properly. Thus, if you need to use SDK version2.x, please use the package name of [leancloud](https://pypi.python.org/pypi/leancloud/).

### Initialization

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

Python SDK provides a WSGI middleware `leancloud.engine.CookieSessionMiddleware` that uses Cookie to maintain the login status of the user ( `leancloud.User`). Modify the code like following in `wsgi.py` to use this middleware:

replace 

```python
application = engine
```

into:

```python
application = leancloud.engine.CookieSessionMiddleware(engine, secret=YOUR_APP_SECRET)
```

You need to pass in a secret parameter, the Cookie signed by the client(mandatory), this middleware will record the login status of `AV.User` in the Cookie and check if the user has logged in the next visit. You can obtain the current login user via `leancloud.User.get_current()`.

Optional options supported by `leancloud.engine.CookieSessionMiddleware` in initiliaztion include:

* **name**: Name of the key of session token in cookie - "leancloud:session" by default.
* **excluded_paths**: Indicate which URL path will not process the session token. For example, there is no processing for the URL path that handles the static files to reduce resource waste. Accept parameter type `list`.
* **fetch_user**: Whether or not to obtain the user data from storage service when processing the requirement. If it is false, the user data obtained by `leancloud.User.get_current()` will not contain any data other than `session_token`; you need to obtain them by calling  `fetch()`. If it is true, it will automatically call `fetch()` on the user object to generate an API calling for data storage.  False by default.

* **expires**: Set expired date for cookie（refer to [Werkzeug Document](http://werkzeug.pocoo.org/docs/0.12/http/#werkzeug.http.dump_cookie)）。 
* **max_age**: Set how many seconds for cookie to expire（refer [Werkzeug Document](http://werkzeug.pocoo.org/docs/0.12/http/#werkzeug.http.dump_cookie)）。

{% endblock %}


{% block http_client %}
You can use any Python module to send HTTP request like the built-in urllib. It is recommended to use the third-party module [requests](http://www.python-requests.org/).

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

Based on [Django Official document](https://docs.djangoproject.com/el/1.10/ref/request-response/#django.http.HttpRequest.META), the third-party HTTP Header will add prefix of `HTTP_`;  `-` will be replaced into `_`. Thus use `HTTP_X_REAL_IP` to visit. 

```python
def index(request):
    print(request.META['HTTP_X_REAL_IP'])
    return render(request, 'index.html', {})
```

Other frameworks please refer to corresponding files.

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
# Use custom environment variables in LeanEngine Python Environment
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

Other Web frameworks please refer to corresponding files.

{% endblock %}

{% block leancache %}
First add the related dependencies into  `requirements.txt`  of LeanEngine application:

``` python
Flask>=0.10.1,<1.0.0
leancloud>=2.0.0,<3.0.0
...
redis>=2.10.5,<3.0.0
```

Then obtain the Redis connection:

``` python
import os
import redis

r = redis.from_url(os.environ.get("REDIS_URL_<实例名称>"))
```
{% endblock %}

{% block custom_session %}
It is recommended to use the built-in session component of Web Framework.
{% endblock %}
