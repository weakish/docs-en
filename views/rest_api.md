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

### Objects

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>HTTP Method</th>
      <th>Functionality</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/1.1/classes/&lt;className&gt;</td>
      <td>POST</td>
      <td>create an object</td>
    </tr>
    <tr>
      <td>/1.1/classes/&lt;className&gt;/&lt;objectId&gt;</td>
      <td>GET</td>
      <td>retrieve an object</td>
    </tr>
    <tr>
      <td>/1.1/classes/&lt;className&gt;/&lt;objectId&gt;</td>
      <td>PUT</td>
      <td>update an object</td>
    </tr>
    <tr>
      <td>/1.1/classes/&lt;className&gt;</td>
      <td>GET</td>
      <td>query objects</td>
    </tr>
    <tr>
      <td>/1.1/classes/&lt;className&gt;/&lt;objectId&gt;</td>
      <td>DELETE</td>
      <td>delete an Object</td>
    </tr>
    <tr>
      <td>/1.1/scan/classes/&lt;className&gt;</td>
      <td>GET</td>
      <td>iterate over objects</td>
    </tr>
  </tbody>
</table>

### Users

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>HTTP Method</th>
      <th>Functionality</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/1.1/users</td>
      <td>POST</td>
      <td>register</td>
    </tr>
    <tr>
      <td>/1.1/usersByMobilePhone</td>
      <td>POST</td>
      <td>register or login via mobile phone</td>
    </tr>
    <tr>
      <td>/1.1/login</td>
      <td>POST</td>
      <td>login</td>
    </tr>
    <tr>
      <td>/1.1/users/&lt;objectId&gt;</td>
      <td>GET</td>
      <td>retrieve a user</td>
    </tr>
    <tr>
      <td>/1.1/users/me</td>
      <td>GET</td>
      <td>retrieve a user via session token</td>
    </tr>
    <tr>
      <td>/1.1/users/&lt;objectId&gt;/refreshSessionToken</td>
      <td>PUT</td>
      <td>reset session token</td>
    </tr>
    <tr>
      <td>/1.1/users/&lt;objectId&gt;/updatePassword</td>
      <td>PUT</td>
      <td>reset password via email</td>
    </tr>
    <tr>
      <td>/1.1/users/&lt;objectId&gt;</td>
      <td>PUT</td>
      <td>update user info</td>
    </tr>
    <tr>
      <td>/1.1/users</td>
      <td>GET</td>
      <td>query users</td>
    </tr>
    <tr>
      <td>/1.1/users/&lt;objectId&gt;</td>
      <td>DELETE</td>
      <td>delete a user</td>
    </tr>
    <tr>
      <td>/1.1/requestPasswordReset</td>
      <td>POST</td>
      <td>request to reset password via email</td>
    </tr>
    <tr>
      <td>/1.1/requestEmailVerify</td>
      <td>POST</td>
      <td>request to verify email</td>
    </tr>
    <tr>
      <td>/1.1/requestMobilePhoneVerify</td>
      <td>POST</td>
      <td>request to verify mobile phone</td>
    </tr>
    <tr>
      <td>/1.1/verifyMobilePhone/&lt;code&gt;</td>
      <td>POST</td>
      <td>verify mobile phone number</td>
    </tr>
    <tr>
      <td>/1.1/requestChangePhoneNumber</td>
      <td>POST</td>
      <td>request to change mobile phone number</td>
    </tr>
    <tr>
      <td>/1.1/changePhoneNumber</td>
      <td>POST</td>
      <td>change mobile phone number</td>
    </tr>
    <tr>
      <td>/1.1/requestLoginSmsCode</td>
      <td>POST</td>
      <td>request to send an SMS for logging in</td>
    </tr>
    <tr>
      <td>/1.1/requestPasswordResetBySmsCode</td>
      <td>POST</td>
      <td>request to reset password via SMS</td>
    </tr>
    <tr>
      <td>/1.1/resetPasswordBySmsCode/&lt;code&gt;</td>
      <td>PUT</td>
      <td>reset password via SMS</td>
    </tr>
  </tbody>
</table>

### Roles

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>HTTP Method</th>
      <th>Functionality</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/1.1/roles</td>
      <td>POST</td>
      <td>create a role</td>
    </tr>
    <tr>
      <td>/1.1/roles/&lt;objectId&gt;</td>
      <td>GET</td>
      <td>retrieve a role</td>
    </tr>
    <tr>
      <td>/1.1/roles/&lt;objectId&gt;</td>
      <td>PUT</td>
      <td>update a role</td>
    </tr>
    <tr>
      <td>/1.1/roles</td>
      <td>GET</td>
      <td>query roles</td>
    </tr>
    <tr>
      <td>/1.1/roles/&lt;objectId&gt;</td>
      <td>DELETE</td>
      <td>delete a role</td>
    </tr>
  </tbody>
</table>
