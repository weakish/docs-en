{# Specify extended template #} 
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

LeanEngine Java operating environment is constructed by Maven. For this reason, the {{fullName}} project must contain `$PROJECT_DIR/pom.xml`, this file is the startup file for the whole project. After construction, LeanEngine will search for a available package under the directory of `$PROJECT_DIR/target`.

* WAR：If your project is zipped into a WAR file, LeanEngine will put it into Servlet container (currently Jetty 9.x) to operate.

* JAR：If your project is a zipped into a JAR file, LeanEngine will operate via `java -jar <packageName>.jar`.

Using the example project as a starting point will make the development and debugging much easier because in this way you configure some details of the operating environment setup.


* [java-war-getting-started](https://github.com/leancloud/java-war-getting-started): Using Servlet to integrate a simple project of LeanEngine Java SDK and zipped it into a WAR file.

* [spring-boot-getting-started](https://github.com/leancloud/spring-boot-getting-started): Using [Spring boot] (https://projects.spring.io/spring-boot/) as the project framework to integrate a simple project of LeanEngine Java SDK and zipped it into a JAR file.

{% endblock %}

{% block runtime_description %}
Java 运行环境对内存的使用较多，所以建议：
Java operating environment occupies more memory, we recommend:

* 以 [示例项目](https://github.com/leancloud/java-war-getting-started) 起步的应用，建议使用 512 MB 或以上规格的实例。Application based on [Example project](https://github.com/leancloud/java-war-getting-started), please use the instance of 512 MB or above.
* 使用 [Spring Boot](https://projects.spring.io/spring-boot/) 的应用，建议使用 1 GB 或以上规格的实例。Application based on [Spring Boot](https://projects.spring.io/spring-boot/), please use the instance of 1 GB or above.
* 本地启动并模拟完成主要业务流程操作，待应用充分初始化后，根据 Java 进程内存占用量选择相应的实例规格，需要注意保留一定的余量用以应对请求高峰。
Start and simulate main processing operations locally. After the complete initialization, select the suitable instance based the memory needed for the Java processing. Pay attention to reserve a certain margin of memory to cope with the request peak.


<div class="callout callout-danger">如果云引擎 [实例规格](leanengine_plan.html#选择实例规格) **选择不当**，可能造成应用启动时因为内存溢出（OOM）导致部署失败，或运行期内存溢出导致应用频繁重启。</div>
If the LeanEngine [Instance specification](leanengine_plan.html# select instance specification) **Improper Selection** it may lead to application deployment to fail during launching process due to memory leak (OOM), or application will reboot frequently due to memory leak in the operating process.

{% endblock %}

{% block project_start %}
### 打包成 WAR 文件的项目 Project that Zipped into WAR file 

首先确认项目 `pom.xml` 中配置了 [jetty plugin](https://www.eclipse.org/jetty/documentation/9.4.x/jetty-maven-plugin.html)，并且 web server 的端口通过环境变量 `LEANCLOUD_APP_PORT` 获取，具体配置可以参考我们的 [示例代码](https://github.com/leancloud/java-war-getting-started/blob/master/pom.xml)。

First, confirm the project  `pom.xml` has configured [jetty plugin](https://www.eclipse.org/jetty/documentation/9.4.x/jetty-maven-plugin.html)，and obtain the port of the webserver via the environment variable `LEANCLOUD_APP_PORT`. Detail configuration please refer to our [example code](https://github.com/leancloud/java-war-getting-started/blob/master/pom.xml).


然后使用 Maven 安装依赖并打包：Then use Maven to install dependencies and zip:

```sh
mvn package
```

以下有几种方式可以本地启动：
There are several methods to locally launching the application:

#### 命令行工具启动应用 Using command line tool to launch the application:

```sh
lean up
```

更多有关命令行工具和本地调试的内容请参考 [命令行工具使用指南](leanengine_cli.html)。
------- >Please refer to [Command line tool user guide](leanengine_cli.html) for more detail on command line tool and locally *debugging.

**提示 Tip**：相对于其他启动方式，命令行工具有 [多应用管理](leanengine_cli.html#多应用管理) 功能，可以方便的切换不同应用环境。
Comparing with other launching methods, command line tool supports [多应用管理 Multi-functions management](leanengine_cli.html#Multi-functions management)to switch between different application environment.


#### 命令行设置环境变量启动 Using Command line tool to set the environment variable to launch the application

通过以下命令将云引擎运行需要的环境变量设置到当前命令行环境中，并使用 jetty 插件启动应用：
Use the following code to set the environment variable for LeanEngine into the current command line environment, and launch the application by using the jetty plugin:


```
eval "$(lean env)"
mvn jetty:run
```

**提示 Tip**：命令 `lean env` 可以输出当前应用所需环境变量的设置语句，外层的 `eval` 是直接执行这些语句。
Command `lean env` can output the setting statement of the environment variable required by the current application,the outer `eval`  can directly execute the statement.

#### 使用 Eclipse 启动应用 Using Eclipse to launch the application 

首先确保 Eclipse 已经安装 Maven 插件，并将项目以 **Maven Project** 方式导入 Eclipse 中，在 **Package Explorer** 视图右键点击项目，选择 **Run As** > **Maven build...**，将 **Main** 标签页的 **Goals** 设置为 `jetty:run`，将 **Environment** 标签页增加以下环境变量和相应的值：
First, confirm Eclipse has installed Maven plugin and import the project into Eclipse via **Maven Project**. Right click the project in **Package Explorer** window, select **Run As** > **Maven build...**. Then on the bookmark page **Main** , set **Goals** into `jetty:run`. Add the following environment variables and related values on the bookmark page **Environment** .

- LEANCLOUD_APP_ENV = `development`
- LEANCLOUD_APP_ID = `{{appid}}`
- LEANCLOUD_APP_KEY = `{{appkey}}`
- LEANCLOUD_APP_MASTER_KEY = `{{masterkey}}`
- LEANCLOUD_APP_PORT = `3000`

然后点击 run 按钮启动应用。
Hit run to launch the application.

### 打包成 JAR 文件的项目 Project that Zipped into Jar file 

使用 Maven 正常的安装依赖并打包：
Using Maven to install dependencies and zip:

```sh
mvn package
```

以下有几种方式可以本地启动：
There are several methods to locally launching the application:

#### 命令行设置环境变量启动 Using Command line tool to set the environment variable to launch the application

通过以下命令将云引擎运行需要的环境变量设置到当前命令行环境中，并启动应用：
Use the following code to set the environment variable for LeanEngine into the current command line environment, and launch the application by using the jetty plugin:

```
eval "$(lean env)"
java -jar target/{打包好的 jar 文件}
```

**提示 Tip**：命令 `lean env` 可以输出当前应用所需环境变量的设置语句，外层的 `eval` 是直接执行这些语句。
Command `lean env` can output the setting statement of the environment variable required by the current application,the outer `eval`  can directly execute the statement.


#### 使用 Eclipse 启动应用 Using Eclipse to launch the application 

首先确保 Eclipse 已经安装 Maven 插件，并将项目以 **Maven Project** 方式导入 Eclipse 中，在 **Package Explorer** 视图右键点击项目，选择 **Run As** > **Run Configurations...**，选择 `Application`，设置 `Main class:` （示例项目为 `cn.leancloud.demo.todo.Application`），将 **Environment** 标签页增加以下环境变量和相应的值：

First, confirm Eclipse has installed Maven plugin and import the project into Eclipse via **Maven Project**. Right click the project in **Package Explorer** window, select **Run As** > **Run Configurations...**.Then select  `Application`, set `Main class:`(`cn.leancloud.demo.todo.Application`in the example code). Add the following environment variables and related values on the bookmark page **Environment** .

- LEANCLOUD_APP_ENV = `development`
- LEANCLOUD_APP_ID = `{{appid}}`
- LEANCLOUD_APP_KEY = `{{appkey}}`
- LEANCLOUD_APP_MASTER_KEY = `{{masterkey}}`
- LEANCLOUD_APP_PORT = `3000`

然后点击 run 按钮启动应用。
Hit run to launch the application.


#### 命令行工具启动应用 Using Command line tool to launch the application

很抱歉，命令行工具暂不支持 JAR 项目的启动。
Command line tool does not support JAR project launch currently.

{% endblock %}

{% block ping %}

如果未使用 {{leanengine_middleware}}，则需要自己实现该 URL 的处理，比如这样：
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

{{fullName}} 依赖 Servlet 3.1.0 ，你可以使用任何基于 Servlet 3.1.0 的 Web 框架。
{{fullName}} depend on Servlet 3.1.0, you can use any Web frameworks based on Servlet 3.1.0.
{% endblock %}

{% block custom_runtime %}

Java 云引擎只支持 1.8 运行环境和 war 包运行
Jave LeanEngine only supports 1.8 operating environment and war package launch.

{% endblock %}

{% block use_leanstorage %}

## 使用数据存储服务  Using LeanStorage

云引擎使用 {{leanengine_middleware}} 来代替 [Java 存储 SDK](https://github.com/leancloud/java-sdk) 。前者依赖了后者，并增加了云函数和 Hook 函数的支持，因此开发者可以直接使用 [LeanCloud 的存储服务](leanstorage_guide-java.html) 来存储自己的数据。


如果使用项目框架作为基础开发，{{leanengine_middleware}} 默认是配置好的，可以根据示例程序的方式直接使用。

如果是自定义项目，则需要自己配置：

* 配置依赖：在 pom.xml 中增加依赖配置来增加 {{leanengine_middleware}} 的依赖：

```xml
	<dependencies>
		<dependency>
			<groupId>cn.leancloud</groupId>
			<artifactId>leanengine</artifactId>
			<version>{{leanengine_java_sdk_latest_version}}</version>
		</dependency>
	</dependencies>
```

* 初始化：在正式使用数据存储之前，你需要使用自己的应用 key 进行初始化中间件：

```java
import com.avos.avoscloud.internal.impl.JavaRequestSignImplementation;
import cn.leancloud.LeanEngine;

// 从 LEANCLOUD_APP_ID 这个环境变量中获取应用 app id 的值
String appId = System.getenv("LEANCLOUD_APP_ID");

// 从 LEANCLOUD_APP_KEY 这个环境变量中获取应用 app key 的值                
String appKey = System.getenv("LEANCLOUD_APP_KEY");

// 从 LEANCLOUD_APP_MASTER_KEY 这个环境变量中获取应用 master key 的值        
String appMasterKey = System.getenv("LEANCLOUD_APP_MASTER_KEY");   

LeanEngine.initialize(appId, appKey, appMasterKey);

// 如果不希望使用 masterKey 权限，可以将下面一行删除
JavaRequestSignImplementation.instance().setUseMasterKey(true);
```
{% endblock %}

{% block custom_api_random_string %}
{{productName}} 允许开发者自定义基于 HTTP（HTTPS） 的 API。
例如，开发者如果想实现一个获取服务端时间的 API，可以在代码中如下做：

新建一个类 TimeServlet 继承 HttpServlet :

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

然后打开浏览器，访问 <http://localhost:3000/time>，浏览器应该会返回如下类似的内容：

```json
{"currentTime":"2016-02-01T09:43:26.223Z"}
```

部署到云端后，你可以通过 `http://{{var_app_domain}}.leanapp.cn/time` 来访问该 API。你的 iOS 或者 Android 的程序就可以构建一个 HTTP 请求获取服务端时间了。当然还是建议使用各 SDK 内置的获取服务器时间的 API，这里的例子只是演示。
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
    // 当前环境为「开发环境」，是由命令行工具启动的
} else if (env.equals("production")) {
    // 当前环境为「生产环境」，是线上正式运行的环境
} else {
    // 当前环境为「预备环境」
}
```
{% endblock %}

{% block http_client %}

云引擎 Java 环境可以使用 URL 或者是 HttpClient 等基础类 ，不过我们推荐使用 okhttp 等第三方库来处理 HTTP 请求。

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
云引擎提供了一个 `EngineSessionCookie` 组件，用 Cookie 来维护用户（`AVUser`）的登录状态，要使用这个组件可以在初始化时添加下列代码：

```java
// 加载 cookieSession 以支持 AV.User 的会话状态
LeanEngine.addSessionCookie(new EngineSessionCookie("my secret", 3600, true));
```

`EngineSessionCookie` 的构造函数参数包括：

* **secret**：一个只保存在服务端的字符串，可以设置为任意值。但每次修改之后，所有已有的 cookie 都会失效，也就是所有用户的登录 session 都将过期。
* **maxAge**：设置 Cookie 的过期时间。单位秒。
* **fetchUser**：**是否自动 fetch 当前登录的 AV.User 对象。默认为 false。**
  如果设置为 true，每个 HTTP 请求都将发起一次 LeanCloud API 调用来 fetch 用户对象。如果设置为 false，默认只可以访问 `AVUser.getCurrentUser()` 的 `id`（`_User` 表记录的 ObjectId）和 `sessionToken` 属性，你可以在需要时再手动 fetch 整个用户。

* 在云引擎方法中，通过 `AVUser.getCurrentUser()` 获取用户信息。
* 在网站托管中，通过 `AVUser.getCurrentUser()` 获取用户信息。
* 在后续的方法调用显式传递 user 对象。

你可以这样简单地实现一个具有登录功能的站点：

#### 登录
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
#### 登出
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

#### Profile页面

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

一个简单的登录页面（`login.jsp`）可以是这样：

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
