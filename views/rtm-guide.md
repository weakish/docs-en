{% import "views/_helper.njk" as docs %}
# Real-time Messaging Guide

LeanCloud Real-time Messaging (RTM) service provides hosted infrastructure, APIs, SDKs, and UI toolkits that allow developers to easily integrate rich, engaging messaging experiences directly into native and web apps.

Designed for asynchronous, person-to-person and business-to-consumer messaging, LeanCloud RTM SDK provides you with:

- Direct Messaging, Group Conversations with up to 500 members, Temporary Conversations with unlimited number of members.
- Rich-content Messages combining text, rich media content, and application data.
- Message delivery and read receipts for each Conversation participant
- [Mentioning people](#mentions) in Group Conversation, Muting Group Conversation, [Typing Indicators](#typing-indicators), [Message Recall](#message-recall) and [Revision](#message-revision).
- Integrated support for mobile push notifications via APNs and FCM
- Built-in user management
- A flexible querying interface for searching and retrieving data
- Blocking and suspension of users
- Robust connection management and offline support
- Rapid development of consumer-class user experiences via the UI toolkits ChatKit on [iOS](https://github.com/leancloud/ChatKit-OC) and [Android](https://github.com/leancloud/LeanCloudChatKit-Android)
- APIs for bot integrations

## Getting Started

<!-- There are a few core concepts you should understand:

Conversations and Chat Rooms contain a set of members and an unlimited number of messages.

Each message is sent by a specific user, and can contain textual and binary content which will be uploaded to LeanCloud, the URL of the uploaded file is sent instead. Our SDK automatically handle this; if you are using the REST APIs, you will have to handle this yourself. However, a common pattern is to send a URL in a message, and load the latest data available at the URL before displaying the rest of the message in your app.

The MIME type tells your app how to display the contents of the message part. For example, if the message part contains a URL, a MIME type of text/plain might cause your app to display the URL as text, as if one user had sent a link to another. However, if the MIME type is image/jpeg, your app might display the image specified by the URL rather than the URL itself.

> Messages can be edited even after they've been sent.

Conversations and Temporary Conversations differ in some ways:

- Conversations can have at most 500 members, whereas Temporary Conversation can have an unlimited number of members.
- Conversation Messages track who has received and who has read each message, while Temporary Conversation Messages do not track any received or read state. -->

### Installing SDK

The simplest way to load the LeanCloud RTM JavaScript SDK is through npm:

```sh
$ npm install leancloud-realtime --save
```

You can also include it in your project with `<script>` tag:

```html
<script src="//cdn.jsdelivr.net/npm/leancloud-realtime@4.2.0/dist/realtime.browser.min.js"></script>
```

### Initializing

After importing the RTM SDK into your project, you can get a new instance of the `Realtime` class like this:

```js
var { Realtime } = require('leancloud-realtime');
var realtime = new Realtime({
  appId:  '{{appid}}',
  appKey: '{{appkey}}',
  region: 'cn', //  'us' for US region
});
```

We will be using `realtime` to refer to a `Realtime` instance in this document  unless otherwise stated.

<!-- To understand how regions are set up, please see the JavaScript SDK Setup document. -->

### Installing Plugins

If you want to send rich-content messages in addition to plain-text messages with our SDK, such as pictures, voices, videos, files and locations, you need to install the following plugins to enable the feature.

- `leancloud-storage`
- `leancloud-realtime-plugin-typed-messages`

<!-- Multi-media files and binary files can take up much more storage space than text ones, they will be automatically upload to the cloud. -->

Install via npm:

```bash
npm install --save leancloud-storage leancloud-realtime-plugin-typed-messages 
```

In a web project, the scripts should be loaded in the following order:

```html
<script src="./node_modules/leancloud-storage/dist/av.js"></script>
<script src="./node_modules/leancloud-realtime/dist/realtime.browser.js"></script>
<script src="./node_modules/leancloud-realtime-plugin-typed-messages/dist/typed-messages.js"></script>
```

When working with a web browser, you can initialize all the resources as follows:

```js
// initialize LeanCloud Storage SDK
AV.init({
  appId:  '{{appid}}',
  appKey: '{{appkey}}',
});

// initialize LeanCloud Real-time Messaging SDK
var Realtime = AV.Realtime;
var realtime = new Realtime({
  appId:   '{{appid}}',
  appKey:  '{{appkey}}',
  // register the Rich-content Message plugin
  plugins: [AV.TypedMessagesPlugin],
});

// you can access all the member functions exposed
// by the plugin using the AV namespace
var imageMessage = new AV.ImageMessage(file);
```

To use the plugin in a Node.js environment or any CommonJS-compliant environments, you will need to take the following initialization routine:

```js
var AV = require('leancloud-storage');
var { Realtime } = require('leancloud-realtime');
var { TypedMessagesPlugin, ImageMessage } = require('leancloud-realtime-plugin-typed-messages');

// initialize LeanCloud Storage SDK
AV.init({
  appId:  '{{appid}}',
  appKey: '{{appkey}}',
});

// initialize LeanCloud Real-time Messaging SDK
var realtime = new Realtime({
  appId:  '{{appid}}',
  appKey: '{{appkey}}',
  // register the Rich-content Message plugin
  plugins: [TypedMessagesPlugin],
});
var imageMessage = new ImageMessage(file);
```

A complete list of member functions of the Typed-Message Plugin can be found in its own [API document](https://leancloud.github.io/js-realtime-sdk/plugins/typed-messages/docs/module-leancloud-realtime-plugin-typed-messages.html) on Github.

## Connecting

Every user has to connect to the LeanCloud RTM Server before using any messaging functionality. The connection to the server can be established by passing in a `clientId`, *a string up to 64 characters long*, which is used by the server for identifying each user.

It's entirely up to you how you generate the `clientId` string, but it should be *unique within your app*. It is also *case-sensitive*. For example, the server sees "<span class="monospace">someClientId</span>" and "<span class="monospace">someclientid</span>" as different users.

You can use the `createIMClient` method on the`realtime` instance to set up the connection between the client and the server. The purpose of creating the IMClient is to let the SDK maintain a long connection with the server for handling messaging processes and responding to various events.

```js
// We use a simple string 'Tom' as the clientId
realtime.createIMClient('Tom').then(function(clientTom) {
  // connection established successfully
  // clientTom is an instance of IMClient
  console.log(clientTom);
}).catch(console.error);
```

<!-- {{ docs.note("Note: JavaScript SDK and C# (Unity3D) SDK will establish the connection to the server with the creation of the IMClient, whereas both iOS SDK and Android SDK require an extra step to establish the connection.") }} -->

Optionally, you can make use of LeanCloud cloud-based User Management feature (AVUser) and conveniently connect authenticated users to the RTM Server without needing the `clientId`.

```js
var AV = require('leancloud-storage');
// first, log the user in with username and password
AV.User.logIn('USERNAME', 'PASSWORD').then(function(user) {
  // user successfully logged in
  // connect the current user to the server
  return realtime.createIMClient(user);
}).catch(console.error.bind(console));
```

Internally our SDK will use the `objectId` of the authenticated user for the `clientId`. We also recommend using the current user's `username` for the clientId to create the IMClient instance as it is also unique throughout an application.

```js
realtime.createIMClient(
  user.get('username')
);
```

The AVUser approach depends on LeanCloud Storage SDK. You should consult the [Installing Plugins](#installing-plugins) section for setup tips.

Once connected to the server either way, there is no difference in using any functionalities described in the rest of the document.

Please note that you only need to call the `createIMClient` method *once* throughout your application and throughout the lifespan of your application.

Internally our SDK will not create multiple `IMClient` instances for the same `clientId`, which means even when you call the `createIMClient` method multiple times with the same clientId, you get the same `IMClient` instance.

However, there can be scenarios where multiple IMClients are needed in one place, such as allowing user to switch accounts within your app. In such case, try to create two IMClients with *different* clientIds, both of them will be functional.

### Disconnecting

To disconnect a user from the server, you can use the `close` method on the`IMClient` instance. <!-- Closing the client also helps release database and network resources, ensuring that references drop out of memory when the IMClient is no longer needed.-->

```js
clientTom.close().then(function() {
  console.log('Tom has disconnected from the server.');
}).catch(console.error.bind(console));
```

<!-- ### Single Device Sign-on

Normally our RTM Server allows simultaneous connections created using the same `clientId` from more than one device. But if you need to restrict a user to logging in only from one device at a time, a solution would be logging the current device when user logs in, for example, `{ "tag" : "deviceA" }`,
如果使用场景中需要限制用户只在一处登录，可以在登录时明确设置当前设备的 tag， 当 LeanCloud 检测到同一个 tag 的设备出现冲突时，会自动踢出已存在设备上的登录状态。 -->

### Network States

After the client connects to the server, you don't have to concern about the network states because our SDK takes care of it for you. It will automatically reconnect when necessary to keep the client staying online. But if you care to know what happens behind the scene, the [Client Events and Network States](#client-events) section has it all. You will learn how to subscribe to those events and play with them to fine-tune your user experience.

<!-- 对于 Android 平台，我们使用常驻后台的服务保持在线状态；对于 iOS 和 Windows Phone 等平台，我们会在应用仍在前台时保持连接，当应用退到后台时，自动断开连接再激活平台原生的推送服务。 -->

## Conversations

Once connected to the server, users can send and receive messages, which are tied to a specific Conversation object.

### Creating a Conversation

Conversation objects are created by calling the `createConversation` method on the `IMClient` instance, passing in an array of `clientIds` to be included in the conversation using the required `members` parameter.

Let's create a Conversation between Tom and Jerry with the name of "Era of Peace":

```js
realtime.createIMClient('Tom').then(function(clientTom) {
  return clientTom.createConversation({
    members: ['Jerry'],
    name:    'Era of Peace'
  });
}).then(function(conversation) {
  var CONVERSATION_ID = conversation.id;
})
```

You don't have to include the current user's `clientId` ('Tom' in this case) in the set of members. The current user is automatically added to all conversations they create.

The `name` parameter defines the name of the Conversation. It is optional and defaults to null if omitted.

The `conversation.id` is the unique identifier for each conversation, which can be used for retrieving details of a specific conversation (see [Querying Conversations}(#querying-conversations)).

Let's create another Conversation with more people:

```js
clientTom.createConversation({
  members: ['Bob', 'Harry', 'William'],
  name:    'Weekend Ice Skating'
});
```

As you can see, there are no distinctions between a one-on-one Conversation and a Group Conversation except that they have different number of members. In fact, this is what our SDK thinks too.

The Conversation object will be saved to the [`_Conversation`](/dashboard/data.html?appid={{appid}}#/_Conversation) Class on LeanCloud.

<!-- Conversations are not synced with the server until the first message is sent. This means that other members will not see a newly created conversation until the first message is sent. You can force the empty conversation to be synced by calling conversation.send() on your Conversation instance. -->

### Conversation Properties

Most properties of a Conversation instance have corresponding fields in the   `_Conversation` Class.

| Properties      | _Conversation Field | Note                        |
| --------------------- | ---------------- | ------------------------- |
| `id`                  | `objectId`       | unique identifier                  |
| `name`                | `name`           | conversation name  |
| `members`             | `m`              | clientIds of all participants of the conversation                      |
| `creator`             | `c`              | clientId of who created the conversation                      |
| `transient`           | `tr`             | if it is a Chatroom |
| `system`              | `sys`            | if it is a System Conversation                   |
| `mutedMembers`        | `mu`             | clientIds of members who muted the conversation                  |
| `muted`               | N/A              | if the current user muted the conversation               |
| `createdAt`           | `createdAt`      | timestamp, when the conversation was created                      |
| `updatedAt`           | `updatedAt`      | timestamp, when the conversation was last updated                    |
| `lastMessageAt`       | `lm`             | timestamp, when the last message was sent |
| `lastMessage`         | N/A              | content of the last message               |
| `unreadMessagesCount` | N/A              | count of unread messages                     |
| `lastDeliveredAt`     | N/A              | timestamp, when the last message was delivered (*two-member conversation only*) |
| `lastReadAt`          | N/A              | timestamp, when the last message was read (*two-member conversation only*) |

The `name` property can be set at the creation of the Conversation or at a later time. It can be seen by every member of the Conversation.

Suppose that Tom would like to change the name of the conversation with Jerry to "Cats Love Mice":

```js
clientTom.getConversation(CONVERSATION_ID).then(function(conversation) {
  conversation.name = 'Cats Love Mice';
  return conversation.save();
}).then(function(conversation) {
  console.log('name updated to: ' + conversation.name);
}).catch(console.error.bind(console));
```

The `members` property should always be handled by SDK and REST API. Manually changing its value through Data Browser in your app's dashboard can produce unexpected results thus is prohibited.

<!-- The `creator` property holds the `clientId` of the user who created the conversation. 根据对话中成员的 `clientId` 是否与 `conversation.creator` 一致就可以判断出他是不是群的创建者。 -->

### Adding Custom Properties

You can add your own properties to a Conversation instance to facilitate your development.

Let's say that we are adding two custom properties to the conversation, one is `type = 'private'` meaning this is a private conversation, and the other is `pinned = true` meaning the conversation is pinned to the top of the conversation list in your app.

```js
clientTom.createConversation({
  members: ['Jerry'],
  type:    'private',
  pinned:  true,
}).then(function(conversation) {
  console.log('success. id: ' + conversation.id);
}).catch(console.error.bind(console));
```

Custom properties is visible and accessible to all conversation members. They can be easily retrieved through standard interface. Please refer to the [Querying Conversations](#querying-conversations) section for tips.

### Unique Conversations

When creating a Conversation, you have the option to make it unique by adding the `unique` parameter and setting it to `true`. It means once a Conversation has been created between User A and User B, any further attempts by either of these users to create a new Conversation with these members will get resolved to the existing Conversation.

```js
clientTom.createConversation({
  members: ['Jerry', 'Spike', 'Butch'],
  name:    'Party on weekends',
  unique:  true,
});
```

Conversations are NOT unique by default. So when the `unique` parameter is omitted or set to false, multiple users can independently create multiple instances of Conversation with the same set of members. Let's see some examples:

```js
var chat1 = clientTom.createConversation({
  members: ['Jerry', 'Spike'],
  unique:  true,
});
var chat2 = clientTom.createConversation({
  members: ['Jerry', 'Spike'],
  unique:  true,
});
var chat3 = clientTom.createConversation({
  members: ['Jerry', 'Spike'],
  unique:  false,
});
```

In the above example

- chat1 and chat2 return the same Conversation.
- chat1 and chat3 are both newly created Conversations.

### Managing Members

Members in a conversation can be added or removed at any time. LeanCloud RTM Server can keep track of a conversation admin/owner, and by default any participant in the Conversation can add or remove members from the conversation. However, it is possible to prevent users from modifying members within your application's logic.

<!-- custom metadata +  -->

It is also advisable that you implement authentication flow to verify user's identity/signature before letting them operate on a Conversation. More technical details are provided in the [Authentication](#authentication) section of this document.

```js
// Adds a participant to an existing conversation
conversation.add(['UserC']);

// Removes a participant from an existing conversation
conversation.remove(['UserB']);
```

Adding or removing members from a unique conversation (see below) makes it non-unique. For example, if you have the following conversations:

- Conversation 1 is unique and has Users A and B
- Conversation 2 is unique and has Users A, B, and C

Adding User C to Conversation 1 will result in the following:

- Conversation 1 is non-unique and has Users A, B, and C
- Conversation 2 is unique and has Users A, B, and C

<!-- > 由于暂态对话不支持创建唯一对话，所以将 transient 和 unique 同时设为 true 时并不会产生预期效果。
### 主动加入对话 JOIN
### 退出对话 QUIT -->

<!-- ### Converation Types -->

### Muting a Conversation

If a user doesn't want to receive messages from a Conversation while not planning to quit the conversation, you can use the `mute` method to put the target Conversation into "Do-Not-Disturb" mode.

For iOS and Windows Phone users, the server also stops sending push notifications for new messages in the muted Conversation when the user is offline.

```js
client.getConversation(CONVERSATION_ID).then(function(conversation) {
  return conversation.mute();
}).then(function(conversation) {
  console.log('conversation is muted');
}).catch(console.error.bind(console));
```

To take a Conversation off mute, use the `unmute` method.

The `mu` field (mutedMembers) in the `_Conversaton` Class gets automatically updated along with the mute and unmute actions. So you should not attempt to manually update that field, otherwise issues may arise.

## Messages

Messages are the basic building block of all conversations. Message objects represent individual messages. They belong to a conversation and can consist of text, image, audio, video, location information and file. Besides, our SDK allows you to cook up your own message type. For example, you may send a photo along with a title and a description, resembling the look and feel of a blog post.

Each message keeps track of its delivery and read state for every participant in a *normal* Conversation.

### Creating a Message

Message objects are created by calling the class constructor of a specific message type with parameters. Let's start with creating a text message.

```js
var { TextMessage } = require('leancloud-realtime');
var message = new TextMessage('How\'s it going, mouse?')
```
<!-- // use 'Tom' for the clientId
realtime.createIMClient('Tom').then(function(tom) {
  // create a conversation with Jerry
  return tom.createConversation({
    members: ['Jerry'],
  })
}).then(function(conversation) {
  // send message
  return conversation.send(new TextMessage('Where are you?'));
}).then(function(message) {
  console.log('success');
}).catch(console.error); -->

### Rich Content Messages

Creating messages with images, audios, videos and files isn't as straightforward as with text, but they share the same pattern to build:

- Get the file data you want to send from the local system or through dedicated API. A valid file URL is also acceptable.
- Use LeanCloud Storage SDK to save the file or the URL on LeanCloud
- Use the [`AV.File`](storage-guide.js#Files) object created in the previous step as parameter to create the Message object

> At this point, you need to install [the supporting libraries](#installing-plugins) (Typed Message plugin and LeanCloud Storage SDK) before continuing, or creation of a non-text Message object would fail.

Let's create an Image Message object from a file steam.

```js
/* HTML: <input type="file" id="photoFileUpload"> */
var AV = require('leancloud-storage');
var { ImageMessage } = require('leancloud-realtime-plugin-typed-messages');

var fileUploadControl = $('#photoFileUpload')[0];
var file = new AV.File(
  'avatar.jpg',
  fileUploadControl.files[0]
);
file.save().then(function() {
  var message = new ImageMessage(file);
  // message.setText('my new avatar');
}).catch(console.error.bind(console));
```
<!-- message.setText('my new avatar');
message.setAttributes({ location: 'New York' }); -->
The code above accesses an HTML File input, gets its data from the Javascript File object (subclass of Blob), and sticks the File into `AV.File` which uploads the file data to the cloud and returns a new file object for Image Message to use.

If using an image URL, the only difference lies in the `AV.File` part:

```js
var AV = require('leancloud-storage');
var { ImageMessage } = require('leancloud-realtime-plugin-typed-messages');

var file = new AV.File.withURL(
  'avatar.jpg',
  'http://ww3.sinaimg.cn/bmiddle/596b0666gw1ed70eavm5tg20bq06m7wi.jpg'
);

file.save().then(function() {
  var message = new ImageMessage(file);
  // message.setText('my new avatar');
}).catch(console.error.bind(console));
```

Location data is different from file data. So now you need to instantiate an `AV.GeoPoint` object using LeanCloud Storage SDK and pass it on to the `LocationMessage` constructor to create a Location Message instance.

```js
var AV = require('leancloud-storage');
var { LocationMessage } = require('leancloud-realtime-plugin-typed-messages');

var location = new AV.GeoPoint(31.3753285,120.9664658);
var message = new LocationMessage(location);
// http://jsplay.avosapps.com/xol/embed?js,console
```

### Sending a Message

When your message is ready, you call the `send` method on the Conversation instance to send it.

```js
var message = new TextMessage('hello');
conversation.send(message);
```

The `send` method takes optional parameters that either provide additional features or change the way it is.

```js
conversation.send(message, {
  transient: true
});
```

Parameter | Type | Note
---|---|---
`transient` | Boolean	| Whether this is a transient message or not. See [Transient Message](#transient-message)
`receipt` | Boolean	| Whether to track recipient status or not  (only applies to a normal Conversation). See [Confirming Delivery](#confirming-delivery)
`will` | Boolean	| Whether this is a last-will message or not. The message will not be sent until the current user goes offline. See [Last-will Message](#last-will-message)
`priority`| MessagePriority | By what priority the message should be delivered  (only applies to Chatroom/Transient Conversations). See [Message Priority](#Message-Priority)
`pushData` | Object | When the message recipient is offline, push the content defined in the object to the receiving device (only applies to mobile clients using our iOS or Android SDK, only works for normal Conversations.) See [Push Notifications](#Push-Notifications)

### Receiving Messages

Our SDK automatically receives incoming messages. You can listen to the `MESSAGE` event on the `IMClient` instance and react accordingly. Typically your main interest in these received Messages is how to render them.

```javascript
// make sure you have loaded the Typed Messages Plugin before you proceed
// initialization done, Realtime instance ready
var { Event, TextMessage } = require('leancloud-realtime');
var { FileMessage, ImageMessage, AudioMessage, VideoMessage, LocationMessage } = require('leancloud-realtime-plugin-typed-messages');
// register event handler for MESSAGE
client.on(Event.MESSAGE, function messageEventHandler(message, conversation) {
  // your rendering code goes here
  var file;
  switch (message.type) {
    case TextMessage.TYPE:
      console.log('text message. text: ' + message.getText() + ', msgId: ' + message.id);
      break;
    case FileMessage.TYPE:
      file = message.getFile(); // file an AV.File instance
      console.log('file message. url: ' + file.url() + ', size: ' + file.metaData('size'));
      break;
    case ImageMessage.TYPE:
      file = message.getFile();
      console.log('image message. url: ' + file.url() + ', width: ' + file.metaData('width'));
      break;
    case AudioMessage.TYPE:
      file = message.getFile();
      console.log('audio message. url: ' + file.url() + ', width: ' + file.metaData('duration'));
      break;
    case VideoMessage.TYPE:
      file = message.getFile();
      console.log('video message. url: ' + file.url() + ', width: ' + file.metaData('duration'));
      break;
    case LocationMessage.TYPE:
      var location = message.getLocation();
      console.log('location message: ' + location.latitude + ', longitude: ' + location.longitude);
      break;
    default:
      console.warn('unknown message type');
  }
});
// http://jsplay.avosapps.com/fux/embed?js,console
```

Meanwhile, you can also watch for the `MESSAGE` event on the Conversation that receives messages.

```javascript
var { Event } = require('leancloud-realtime');
conversation.on(Event.MESSAGE, function messageEventHandler(message) {
  // your logic
});
```

### Transient Message

If a message is transient, it cannot be saved on LeanCloud, nor can it be retrieved with query, or be taken as the unread for offline users, or be included in push notification. Its temporary nature makes it perfect for providing instant feedback, such as "someone is typing", or "someone changed the conversation name to ...".

The code below defines a [custom message type](#custom-message-types) `OperationMessage` particularly for sending and receiving all user-operation related messages.

```javascript
// operation-message.js

var { TypedMessage, messageType, messageField } = require('leancloud-realtime');
// written in TypeScript syntax

// assign type value, can be other positive number
@messageType(1)
@messageField('op')
class OperationMessage extends TypedMessage {}

// app.js

realtime.createIMClient('Tom').then(function(clientTom) {
  return clientTom.createConversation({
    members: ['Jerry'],
  });
}).then(function(conversation) {
  var message = new OperationMessage();
  message.op = 'typing';
  // make it a transient message
  return conversation.send(message, {
    transient: true
  });
}).then(function() {
  console.log('message successfully sent');
}).catch(console.error.bind(console));
```

You should have the following code ready for other Conversation members in order for their clients to recognize the new OperationMessage type: 

```javascript
// operation-message.js same as above

// app.js
var { Event } = require('leancloud-realtime');
// first, register the custom type message
realtime.register(OperationMessage);
realtime.createIMClient('Jerry').then(function(jerryClient) {
  // register MESSAGE event handler
  jerryClient.on(Event.MESSAGE, function messageEventHandler(message, conversation) {
    switch (message.type) {
      case OperationMessage.TYPE:
        console.log(message.from + ' is ' + message.op);
        break;
      // case ...
      default:
        console.warn('unknown message type');
    }
  });
});
```

### Last-Will Message

The objective of a last-will message is to notify other clients about an ungracefully disconnected client. Each client can specify its last-will message when it connects to the server. The last-will message is just a normal message.  The server stores the message until it detects that the client has disconnected ungracefully. In response to the ungraceful disconnect, the server sends the last-will message to all clients of the conversation that the disconnected client was last in.

<img src="images/lastwill-message.png" width="400" class="responsive">

You can leverage it to implement various strategies when the connection of a client drops (or at least inform other clients about the offline status).

```javascript
var message = new TextMessage('oops, this is embarassing.');
// set the 'will' parameter to make it a last-will message
conversation.send(message, { will: true }).then(function() {
  // message sent successfully
}).catch(function(error) {
  // handle errors
});
```

If the client disconnects normally (using the `close` method), the server discards the stored last-will message, and nothing is sent.

<!-- 遗愿消息有**如下限制**： 同一时刻只对一个对话生效 -->

### Message Priority

When there are too many Chatroom messages causing network congestion, our server will selectively discard some messages of low priority in order to guarantee the efficiency of messaging delivery.

{{ docs.note("Our server don't discards messages of a normal Conversation. Therefore priority setting would not have any effect on messages of a normal Conversation even if it was set.") }}

| Priority                 | Apply to                          |
| ------------------------ | --------------------------------- |
| `MessagePriority.HIGH`   | more time-sensitive messages, such as sending gifts and tipping |
| `MessagePriority.NORMAL` | non-repetitive normal text               |
| `MessagePriority.LOW`    | less time-sensitive messages, such as real-time comments     |

Message Priority can be set in the `send` method of the Conversation instance:

```js
var { Realtime, TextMessage, MessagePriority } = require('leancloud-realtime');
var realtime = new Realtime({
  appId:  '{{appId}}',
  appKey: '{{appKey}}',
  region: 'cn'
});

realtime.createIMClient('host').then(function (clientHost) {
    return clientHost.createConversation({
        members:   ['broadcast'],
        name:      'Tom & Toodle\'s Wedding',
        transient: true
    });
}).then(function (conversation) {
    return conversation.send(
      new TextMessage(
        'Tom is about to kiss Toodle'
      ), {
        priority: MessagePriority.HIGH
      });
}).then(function (message) {
    console.log(message);
}).catch(console.error);
```

### Mentions

When participating in group conversations with a lot of active members, you may need to (a) grab someones attention in a group or (b) give a hint to someone where to pay attention while he or she will return.

Mentioning other people in groups is handy since it sends them a notification about your message if they didn't mute the group. You also have the option to send them a notification anyway even though they muted the group. The option can be found in your app's [Messaging settings][messaging-settings] page.

 <!-- – even if they don't have a username. Just type the @ symbol and select whoever you would like to address.  -->

When sending the message, you can use the `setMentionList` method with a single `clientId` to mention a specific person, or an array of clientIds to mention a bunch of people:

```js
const message = new TextMessage(`@Tom`).setMentionList('Tom');
```

Or mention every one of the group:

```js
const message = new TextMessage(`@all`).mentionAll();
```

When a message is received, you can get a list of clientIds that have been mentioned using the `getMentionList` method on theMessage object:

```js
client.on(Event.MESSAGE, function messageEventHandler(message, conversation) {
  var mentionList = message.getMentionList();
});
```

The Message object has a flag `mentionedAll` that determines if all members of the conversation have been mentioned:

```js
client.on(Event.MESSAGE, function messageEventHandler(message, conversation) {
  var mentionedAll = receivedMessage.mentionedAll;
});
```

With the `mentioned` flag, you can easily tell whether the current user has been mentioned:

```js
client.on(Event.MESSAGE, function messageEventHandler(message, conversation) {
  var mentioned = receivedMessage.mentioned;
});
```

### Custom Message Types


## Push Notifications

## Querying

Our SDK provides a flexible and expressive interface to query through conversations and messages.

### Querying Conversations

If a conversation's id is known, you can use the `getConversation` method on the IMClient instance to get details about the Conversation.

```javascript
client.getConversation(CONVERSATION_ID).then(function(conversation) {
  console.log(conversation.id);
}).catch(console.error.bind(console));
```

When a client connects to the server, the first thing they probably do is to get the most recent 10 Conversations, including Chatrooms:

```javascript
client.getQuery().containsMembers(['Tom']).find().then(function(conversations) {
  // sorted by lastMessageAt
  conversations.map(function(conversation) {
    console.log(conversation.lastMessageAt.toString(), conversation.members);
  });
}).catch(console.error.bind(console));
```

By default a query returns 10 results at a time, you can specify the `limit` parameter to change the number of results to be returned:  

```javascript
var query = tom.getQuery();
query.limit(20).containsMembers(['Tom']).find().then(function(conversations) {
  console.log(conversations.length);
}).catch(console.error.bind(console));
```

You can put constrains on the Conversation to narrow down your search. All the [built-in properties](#Conversation-Properties) can be used as constrains.

```javascript
// conversation name is 'Tom & Jerry'
query.equalTo('name', 'Tom & Jerry');

// type is a custom property
query.notEqualTo('type', 'private');

// conversation name contains Wedding
query.contains('name', 'Wedding');

// last message date > yesterday
// active conversations since yesterday
var yesterday = new Date(Date.now() - 24 * 3600 * 1000);
query.greaterThan('lm', yesterday);

// age is a custom property
query.greaterThan('age', 18);

// use regular expression to find
// conversations having Chinese names
query.matches('name',/[\\u4e00-\\u9fa5]/);

// find conversations that Bob and Jerry join
query.withMembers(['Bob', 'Jerry']);
```
You can use multiple constrains on one query:

```javascript
// name contains 'fun' and age less than 18 
query.contains('name', 'fun').lessThan('age', 18);
```

To get all conversations you have taken part in, including System Conversations:

```javascript
Promise.all([
  client.getQuery().containsMembers([client.id]).find(),
  client.getServiceConversationQuery().find(),
]).then(function(participatedConversations, serviceConversations) {
}).catch(function(error) {
  // handle error
});
```

Get conversations that was active from 2017-01-01 to 2017-02-01:

```javascript
client.getQuery()
  .greaterThanOrEqualTo('lm', new Date('2017-01-01 00:00:00'))
  .lessThan('lm', new Date('2017-02-01 00:00:00'))
```

Use the `doesNotExist` method to look for NUll values:

```javascript
client.getQuery()
  // lm does not exist
  .doesNotExist('lm')
  .find()
  .then(function(conversations){

  })

// value cannot be null 
client.getQuery()
  .exists('lm')
```


<!-- #### 缓存查询

JavaScript SDK 会对按照对话 id 对对话进行内存字典缓存，但不会进行持久化的缓存。 -->

### Querying Messages

All messages of normal Conversations are saved on LeanCloud. You can use the `queryMessages` method on the Conversation instance to get messages of a specific conversation. If you omit the `limit` parameter, you get the last 20 messages. The limit can be set from 1 to 1000.

```javascript
conversation.queryMessages({
  limit: 10, // ranging from 1~1000, default is 20
}).then(function(messages) {
  // the last 10 message
}).catch(console.error.bind(console));
```

The `createMessagesIterator` method on the Conversation instance allows you to iterate messages on the server and gradually load them into the client.

```javascript
// create an iterator and fetch 10 messages each time
var messageIterator = conversation.createMessagesIterator({ limit: 10 });
// call 'next' the first time, 10 messages returned, more to come, so done is false
messageIterator.next().then(function(result) {
  // result: {
  //   value: [message1, ..., message10],
  //   done: false,
  // }
}).catch(console.error.bind(console));
// call 'next' the second time, 10 messages returned, more to come, done is false
messageIterator.next().then(function(result) {
  // result: {
  //   value: [message11, ..., message20],
  //   done: false,
  // }
}).catch(console.error.bind(console));
// call 'next' the third time, 1 message returned, no more message, done is true 
messageIterator.next().then(function(result) {
  // No more messages
  // result: { value: [message21], done: true }
}).catch(console.error.bind(console));
```

You can also find messages by type:

```js
conversation.queryMessages({ type: ImageMessage.TYPE }).then(messages => {
  console.log(messages);
}).catch(console.error);
```
<!-- ## Client Message Caching

JavaScript SDK 没有客户端聊天记录缓存机制。 -->

### Client Online Status

By providing a list of clientIds to the `ping` method on theIMClient instance, you can figure out which clients are online.

```js
client.ping(['Jerry'])
```

## Message Keyword Screening

To abide by the national cyber-security law, our server proactively monitors all messages in group conversations (including Temporary Conversation and System Conversation). It uses a pre-defined dictionary to conduct keyword scanning, which detects and blocks certain keywords or phrases by replacing them with two asterisk symbols `**`.

Our server supports user-defined dictionary so that you can use it to extend the scope of standard screening to fit your needs. All you need to do is prepare the dictionary file and upload it in your app's [Messaging settings][messaging-settings] page.

Your dictionary file must be authored in the following format:

- Must be a plain-text file with UTF-8 encoding.
- Each phrase or keyword should be on a separate line.
- Keywords may contain spaces. For instance, "damn it", these two words will be  screened and replaced altogether.

New dictionary uploaded will overwrite the previous one. You also need to turn on the **Screen sensitive keywords in messages** option located just above the upload button in order for your dictionary to be used in conjunction with ours.

If you want to implement more advanced features like message content censoring, you can tap into the `_messageReceived` hook provided by our LeanEngine where you will have full control over everything about messages.

## Authentication
<!-- ## Synchronization  -->
## Blacklist

Blacklist is a list of blocked users that can be applied to a Group Conversation  (including Temporary Conversation and Service Conversation).
<!-- Blacklist is a list of blocked users or Conversations. Blacklisting is intended to hide messages from you that you're not interested in, for example spam messages, people who are harassing you that you want to ignore, etc. Blacklisted people don't receive anything when they send you a message, from their point of view they wouldn't even know that they're blacklisted. -->

For example, if a user has been blocked in a Conversation, they will not be able to join that Conversation again or be added to it by other people any more. They will be removed from that Conversation if they were members of it. Each Conversation can have up to 500 blacklisted users.

```js
// block a single user, passing in their clientId
conversation.blockMembers('Tom');
// take multiple users off the blacklist
conversation.unblockMembers(['Tom','Jerry']);
```

When a user is being blacklisted in a Conversation, our SDK will send out  `MEMBERS_BLOCKED` event to all members of the Conversation and `BLOCKED` event specifically to the blocked user. It is your call to decide what to do with these events, like whether they should get notified or not.

```js
client.on(Event.MEMBERS_BLOCKED, function(){
  console.log('Aoh, someone has been blocked...')
});

client.on(Event.BLOCKED, function(){
  console.log('OMG, I\'ve (the current user) been blocked.')
});
```
<!-- 
Our SDK allows a user to block any Group Conversations (including Temporary Conversation and Service Conversation) they don't want to take part in and get messages from. It also prevents other people from adding a user to his or her blacklisted Conversations. -->

{{ docs.note("Please note that currently we don't support user blocking other users or Conversations.") }}

{{ docs.note("Blacklisting is a paid feature on subscription. You can subscribe or unsubscribe to it anytime in your app's [Messaging settings][messaging-settings] page.") }}

## Limitations

There are limits on how frequently an IMClient can perform certain tasks:

- It can send a maximum of 60 messages per minute.
- It can issue a maximum of 120 queries for messages per minute.
- It can perform other operations 30 times at most per minute, such as joining a conversation, leaving a conversation, opening or closing the connection, etc.

Any request that was sent through our SDK but reached any of the above-mentioned limits will be turned down by the server with timeout errors. However, these limits don't apply to REST API requests.

The total messages each app is allowed to send in one minute is capped at 10,000,000. If it doesn't suffice, please [contact support][contact-support].

A single message sent through the IMClient should not exceed 5 KB.

A normal Conversation can have up to 500 members. If you add more than 500 ids to the `m` field (members) in the `_Conversation` Class with LeanCloud Storage API, only the first 500 will be used.

If the server detects that a `clientId` is used with more than 5 different IP addresses at the same time, it will log that clientId and count it with each IP address combination as a separate user going forward. We advise against using the same clientIds on a large volume of devices for messaging.

Each Conversation can hold no more than 100 unreceived messages when user is offline. The RTM Server follows a "First In, First Out" policy by removing the oldest messages while saving the latest ones. Messages that have been removed can be obtained later using [queries](#querying-messages), but won't be included in push notifications or counted as unread messages.

If a user have got more than 50 Conversations with unreceived messages, the server will randomly pick 50 Conversations out of them and push messages and unread message counts of these 50 Conversations to the client when the user reconnects. Messages being left out will not disappear but can be pulled off the cloud on demand using queries.

Each app is allowed to send at most 30 system broadcast messages per day.

### Retention of Conversations

A Conversation will be regarded as Inactive and removed from the cloud database for good if any of the following circumstances occur:

- A Conversation hasn't sent any new messages via SDK or REST API in the past 12 months.
- No fields in the `_Conversation` Class associated with a Conversation have been updated in the past 12 months.

As Conversation queries doesn't update anything in the `_Conversation` Class, Conversations with only querying activities and without messaging activities will still be seen as Inactive ones.

When a Conversation is deleted by the cloud because of inactivity, all its messages are gone too. No recovery is possible. Any client that attempts to retrieve it later will receive `4401 INVALID_MESSAGING_TARGET` error in the response indicating non-existent Conversation.

Conversely, active Conversations will never be removed from the cloud.

This applies to all types of Conversation, including Temporary Conversation and System Conversation.

### Retention of Messages

By default, a message is kept in the cloud for 6 months since its existence. In other words, a Conversation can pull messages created within the last 6 months.

If longer message history matters to you, you can either [contact support][contact-support] and pay to extend this 6-month period to 3 years, or use our REST API to pull messages off and save them on your own server.

## Error Codes

[messaging-settings]: https://leancloud.cn/dashboard/messaging.html?appid={{appid}}#/message/realtime/conf
[contact-support]: emailto:support@leancloud.rocks