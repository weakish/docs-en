{# Specify extended template #}
{% extends "./leanengine_webhosting_guide.tmpl" %}

{% set productName = 'LeanEngine' %}
{% set platformName = 'PHP' %}
{% set fullName = productName + ' ' + platformName %}
{% set sdk_name = 'PHP' %}
{% set leanengine_middleware = '[LeanCloud PHP SDK](https://github.com/leancloud/php-sdk)' %}

{% block custom_api_random_string %}
{{productName}} Allowing you to custom API based on HTTP（HTTPS).
For example, if you want to implement an API that can obtain the server time, you can write the following code:



Add the following code into the file `./app.php`:

```php
$app->get('/time', function($req, $res) {
    // PSR-7 response is immutable
    $response = $res->withHeader("Content-Type", "application/json");
    $response->getBody()->write(json_encode(array(
        "currentTime" => date(DATE_ATOM)
    )));
    return $response;
});
```

Then open the browser, visit <http://localhost:3000/time>, the browser should return the following content:
```json
{"currentTime":"2016-02-01T09:43:26.223Z"}
```


After you deploy to the cloud, you can access the API via `http://{{var_app_domain}}.leanapp.cn/time`. If you have an iOS or Android program, you should be able to construct a HTTP to request the server time.Of course, we still recommend you use the built-in API in SDK to obtain the server time, the example here is just a tutorial.
{% endblock %}

{% block getting_started %}

