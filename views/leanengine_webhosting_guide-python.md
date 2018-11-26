{# Specify inherited template #}
{% extends "./leanengine_webhosting_guide.tmpl" %}

{% set productName = 'LeanEngine' %}
{% set platformName = 'Python' %}
{% set fullName = productName + ' ' + platformName %}
{% set sdk_name = 'Python' %}
{% set leanengine_middleware = '[LeanCloud Python SDK](https://github.com/leancloud/python-sdk)' %}


{% block getting_started %}

Clone the sample project [leancloud/python-getting-started](https://github.com/leancloud/python-getting-started):

```sh
git clone https://github.com/leancloud/python-getting-started.git
```

First you need the following dependencies to launch a LeanEngine Python
application locally:

- **python**：Please make sure the local and online python version are
  identical to avoid compatibility issues. It is recommended to use
  [pyenv](https://github.com/pyenv/pyenv)  to manage your local Python
  versions.
- **pip**：Used to install third-party dependencies.
- **virtualenv**：Optional, it is recommended to use virtualenv or similar
  tools to create an independent Python environment for each project to avoid
  conflicts.

Please make sure the above dependencies are installed locally properly, then
execute the following command under the project directory to install the
third-party dependencies for the project.

```sh
pip install -r requirements.txt
```

Please refer to the [command-line tool usage guide](leanengine_cli.html) for more
details on the command line tool and locally debugging.


{% endblock %}

{% block project_constraint %}

## Project skeleton

Your project has to follow the following structure to be recognized by LeanEngine and operate properly.

{{fullName}} uses WSGI to run the project.  `wsgi.py` and `requirements.txt`
must exist in the project root directory.  `.python-version`
is optional. Please see below for its usage. LeanEngine will start by
firstly loading the module `wsgi.py`, and call the WSGI entry point.  Please
make sure the `wsgi.py` file contains a global `application`
variables/function/class that conforms to the WSGI specification.

For more information about **WSGI**,please refer to [PEP333](https://www.python.org/dev/peps/pep-0333/)。


{% endblock %}
{% block custom_runtime %}
### Add third-party dependencies

In`requirements.txt`, fill in the third-party dependencies of the project. One
module per line:

```
# From # sign to the end of the line are comments
leancloud>=2.0.0,<3.0.0
Flask>=0.10.1,<1.0.0                               # Specify version number/range of versions
git+https://github.com/foo/bar.git@master#egg=bar  # Use the remote addresses of version management tool such as Git/SVN
```

Please refer to [pip Document &middot; Requirements
Files](https://pip.pypa.io/en/stable/user_guide/#requirements-files) for
detailed information about the file.


After deployment, LeanEngine will automatically install dependencies in
`requirements.txt`. You can use the following command to install dependencies
when running and debugging locally:


```sh
pip install -r requirements.txt
```

When deploying to production, it is advisable to specify the exact versions
(`foo==1.0.0`) of dependencies to avoid compatibility surprises.

### Sepecifying a Python version

You can select the Python version to run the code in a way similar to
[pyenv](https://github.com/pyenv/pyenv), by putting the desired
version in `.python-version` under the project root directory. For example:
`3.6.1`.

If pyenv is used locally, it will also use the same Python version. It is
recommended to use pyenv in local development to ensure the local and online
environment are identical. Please refer to [pyenv
Official site](https://github.com/pyenv/pyenv) for how to install and pyenv.

Currently, only CPython is supported, pypy、jython、iron python and other
Python implementation are not supported. It is recommended to use Python3.5 or
above, if you are still using Python2, please use 2.7.

{% endblock %}


{% block supported_frameworks %}

As mentioned earlier, any framework that is compatible with the Python WSGI
specification can used. Popular choices include
[Flask](http://flask.pocoo.org), [Django](https://www.djangoproject.com), and
[Tornado](http://www.tornadoweb.org).

Here are two example projects that use Flask and Django , you can use them as starting points:

- [Flask](https://github.com/leancloud/python-getting-started)
- [Django](https://github.com/leancloud/django-getting-started)
{% endblock %}

### Lock third-party dependency versions


Python LeanEngine will execute  `pip install -r requirements.txt` on every
deployment. Thus, if the exact version of each dependency is not specified, a
different version than the one you're expecting maybe installed.

To avoid this issue, it is recommended to specify exact versions of all third-party
dependencies in `requirements.txt`. The command `pip freeze` can show you 
the versions of the currently installed modules. If you use
`virtualenv` to develop, and the current  `virtualenv` only contains the
dependencies of the current project; you can write the output of `pip
freeze` to `requirements.txt`.

{% block use_leanstorage %}

## Using LeanStorage

In LeanEngine, you can use [LeanStorage](storage_overview.html)
as the backend database, as well as other features
provided by LeanCloud. LeanCloud Python SDK makes it easier to use these
features.

### Installation

Add `leancloud` into `requirements.txt`, and install the dependencies:
```sh
pip install -r requirements.txt
```

### Initialization

Because `wsgi.py`is the first file to be executed, it is recommended to
initialize the LeanCloud Python SDK in this file. 


```python
import os
import leancloud

APP_ID = os.environ['LEANCLOUD_APP_ID']              # Obtain the app id from the environment variable LEANCLOUD_APP_ID.
APP_KEY = os.environ['LEANCLOUD_APP_KEY']            # Obtain the app key from the environment variable LEANCLOUD_APP_KEY.
MASTER_KEY = os.environ['LEANCLOUD_APP_MASTER_KEY']  # Obtain the master key from the environment variable LEANCLOUD_APP_MASTER_KEY .

leancloud.init(APP_ID, app_key=APP_KEY, master_key=MASTER_KEY)
# If you need to use the master key to access LeanCLoud service, set value ture here.
leancloud.use_master_key(False)
```

Then you can use all LeanCloud Python SDK features in your project, for more
please refer to [LeanCloud Python SDK Data storage developement
guide](leanstorage_guide-python.html).
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

Python SDK provides a WSGI middleware
`leancloud.engine.CookieSessionMiddleware` that use cookies to manage sessions
Modify the code in `wsgi.py` to use this middleware:

replace 

```python
application = engine
```

into:

```python
application = leancloud.engine.CookieSessionMiddleware(engine, secret=YOUR_APP_SECRET)
```

You need to pass in a secret which is used to sign the cookie. This middleware
will save session information in the Cookie and check if the user
has logged in. You can obtain the currently logged-in user via
`leancloud.User.get_current()`.

Other options supported by `leancloud.engine.CookieSessionMiddleware` include:

* **name**: Name of session cookie - "leancloud:session" by default.
* **excluded_paths**: Exclude the session cookie from certain paths. For example, it makes sense to add paths with only static files here. Accept parameter type `list`.
* **fetch_user**: Whether or not to automatically fetch the AV.User object.
  false by default. If `fetch_user` is true, when each HTTP request with a session
  cookie is recieved a call to the LeanStorage service will be made to fetch
  the user object. If it is set to false, you can only access the ID and the
  `session_token` of the user object returned by `leancloud.User.get_current()`; you
  can manually fetch the complete object when needed.
* **expires**: Set expiration time for the cookie（refer to [Werkzeug Document](http://werkzeug.pocoo.org/docs/0.12/http/#werkzeug.http.dump_cookie)）。 
* **max_age**: Set seconds to expiration for the cookie（refer [Werkzeug Document](http://werkzeug.pocoo.org/docs/0.12/http/#werkzeug.http.dump_cookie)）。

{% endblock %}


{% block http_client %}
You can use any Python module to send HTTP requests. The built-in urllib would
work, but it is more convenient to use the third-party module
[requests](http://www.python-requests.org/).

Add a new line  `requests>=2.11.0` in `requirements.txt`, then execute `pip
install -r requirements.txt` again.

```python
import requests

response = requests.post('http://www.example.com/create_post', json={
    'title': 'Some title',
    'body': 'Some awesome content.',
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

Based on [Django's Official
document](https://docs.djangoproject.com/el/1.10/ref/request-response/#django.http.HttpRequest.META),
the prefix `HTTP_` is added to third-party headers;  `_` will be replaced
by `-`.

```python
def index(request):
    print(request.META['HTTP_X_REAL_IP'])
    return render(request, 'index.html', {})
```

{% endblock %}

{% block https_redirect %}
```python
import leancloud

application = get_your_wsgi_func()

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

{% endblock %}

{% block leancache %}
First add the dependencies to `requirements.txt`:

``` python
Flask>=0.10.1,<1.0.0
leancloud>=2.0.0,<3.0.0
...
redis>=2.10.5,<3.0.0
```

Then create the Redis connection:

``` python
import os
import redis

r = redis.from_url(os.environ.get("REDIS_URL_<instance_name>"))
```
{% endblock %}

{% block custom_session %}
It is recommended to use the built-in session component of the web framework.
{% endblock %}
