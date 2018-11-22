{# Specify extended template #}
{% extends "./leanengine_webhosting_guide.tmpl" %}

{% set productName = 'LeanEngine' %}
{% set platformName = 'PHP' %}
{% set fullName = productName + ' ' + platformName %}
{% set sdk_name = 'PHP' %}
{% set leanengine_middleware = '[LeanCloud PHP SDK](https://github.com/leancloud/php-sdk)' %}

{% block custom_api_random_string %}
{{productName}} allows you to define HTTP/HTTPS-based custom APIs.
For example, you can use the following code to implement an API that returns the
server time:

```php
// in app.php
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

After deploying to LeanEngine, you can access the API at `http://{{var_app_domain}}.leanapp.cn/time`. If you have an iOS or Android program, you can use HTTP 
requests to access it. SDKs provide built-in methods to obtain server time,
the example here is just a tutorial.
{% endblock %}

{% block getting_started %}

Clone the example code [slim-getting-started](https://github.com/leancloud/slim-getting-started)to local:

```sh
git clone https://github.com/leancloud/slim-getting-started.git
```

Using composer to install third-party dependencies:

```sh
composer install
```
{% endblock %}

{% block project_constraint %}

## Project skeleton

Your project has to follow the following structure to be recognized by LeanEngine and operate properly.

The {{fullName}} project must contain `$PROJECT_DIR/public/index.php`, this file is the startup file for the whole project.
{% endblock %}



{% block ping %}
{{leanengine_middleware}} will automatically handle this URL, you only need to add the middleware to the request processing chain.

```
$engine = new SlimEngine();
$app->add($engine);
```

If you didn't use {{leanengine_middleware}}, you need to handle the URL yourself:
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

// List of cloud functions
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

{{fullName}} does not depend on any third-party frameworks, you use any framework or library you are familiar with, but please make sure you can start your project by executing `public/index.php`

We assign a PHP-FPM worker for every 64M RAM for PHP projects by default. If you want to custom the number of Workers, you can add a `PHP_WORKERS` environment variable on the LeanEngine settings page. The value must be a number. If you set it too low, you may not have available workers when you receive a new request; if you set the value too high, you may not have enough RAM to run them. Hence, please adjust the value cautiously. 
{% endblock %}

{% block code_get_client_ip_address %}
```php
$app->get('/', function($req, $res) {
  error_log($_SERVER['HTTP_X_REAL_IP]); // Print user IP address
  return $res;
});
```
{% endblock %}

{% block use_leanstorage %}

## Using LeanStorage


LeanEngine uses  {{leanengine_middleware}}, which contains the LeanStorage SDK; you can use the relevant API to persist your data. Please refer to [the LeanStorage guide](leanstorage_guide-php.html).

If you use the example project as the basis, {{leanengine_middleware}} provides the middleware that supports the [Slim framework]. You can use it as shown in the example project.

To start from scratch, you need to configure it as follows:

* First install [composer](https://getcomposer.org)

* Configure dependency: Execute the following command under the project root directory to add the dependency of the {{leanengine_middleware}}:

```
composer require leancloud/leancloud-sdk
```

* Initialization: Before you store your date officially, you need to initialize the middleware by using your application key:

```php
use \LeanCloud\Client;

Client::initialize(
    getenv("LC_APP_ID"),          // Obtain the app id from the environment variable LC_APP_ID.
    getenv("LC_APP_KEY"),         // Obtain the app key from the environment variable LC_APP_KEY.
    getenv("LC_APP_MASTER_KEY")   // Obtain the master key from the environment variable LC_APP_MASTER_KEY.
);

// If you don't need to use the master key, you can delete the following line.
Client::useMasterKey(true);
```
{% endblock %}

{% block http_client %}

LeanEngine PHP environment supports the built-in curl module, however, we recommend using a third party library like guzzle to send HTTP requests.


Install guzzle:

```sh
composer require guzzlehttp/guzzle:~6.0
```

Example code:

```php
$client = new GuzzleHttp\Client();
$resp = $client->post("http://www.example.com/create_post", array(
    "json" => array(
        "title" => "Some amazing title",
        "body"  => "Some awesome content."
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
LeanEngine provides a module `LeanCloud\Storage\CookieStorage` that uses Cookie to manage sessions. You can use it by adding the following code to `app.php`.
```php
use \LeanCloud\Storage\CookieStorage;
// store the session states to a cookie
Client::setStorage(new CookieStorage(60 * 60 * 24, "/"));
```

CookieStorage supports specifying the number of seconds before expiration and an effective path. The default expiration period is seven days. 

The current user can be obtained by `User::getCurrentUser()`. You can implement a site with login like the following:

```php
$app->get('/login', function($req, $res) {
  // Render login page
});

// Handle login requests (they may come from the form on the login page)
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
You can use `CookieStorage` to store properties in the session.

```php
// Enable CookieStorage when the project starts
Client::setStorage(new CookieStorage());

// You can use CookieStorage to store properties in projects.
$cookieStorage = Client::getStorage();
$cookieStorage->set("key", "val");
```

Please note that the in-memory `$_SESSION` does not work on LeanEngine because each app may run in multiple processes and hosts. `CookieStorage` is the recommended way to store session states.

{% endblock %}

{% block https_redirect %}
```php
SlimEngine::enableHttpsRedirect();
$app->add(new SlimEngine());
```
{% endblock %}


{% block custom_runtime %}
LeanEngine provides PHP 5.6 by default. If you need a specified version of PHP, please add it in `composer.json`.

```json
"require": {
  "php": "7.0"
}
```

Supported versions are `5.6`、`7.0`、`7.1` . We will also support new versions released in future.

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