Clone the example code [slim-getting-started](https://github.com/leancloud/slim-getting-started)to local:

```sh
git clone https://github.com/leancloud/slim-getting-started.git
```

Using composer to install the third-party dependency:

```sh
composer install
```
{% endblock %}

{% block project_constraint %}

## Project skeleton

Your project can only be recognized by LeanEngine and operate normally by following a certain format.

{{fullName}} project must contain `$PROJECT_DIR/public/index.php`, this file is the startup file for the whole project.
{% endblock %}



{% block ping %}
{{leanengine_middleware}} has the builtin processing for this URL, you only need to add the middleware to the requested processing link.

```
$engine = new SlimEngine();
$app->add($engine);
```

If you didn't use {{leanengine_middleware}}, you need to implement the processing of the URL by yourself like this:
```
// Router health monitoring
$app->get('/__engine/1/ping', function($req, $res) {
    // PSR-7 response is immutable
    $response = $res->withHeader("Content-Type", "application/json");
    $response->getBody()->write(json_encode(array(
        "runtime" => "php-" . phpversion(),
        "version" => "custom"
    )));
    return $response;
});

// Cloud functions list
app.get('/1.1/_ops/functions/metadatas', function(req, res) {
    $response = $res->withHeader("Content-Type", "application/json");
    $response->getBody()->write(json_encode(array(
        "result" => array()
    )));
    return $response;
});
```
{% endblock %}

{% block supported_frameworks %}

{{fullName}} does not depend on any third-party frameworks, you can develop it by using the framework you are familiar with, or:
not using any framworks, but please make sure you can start your project by executing `public/index.php`

For PHP project, by default, we assign a PHP-FPM Worker for every 64M RAM. If you want to custom the amount of Worker, you can add an environment variable named PHP_WORKERS to the 「custom environment variable」on the setup page of the LeanEngine, the value of this environment variable is a number. If you set the value too low, you will not have available Worker when you receive a new request; if you set the value too high, you will not have enough RAM to have a successful request. Hence, please adjust the value cautiously. 
{% endblock %}

{% block code_get_client_ip_address %}
```php
$app->get('/', function($req, $res) {
  error_log($_SERVER['HTTP_X_REAL_IP]); // 打印用户 IP 地址 Print user IP address
  return $res;
});
```
{% endblock %}

{% block use_leanstorage %}

## Using Data stroage service


LeanEngine uses  {{leanengine_middleware}}, which contains the storage SDK; you can use the relevant port to store your data. Please refer to [PHP Storage file](leanstorage_guide-php.html).

If you use the project framework to do basic development, {{leanengine_middleware}} provides the middleware that supports the [Slim framework]. You can use it directly according to the example program.

 If you develope a custom project, you need to configure as follows:

* First install [composer](https://getcomposer.org)

* Configure dependency: Execute the following command under the project root directory to increase the dependency of the {{leanengine_middleware}}:

```
composer require leancloud/leancloud-sdk
```

* Initialization: Before you store your date officially, you need to initialize the middleware by using your application key:

```php
use \LeanCloud\Client;

Client::initialize(
    getenv("LC_APP_ID"),          // Obtain the value of the app id from this environment variable LC_APP_ID.
    getenv("LC_APP_KEY"),         // Obtain the value of the app key from this environment variable LC_APP_KEY.

    getenv("LC_APP_MASTER_KEY")   // Obtain the value of the master key from this environment variable LC_APP_MASTER_KEY.
);

// If you don't want to use the permission of the masterkey, you can delete the following line.

Client::useMasterKey(true);
```
{% endblock %}

{% block http_client %}

LeanEngine PHP environment supports the built-in curl module, however, we recommend to use a third party library like guzzle to process the HTTP request.


Install guzzle:

```sh
composer require guzzlehttp/guzzle:~6.0
```

Example code:

```php
$client = new GuzzleHttp\Client();
$resp = $client->post("http://www.example.com/create_post", array(
    "json" => array(
        "title" => "Vote for Pedro",
        "body"  => "If you vote for Pedro, your wildest dreams will come true"
    )
));
```

{% endblock %}

{% block upload_file_special_middleware %}
{% endblock %}

{% block code_upload_file_sdk_function %}

```php
$app->post("/upload", function($req, $res) {
    if (isset($_FILES["iconImage"]) && $_FILES["iconImage"]["size"] != 0) {
        $file = File::createWithLocalFile(
            $_FILES["iconImage"]["tmp_name"],
            $_FILES["iconImage"]["type"]
        );
        $file->save();
        $res->getBody()->write("File upload succeeded");
    } else {
        $res->getBody()->write("Please select a file");
    }
});
```
{% endblock %}

{% block cookie_session %}
LeanEngine provides a module `LeanCloud\Storage\CookieStorage` that uses Cookie to manage the login of the （`User`）. You can use it by adding the following code to `app.php`.
```php
use \LeanCloud\Storage\CookieStorage;
// 将会话状态存储到 cookie 中 store the conversation status to cookie
Client::setStorage(new CookieStorage(60 * 60 * 24, "/"));
```


CookieStorage supports the scope of using the unit of seconds for the expiration period and using cookie as the path. The default expiration period is seven days. Then we can obtain the current user via `User::getCurrentUser()` .

CookieStorage supports


You can implement a site with login function simply like this :


```php
$app->get('/login', function($req, $res) {
  // Render login page
});

// Handling login requests (they may come from the forms in the login interface)
$app->post('/login', function($req, $res) {
    $params = $req->getQueryParams();
    try {
        User::logIn($params["username"], $params["password"]);
        // Jump to the profile page
        return $res->withRedirect('/profile');
    } catch (Exception $ex) {
        //Login failed, jump to login page
        return $res->withRedirect('/login');
    }
});

// View profile
$app->get('/profile', function($req, $res) {
    // Determine if the user has logged in
    $user = User::getCurrentUser();
    if ($user) {
        // If the user has logged in, send the current login user information.
        return $res->getBody()->write($user->getUsername());
    } else {
        // If the user has not login in yet, jump to the login page.
        return $res->withRedirect('/login');
    }
});

// Log out account
$app->get('/logout', function($req, $res) {
    User::logOut();
    return $res->redirect("/");
});
```

A simple login page can be written like this:

```html
<html>
    <head></head>
    <body>
      <form method="post" action="/login">
        <label>Username</label>
        <input name="username"></input>
        <label>Password</label>
        <input name="password" type="password"></input>
        <input class="button" type="submit" value="Login">
      </form>
    </body>
  </html>
```

{% endblock %}

{% block custom_session %}
If you need to store some properties in the session, you can store them by adding up a common CookieStorage.

```php
// Enable CookieStorage when the project starts
Client::setStorage(new CookieStorage());

// You can use CookieStorage to store properties in projects.
$cookieStorage = Client::getStorage();
$cookieStorage->set("key", "val");
```


Attention:The default `$_SESSION` in php cannot operate in our LeanEngine because LeanEngine runs in multiple processes and hosts which makes the in-memory session cannot be shared.
We recommend to use `CookieStorage` to store session information

{% endblock %}

{% block https_redirect %}
```php
SlimEngine::enableHttpsRedirect();
$app->add(new SlimEngine());
```
{% endblock %}


{% block custom_runtime %}
LeanEngine provides the operating environment of PHP 5.6 by default. If you need a specified version of PHP, please add it in `composer.json`.

```json
"require": {
  "php": "7.0"
}
```

Currently, LeanEngine supports the version of `5.6`、`7.0`、`7.1` . We will also support any new versions released in the future.

{% endblock %}

{% block get_env %}
```php
$env = getenv("LEANCLOUD_APP_ENV");
if ($env === "development") {
    //  The current environment is the "development environment", which is started by the command line tool.
} else if ($env === "production") {
    //  The current environment is the "production environment" and is the official online environment.
} else {
    // The current environment is "prepared environment".
}
```
{% endblock %}

{% block loggerExample %}
```php
Cloud::define("logSomething", function($params, $user) {
    error_log(json_encode($params));
});
```
{% endblock %}

{% block section_timezone %}{% endblock %}
