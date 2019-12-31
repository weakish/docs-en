{% import "views/_helper.njk" as docs %}
{% import "views/_data.njk" as data %}
# REST API Guide

You can access LeanCloud from any devices supporting HTTP requests with REST API, for example:

- You can manipulate data on LeanCloud with any programming language.
- If you want to migrate from LeanCloud to other services, you can export all your data.
- Your mobile site can fetch data from LeanCloud via JavaScript directly if you think importing LeanCloud JavaScript SDK brings is overkill.
- You can add new data in batch, to be consumed by mobile applications later.
- You can export recent data for offline analysis or additional incremental backup.

## API Version

The current API version is `1.1`.

### Testing

This guide provides curl command line examples.
You may need to modify some syntax if using cmd.exe on Windows.
For example, `\` in curl examples means to be continued on next line, but cmd.exe will consider it as path seperator.
Therefore, we recommend you to use [Postman] for testing.

[Postman]: https://www.getpostman.com/

Postman can import curl commands directly.


![Postman: click Import button, paste curl command in "Paste Raw Text" tab](images/postman-import-curl.png)

Postman also supports automatically generate snippets of code in various languages and frameworks.

![click the link under the blue Send button](images/postman-generate-code.png)

