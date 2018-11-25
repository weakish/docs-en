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

LeanEngine Java operating environment is constructed by Maven. For this reason, the {{fullName}} project must contain `$PROJECT_DIR/pom.xml`, this file is the startup file for the whole project. After construction, LeanEngine will search for an available package under the directory of `$PROJECT_DIR/target`.

* WAR：If your project is zipped into a WAR file, LeanEngine will put it into Servlet container (currently Jetty 9.x) to operate.

* JAR：If your project is zipped into a JAR file, LeanEngine will operate via `java -jar <packageName>.jar`.

Using the example project as a starting point will make the development and debugging much easier because in this way you configure some details of the operating environment setup.


* [java-war-getting-started](https://github.com/leancloud/java-war-getting-started): Using Servlet to integrate a simple project of LeanEngine Java SDK and zipped it into a WAR file.

* [spring-boot-getting-started](https://github.com/leancloud/spring-boot-getting-started): Using [Spring boot] (https://projects.spring.io/spring-boot/) as the project framework to integrate a simple project of LeanEngine Java SDK and zipped it into a JAR file.

{% endblock %}

{% block runtime_description %}
Java operating environment uses more memory, hence we recommend:

* Application based on [Example project](https://github.com/leancloud/java-war-getting-started), please use the instance of 512 MB or above.
* Application based on [Spring Boot](https://projects.spring.io/spring-boot/), please use the instance of 1 GB or above.
* Start and simulate main processing operations locally. After the complete initialization, select the suitable instance based on the memory needed for the Java processing. Pay attention to reserve a certain margin of memory to cope with the request peak.

<div class="callout callout-danger"> If the LeanEngine [Instance specification](leanengine_plan.html# select instance specification) **Improper Selection** it may lead to application deployment to fail during launching process due to memory leak (OOM), or application will reboot frequently due to memory leak in the operating process.</div>

{% endblock %}

{% block project_start %}
### Project that Zipped into WAR file 

First, confirm the project  `pom.xml` has configured [jetty plugin](https://www.eclipse.org/jetty/documentation/9.4.x/jetty-maven-plugin.html)，and obtain the port of the webserver via the environment variable `LEANCLOUD_APP_PORT`. Detail configuration please refer to our [example code](https://github.com/leancloud/java-war-getting-started/blob/master/pom.xml).


Then use Maven to install dependencies and zip:

```sh
mvn package
```

There are several methods to locally launching the application:

#### Using command line tool to launch the application:

```sh
lean up
```

Please refer to [Command line tool usage guide](leanengine_cli.html) for more detail on command line tool and locally debugging.

**Tip**：Comparing with other launching methods, command line tool supports [Multi-functions management](leanengine_cli.html#Multi-functions management)to switch between different application environment.


#### Using Command line tool to set the environment variable to launch the application

Use the following code to set the environment variable for LeanEngine in the current command line environment, and launch the application by using the jetty plugin:


```
eval "$(lean env)"
mvn jetty:run
```

**Tip**：Command `lean env` can output the setting statement of the required environment variable for the current application,the outer `eval`  can directly execute the statement.

#### Using Eclipse to launch the application 

First, confirm Eclipse has installed Maven plugin and import the project into Eclipse via **Maven Project**. Right click the project in **Package Explorer** window, select **Run As** > **Maven build...**. Then on the bookmark page **Main** , set **Goals** into `jetty:run`. Add the following environment variables and related values on the bookmark page **Environment** :

- LEANCLOUD_APP_ENV = `development`
- LEANCLOUD_APP_ID = `{{appid}}`
- LEANCLOUD_APP_KEY = `{{appkey}}`
- LEANCLOUD_APP_MASTER_KEY = `{{masterkey}}`
- LEANCLOUD_APP_PORT = `3000`

Hit run to launch the application.

### Project that Zipped into Jar file 

Using Maven to install dependencies and zip:

```sh
mvn package
```

There are several methods to locally launching the application:

#### Using Command line tool to set the environment variable to launch the application

Use the following code to set the required environment variable for LeanEngine in the current command line environment, and launch the application by using the jetty plugin:

```
eval "$(lean env)"
java -jar target/{zipped jar file}
```

**Tip**：
Command `lean env` can output the setting statement of the environment variable required by the current application,the outer `eval`  can directly execute the statement.


#### Using Eclipse to launch the application 


First, confirm Eclipse has installed Maven plugin and import the project into Eclipse via **Maven Project**. Right click the project in **Package Explorer** window, select **Run As** > **Run Configurations...**.Then select  `Application`, set `Main class:`(`cn.leancloud.demo.todo.Application`in the example code). Add the following environment variables and related values on the bookmark page **Environment** :

- LEANCLOUD_APP_ENV = `development`
- LEANCLOUD_APP_ID = `{{appid}}`
- LEANCLOUD_APP_KEY = `{{appkey}}`
- LEANCLOUD_APP_MASTER_KEY = `{{masterkey}}`
- LEANCLOUD_APP_PORT = `3000`

Hit run to launch the application.


#### Using Command line tool to launch the application

Command line tool does not support JAR project launch currently.

{% endblock %}

{% block ping %}
：
If you didn't use {{leanengine_middleware}}, you need to handle the URL yourself:


```
//Health monitor router 
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
// LeanEngine list
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

{{fullName}} depend on Servlet 3.1.0, you can use any Web frameworks based on Servlet 3.1.0.
{% endblock %}

{% block custom_runtime %}

Jave LeanEngine only supports 1.8 operating environment and war package launch.

{% endblock %}

{% block use_leanstorage %}

## Using LeanStorage

LeanEngine uses {{leanengine_middleware}} to replace [Java storage SDK](https://github.com/leancloud/java-sdk). The former depend on the latter, and it further supports LeanEngine functions and Hook funtions. You can use [LeanCloud Storage](leanstorage_guide-java.html)to store your data.

If you use the example project as the basis，the {{leanengine_middleware}} has already setup by default. You can use it directly based on the example code.

To start from scratch, you need to configure it as follows:

* Configure dependencies: Add dependencies in pom.xml to add dependencies of {{leanengine_middleware}}:


```xml
	<dependencies>
		<dependency>
			<groupId>cn.leancloud</groupId>
			<artifactId>leanengine</artifactId>
			<version>{{leanengine_java_sdk_latest_version}}</version>
		</dependency>
	</dependencies>
```

* Initialization: Before you store your date officially, you need to initialize the middleware by using your application key:

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

Then open your borwser, visit <http://localhost:3000/time>, the browser will return information like this:

```json
{"currentTime":"2016-02-01T09:43:26.223Z"}
```

After deploying to LeanEngine, you can access the API at `http://{{var_app_domain}}.leanapp.cn/time`. If you have an iOS or Android program, you can use HTTP requests to access it. SDKs provide built-in methods to obtain server time, the example here is just a tutorial.

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
    // The current environment is 「Development environment」, launch by command line tool
} else if (env.equals("production")) {
    // The current environment is 「Production environment」, it is the official online environment.
} else {
    // The current environment is 「Prepared environment」.
}
```
{% endblock %}

{% block http_client %}

LeanEngine Jave environment can use basic class like URL or HttpClient, however, it is recommend to use third party-library such as okhttp to handle HTTP request.

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
LeanEngine provides a component `EngineSessionCookie`that uses Cookie to maintain login state of the user (`AVUser`). Add the following code if you need to use this component in initialization.

```java
// 加载 cookieSession 以支持 AV.User 的会话状态 Load cookieSession to support session status of AV.User
LeanEngine.addSessionCookie(new EngineSessionCookie("my secret", 3600, true));
```

`EngineSessionCookie` Constructor arguments of `EngineSessionCookie`include:

* **secret**：A character string that is only stored on the server and it can be any value. Everytime you modified it, all existing cookie will be invalid, which means all the login sessions of users will be expired.
* **maxAge**：Set the expired period of Cookie, unit in second.
* **fetchUser**：**Whether or not automatically fetch the current login in object AV.User. false by default.

If it is set to true, every HTTP request will call LeanCloud API to fetch the user object. If it is set to false, you can only access the `id`(ObjectId recorded in `_User` ) and property `sessionToken` of `AVUser.getCurrentUser()`; you can manually fetch the complete user object when needed.

* In LeanEngine method, obtain user information via `AVUser.getCurrentUser()`.
* In Website hosting method, obtain user information via `AVUser.getCurrentUser()`.
* Pass the user object explicitly in subsequent calls.

You can easily implement a site with login capabilities like this:


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

A simple login page looks like this:

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
