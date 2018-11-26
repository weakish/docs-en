{# Specify inherited template #}
{% extends "./leanengine_webhosting_guide.tmpl" %}

{% set productName = "LeanEngine" %}
{% set platformName = "Java" %}
{% set fullName = productName + ' ' + platformName %}
{% set sdk_name = "Java" %}
{% set leanengine_middleware = "[LeanEngine Java SDK](https://github.com/leancloud/leanengine-java-sdk)" %}
{% set leanengine_java_sdk_latest_version = '0.1.11' %}

{% block getting_started %}

Clone the example code [java-war-getting-started](https://github.com/leancloud/java-war-getting-started) to local:


```sh
git clone https://github.com/leancloud/java-war-getting-started.git
```

{% endblock %}

{% block project_constraint %}

## Project Skeleton

Your project has to follow the following structure to be recognized by LeanEngine and operate properly.

LeanEngine Java environment is constructed by Maven. For this reason, the {{fullName}} project must contain `$PROJECT_DIR/pom.xml`, this file is the startup file for the whole project. After construction, LeanEngine will search for a package under the directory `$PROJECT_DIR/target`.

* WAR：If your project is built into a WAR file, LeanEngine will run it in a servlet container (currently Jetty 9.x).

* JAR：If your project is built into a JAR file, LeanEngine will run `java -jar <packageName>.jar`.

Using an example project as a starting point might make things easier, because you don't have to configure all the details.


* [java-war-getting-started](https://github.com/leancloud/java-war-getting-started): A minimal project that integrates the LeanCloud SDK and creates a WAR file to run as a servlet.

* [spring-boot-getting-started](https://github.com/leancloud/spring-boot-getting-started): A minimal project using the [Spring boot] (https://projects.spring.io/spring-boot/) framework that creates a JAR file.

{% endblock %}

{% block runtime_description %}
The Java runtime requires more memory, hence we recommend:

* Application based on [Example project](https://github.com/leancloud/java-war-getting-started) should use instances with at least 512 MB memory.
* Application based on [Spring Boot](https://projects.spring.io/spring-boot/) should use instancees with at least 1 GB memory.
* Simulate a reasonable workload locally and check how much memory your application uses. When choosing LeanEngine instances, make sure to leave some margin for traffic variation.

{% endblock %}

{% block project_start %}

### WAR project

First, confirm [jetty plugin](https://www.eclipse.org/jetty/documentation/9.4.x/jetty-maven-plugin.html) has been configured in `pom.xml`. The port of the webserver can be obtained from the environment variable `LEANCLOUD_APP_PORT`. Please refer to our [example code](https://github.com/leancloud/java-war-getting-started/blob/master/pom.xml) for reference.

Then use Maven to install dependencies and create the package:

```sh
mvn package
```

There are several ways to launch the application locally:

#### Using the command-line tool to launch the application:

```sh
lean up
```

Please refer to the [command-line tool usage guide](leanengine_cli.html) for more details.

**Tip**：Compared with other methods, the command-line tool supports switching
between different applications and is the most flexible.


#### Using the command-line tool to launch the application

The following commands set up the environment variables for LeanEngine, and
launch the application using the jetty plugin:

```
eval "$(lean env)"
mvn jetty:run
```

**Tip**：`lean env` outputs the required environment variables in as shell
commands. You can run it direct to see which variables are set.

#### Using Eclipse to launch the application

First, confirm that the Maven plugin has been installed in Eclipse and import
the project into Eclipse as a **Maven Project**. Right click the project in
the **Package Explorer** window, select **Run As** > **Maven build...**. Then on
the **Main** tab, set **Goals** into `jetty:run`. Add the following environment
variables on the **Environment** tab:

- LEANCLOUD_APP_ENV = `development`
- LEANCLOUD_APP_ID = `{{appid}}`
- LEANCLOUD_APP_KEY = `{{appkey}}`
- LEANCLOUD_APP_MASTER_KEY = `{{masterkey}}`
- LEANCLOUD_APP_PORT = `3000`

If your application needs other custom variables, you also need to add them
here.

Hit run to launch the application.

### JAR project

Using Maven to install dependencies and create the package:

```sh
mvn package
```

There are several ways to launch the application locally:

#### Use the command-line tool to launch the application

The following commands set up the required environment variables for LeanEngine
and launch the generated jar file:

```
eval "$(lean env)"
java -jar target/{zipped jar file}
```

**Tip**：`lean env` outputs the required environment variables in as shell
commands. You can run it direct to see which variables are set.

#### Using Eclipse to launch the application


First, confirm that the Maven plugin has been installed in Eclipse and import
the project into Eclipse as a **Maven Project**. Right click the project in the
**Package Explorer** window, select **Run As** > **Run Configurations...**.
Then select `Application`, set `Main class:`
(`cn.leancloud.demo.todo.Application` in the sample project).  Add the
following environment variables on the **Environment** tab:

- LEANCLOUD_APP_ENV = `development`
- LEANCLOUD_APP_ID = `{{appid}}`
- LEANCLOUD_APP_KEY = `{{appkey}}`
- LEANCLOUD_APP_MASTER_KEY = `{{masterkey}}`
- LEANCLOUD_APP_PORT = `3000`

If your application needs other custom variables, you also need to add them
here.

Hit run to launch the application.

{% endblock %}

{% block ping %}
If you didn't use {{leanengine_middleware}}, you need to handle the URL yourself:


```
// Health monitoring
@WebServlet(name = "LeanEngineHealthServlet", urlPatterns = {"/__engine/1/ping"})
public class LeanEngineHealthCheckServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setHeader("content-type", "application/json; charset=UTF-8");
    JSONObject result = new JSONObject();
    result.put("runtime", System.getProperty("java.version"));
    result.put("version", "custom");
    resp.getWriter().write(result.toJSONString());
  }
}
```
and

```
// Cloud function list
@WebServlet(name = "LeanEngineMetadataServlet", urlPatterns = {"/1.1/functions/_ops/metadatas"})
public class LeanEngineMetadataServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    resp.setContentType("application/json; charset=UTF-8");
    resp.getWriter().write("{\"result\":[]}");
  }
}

```
{% endblock %}

{% block supported_frameworks %}

{{fullName}} depends on Servlet 3.1.0, you can use any Web frameworks based on Servlet 3.1.0.
{% endblock %}

{% block custom_runtime %}

Jave LeanEngine supports JRE 1.8.

{% endblock %}

{% block use_leanstorage %}

## Using LeanStorage

LeanEngine uses {{leanengine_middleware}} to replace [Java storage
SDK](https://github.com/leancloud/java-sdk). The former is a superset of the
latter, and it adds support for cloud functions and hooks. You can use
[LeanStorage](leanstorage_guide-java.html)to store your data.

If you use the example project as the basis，the {{leanengine_middleware}} has
already been set up.

To start from scratch, you need to configure it as follows:

* Configure dependencies: Add {{leanengine_middleware}} to `pom.xml`:


```xml
	<dependencies>
		<dependency>
			<groupId>cn.leancloud</groupId>
			<artifactId>leanengine</artifactId>
			<version>{{leanengine_java_sdk_latest_version}}</version>
		</dependency>
	</dependencies>
```

* Initialize the middleware by using your application key:

```java
import com.avos.avoscloud.internal.impl.JavaRequestSignImplementation;
import cn.leancloud.LeanEngine;

// Obtain the app id from the environment variable LEANCLOUD_APP_ID.
String appId = System.getenv("LEANCLOUD_APP_ID");

// Obtain the app key from the environment variable LEANCLOUD_APP_KEY.
String appKey = System.getenv("LEANCLOUD_APP_KEY");

// Obtain the master key from the environment variable LEANCLOUD_APP_MASTER_KEY.
String appMasterKey = System.getenv("LEANCLOUD_APP_MASTER_KEY");

LeanEngine.initialize(appId, appKey, appMasterKey);

// If you don't need to use the master key, you can delete the following line.
JavaRequestSignImplementation.instance().setUseMasterKey(true);
```
{% endblock %}

{% block custom_api_random_string %}
{{productName}} allows you to define HTTP/HTTPS-based custom APIs.
For example, you can use the following code to implement an API that returns the
server time:

Create a new class TimeServlet to extend HttpServlet:

```java
@WebServlet(name = "TimeServlet", urlPatterns = {"/time"})
public class TimeServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
     resp.setHeader("content-type", "application/json; charset=UTF-8");
    JSONObject result = new JSONObject();
     result.put("currentTime",new Date());
    resp.getWriter().write(result.toJSONString());
  }
}

```

Then open your borwser, visit <http://localhost:3000/time>, the browser will
return:

```json
{"currentTime":"2016-02-01T09:43:26.223Z"}
```

After deploying to LeanEngine, you can access the API at
`http://{{var_app_domain}}.leanapp.cn/time`. If you have an iOS or Android
program, you can use HTTP requests to access it. The SDKs provide built-in
methods to obtain server time, the example here is just a tutorial.

{% endblock %}

{% block code_get_client_ip_address %}

``` java
EngineRequestContext.getRemoteAddress();
```
{% endblock %}

{% block get_env %}

```java
String env = System.getenv("LEANCLOUD_APP_ENV");
if (env.equals("development")) {
    // The current environment is 「Development environment」, launch by command line tool.
} else if (env.equals("production")) {
    // The current environment is 「Production environment」, it is the official online environment.
} else {
    // The current environment is 「Prepared environment」.
}
```
{% endblock %}

{% block http_client %}

Although basic utilities like URL or HttpClient can be used to send HTTP
requests.  It is more convenient to use third party-libraries such as okhttp.

``` java
    Request.Builder builder = new Request.Builder();
    builder.url(url).get();
    OkHttpClient client  = new OkHttpClient();
    Call call = client.newCall(buidler.build());
    try{
      Response response = call.execute();
    }catch(Exception e){
    }
```
{% endblock %}

{% block code_upload_file_sdk_function %}

```
@WebServlet("/upload")
@MultipartConfig
public class UploadServlet extends HttpServlet {

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String description = request.getParameter("description"); // Retrieves <input type="text" name="description">
    Part filePart = request.getPart("iconImage"); // Retrieves <input type="file" name="file">
    String fileName = filePart.getSubmittedFileName();
    InputStream fileContent = filePart.getInputStream();
    // ... (do your job here)
  }
}
```
{% endblock %}

{% block cookie_session %}
LeanEngine provides the component `EngineSessionCookie` that uses cookies to
manage sessions. Add the following code after
initialization if you need to use this component.

```java
LeanEngine.addSessionCookie(new EngineSessionCookie("my secret", 3600, true));
```

The constructor arguments of `EngineSessionCookie` are:

* **secret**：A string used to create the cookie signature. Everytime you
  modified it, all existing cookies will be invalidated, which means all the
  sessions will expired.
* **maxAge**：Set the expiration time for the cookie in second.
* **fetchUser**：Whether or not to automatically fetch the AV.User object.
  false by default.
  
If `fetchUser` is true, when each HTTP request with a session
  cookie is recieved a call to the LeanStorage service will be made to fetch
  the user object. If it is set to false, you can only access the ID and the
  `sessionToken` of the user object returned by `AVUser.getCurrentUser()`; you
  can manually fetch the complete object when needed.

The current user can be obtained by calling `AVUser.getCurrentUser()` in both
cloud functions and LeanEngine HTTP handlers.

You can easily implement a site with user accounts like this:

#### Login
```java
@WebServlet(name = "LoginServlet", urlPatterns = {"/login"})
public class LoginServlet extends HttpServlet {

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    req.getRequestDispatcher("/login.jsp").forward(req, resp);
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String username = req.getParameter("username");
    String passwd = req.getParameter("password");
    try {
      AVUser.logIn(username, passwd);
      resp.sendRedirect("/profile");
    } catch (AVException e) {
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      resp.setContentType("application/json; charset=UTF-8");
      JSONObject result = new JSONObject();
      result.put("code", e.getCode());
      result.put("error", e.getMessage());
      resp.getWriter().write(result.toJSONString());
      e.printStackTrace();
    }
  }

}
```
#### Logout
``` java
@WebServlet(name = "LogoutServlet", urlPatterns = {"/logout"})
public class LogoutServlet extends HttpServlet {

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    doPost(req, resp);
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    AVUser user = AVUser.getCurrentUser();
    if (user != null) {
      user.logOut();
    }
    resp.sendRedirect("/profile");
  }

}
```

#### Profile Page

```java
@WebServlet(name = "ProfileServlet", urlPatterns = {"/profile"})
public class ProfileServlet extends HttpServlet {

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    resp.setContentType("application/json; charset=UTF-8");
    JSONObject result = new JSONObject();
    if (AVUser.getCurrentUser() != null) {
      result.put("currentUser", AVUser.getCurrentUser());
    }
    resp.getWriter().write(result.toJSONString());
  }

}
```

A simple login page to be used with the above handlers:

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

{% block https_redirect %}


```java
LeanEngine.setHttpsRedirectEnabled(true);
```
{% endblock %}
