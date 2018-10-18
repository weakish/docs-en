{% import "views/_helper.njk" as docs %}
{% import "views/_sms.njk" as sms %}
{% import "views/_parts.html" as include %}

# Short Message Service (SMS) Guide

LeanCloud SMS makes it easy to incorporate SMS functionality into your application or project. With simple setup and minimum development effort, you can send SMS (text) messages to [all major countries and regions](#Pricing) around the world. Every SMS message sent from LeanCloud can be tracked from your LeanCloud Dashboard (See [Delivery Status](#delivery-status)).

<!-- Statistics show that SMS messaging is one of the most effective ways to send urgent or time-sensitive information to your customers. -->

<!-- LeanCloud strives to use only the best connectivity for delivery to the world. To ensure optimal and high performance of our API platform and delivery of messages on a direct routing class, we may use up to three or four local providers or operator connections for delivery to telecom carriers. -->

LeanCloud SMS has no upfront costs, and you can pay as you go for only what you use. Your first **100 SMS messages** sent to China phone numbers are free. Subsequent SMS messages are charged based on [the pricing](#Pricing) below, and you need to have sufficient [account balance](https://leancloud.cn/dashboard/bill.html#/bill/charge/account) for sending more messages.

<!-- and the character limit depends on the encoding scheme. an SMS message can contain: 160 GSM characters, 140 ASCII characters, 70 UCS-2 characters-->
Each SMS message can contain up to **70 characters**. If you send a message that exceeds the size limit, the telecom carrier sends it as is (where customer sees a whole single message) but counts it as multiple messages, each fitting within 67 characters, and bills accordingly. For example:

- A message of 67 characters will be billed as 1 message.
- A message of 70 characters will be billed as 1 message.
- A message of 134 characters will be billed as 2 messages.
- A message of 140 characters will be billed as **3** messages.

<!-- Messages are not cut off in the middle of a word but on whole-word boundaries. -->

<!-- Why 67 chars? https://www..com/docs/glossary/what-is-gsm-7-character-encoding#how--encodes-your-messages -->

<!-- Multi-segment and Concatenated Messages

If you have a message with multiple segments (a message over 160 characters will be broken up into 160-character segments),  will queue the messages and release them at the rate of one message segment per second.

For example, if your SMS message to a US mobile number is under 160 characters and does not include any non-GSM characters, it only has one message segment, and will be released at the rate of one message per second. If your SMS message has three segments, it’ll take three seconds to delivery that single message. -->

## Formatting International Phone Numbers

When you send an SMS message, specify the phone number using the **E.164 format**. E.164 is a standard for the phone number structure used for international telecommunication. Phone numbers that follow this format can have a maximum of 15 digits, and they are prefixed with the plus character (+), the country code and the local area code if applicable. For example:

Country  | Country Code | Subscriber Number | E.164 Format
---|---|---|---
US | 1 | (760)555-8671 | +17605558671
UK |44 | 07911 123456 | +447911123456
CN | 86 | 186-2503-8918 | +8618625038918

Two important things to note: First of all, in the international E.164 notation a leading "0" is removed. The UK mobile phone number "07911 123456" in international format is "+44 7911 123456", so without the first zero. Secondly in the E.164 notation all spaces, dashes `-` and parentheses `()` are removed. Besides the leading `+`, all characters should be numeric.

If you are unsure of the correct country code, a good reference is this [Wikipedia page](https://en.wikipedia.org/wiki/List_of_country_calling_codes#Alphabetical_listing_by_country_or_region) that lists countries and their calling codes.

<!-- 
E.164 formatting for phone numbers entails the following:

- A + (plus) sign
- International Country calling code
- Local Area code
- Local Phone number -->

## Pricing

The rate below is for one SMS message, and all in Chinese Yuan (CNY). The country list will grow over time. If you can't find what you are looking for, please [let us know](https://leancloud.cn/help) and we will help you confirm.
<!-- Geography Coverage -->

<script src="custom/js/lib/jquery.dataTables.min.js"></script>

<script type="text/javascript">
var smsPrices = [{"CountryNumber":1,"CountryOrRegion":"United States", "CountryCode":"US","UnitPrice":0.07},
{"CountryNumber":1, "CountryOrRegion": "Canada", "CountryCode": "CA", "UnitPrice": 0.07},
{"CountryNumber":7,"CountryOrRegion":"Kazakhstan", "CountryCode":"KZ","UnitPrice":0.58},
{"CountryNumber":7,"CountryOrRegion":"Russia", "CountryCode":"RU","UnitPrice":0.28},
{"CountryNumber":27,"CountryOrRegion":"South Africa","CountryCode":"ZA","UnitPrice":0.23},
{"CountryNumber":30,"CountryOrRegion":"Greece", "CountryCode":"GR","UnitPrice":0.5},
{"CountryNumber":33,"CountryOrRegion":"France","CountryCode":"FR","UnitPrice":0.64},
{"CountryNumber":34,"CountryOrRegion":"Spain", "CountryCode":"ES","UnitPrice":0.75},
{"CountryNumber":39,"CountryOrRegion":"Italy", "CountryCode":"IT","UnitPrice":0.75},
{"CountryNumber":40,"CountryOrRegion":"Romania", "CountryCode":"RO","UnitPrice":0.62},
{"CountryNumber":44,"CountryOrRegion":"United Kingdom", "CountryCode":"GB","UnitPrice":0.35},
{"CountryNumber":49,"CountryOrRegion":"Germany","CountryCode":"DE","UnitPrice":0.72},
{"CountryNumber":52,"CountryOrRegion":"Mexico", "CountryCode":"MX","UnitPrice":0.42},
{"CountryNumber":54,"CountryOrRegion":"Argentina","CountryCode":"AR","UnitPrice":0.59},
{"CountryNumber": 55, "CountryOrRegion": "Brazil", "CountryCode": "BR", "UnitPrice": 0.48},
{"CountryNumber":57,"CountryOrRegion":"Colombia", "CountryCode":"CO","UnitPrice":0.55},
{"CountryNumber":58,"CountryOrRegion":"Venezuela", "CountryCode":"VE","UnitPrice":0.41},
{"CountryNumber":60,"CountryOrRegion":"Malaysia", "CountryCode":"MY","UnitPrice":0.34},
{"CountryNumber":61,"CountryOrRegion":"Australia","CountryCode":"AU","UnitPrice":0.48},
{"CountryNumber":62,"CountryOrRegion":"Indonesia", "CountryCode":"ID","UnitPrice":0.25},
{"CountryNumber":63,"CountryOrRegion":"Philippines", "CountryCode":"PH","UnitPrice":0.37},
{"CountryNumber":65,"CountryOrRegion":"Singapore", "CountryCode":"SG","UnitPrice":0.42},
{"CountryNumber":66,"CountryOrRegion":"Thailand","CountryCode":"TH","UnitPrice":0.34},
{"CountryNumber":81,"CountryOrRegion":"Japan", "CountryCode":"JP","UnitPrice":0.68},
{"CountryNumber":82, "CountryOrRegion": "Korea", "CountryCode": "KR", "UnitPrice": 0.4},
{"CountryNumber":86,"CountryOrRegion":"China", "CountryCode":"CN","UnitPrice":0.05},
{"CountryNumber":90,"CountryOrRegion":"Turkey", "CountryCode":"TR","UnitPrice":0.25},
{"CountryNumber":92,"CountryOrRegion":"Pakistan","CountryCode":"PK","UnitPrice":0.21},
{"CountryNumber":91,"CountryOrRegion":"India", "CountryCode":"IN","UnitPrice":0.09},
{"CountryNumber": 95, "CountryOrRegion": "Myanmar", "CountryCode": "MM", "UnitPrice": 1.1},
{"CountryNumber": 351, "CountryOrRegion": "Portugal", "CountryCode": "PT", "UnitPrice": 0.43},
{"CountryNumber":852,"CountryOrRegion":"Hong Kong","CountryCode":"HK","UnitPrice":0.51},
{"CountryNumber": 853, "CountryOrRegion": "Macau", "CountryCode": "MO", "UnitPrice": 0.27},
{"CountryNumber":855,"CountryOrRegion":"Cambodia","CountryCode":"KH","UnitPrice":0.43},
{"CountryNumber": 856, "CountryOrRegion": "Laos", "CountryCode": "LA", "UnitPrice": 0.68},
{"CountryNumber": 886, "CountryOrRegion": "Taiwan", "CountryCode": "TW", "UnitPrice": 0.46},
{"CountryNumber":960, "CountryOrRegion": "Maldives", "CountryCode": "MV", "UnitPrice": 0.11},
{"CountryNumber":966,"CountryOrRegion":"Saudi Arabia", "CountryCode":"SA","UnitPrice":0.31},
{"CountryNumber": 971, "CountryOrRegion": "United Arab Emirates", "CountryCode": "AE", "UnitPrice": 0.27},
{"CountryNumber": 977, "CountryOrRegion": "Nepal", "CountryCode": "NP", "UnitPrice": 0.45},
{"CountryNumber":998,"CountryOrRegion":"Uzbekistan", "CountryCode":"UZ","UnitPrice":0.73}];
var nodes = [{ code: "cn", name: "China"},{ code: "us", name: "US"  }];

for (var j = 0; j < smsPrices.length; j++){
    smsPrices[j].nodes = {};
    for (var i = 0; i < nodes.length; i++){
        // console.log(nodes[i].code, smsPrices[j]['nodes']);
        smsPrices[j]['nodes'][nodes[i]['code']] = smsPrices[j]['UnitPrice'];
        if (nodes[i].code === 'us' && smsPrices[j].CountryCode === 'CN') {
            smsPrices[j].nodes.us = 0.2
        }
    }
}
</script>

<table class="datatable" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 12px;">
    <thead>
        <tr>
            <th>Country#</th>
            <th>Country/Region</th>
            <th title="Country Code">Code</th>
            <th title="LeanCloud China Region"><strong>China Region</strong></th>
            <th title="LeanCloude US Region"><strong>US Region</strong></th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>

<script type="text/javascript">
$(document).ready(function() {
    var smsPriceTable = $('.datatable').DataTable({
        data: smsPrices,
        // disable pagination
        paging: false,
        info: false,
        ordering: true,
        order: [[ 1, "asc" ]],
        language: {
            zeroRecords: 'No matches found.',
            search: '_INPUT_',
            searchPlaceholder: "filter..."
        },
        columns: [
            { "data": "CountryNumber" },
            { "data": "CountryOrRegion" },
            { "data": "CountryCode" },
            { "data": "nodes.cn" },
            { "data": "nodes.us" }
        ],
        columnDefs: [
            { 
                targets: [3, 4], 
                className: 'text-right text-nowrap', 
                render: function(data, type, row, meta){
                    // &yen; &#165;
                    return '<span class="text-muted" style="opacity: 0.5; padding-right: 4px;">&#65509;</span> ' + data.toFixed(2)
                }
            }, { 
                targets: [0], 
                className: 'text-nowrap', 
                render: function(data, type, row, meta){
                    return '+' + data
                }
            }
        ]
    });
    // style global filter
    $('.dataTables_filter')
        .find('label')
            .css({
                "display": "flex",
                "white-space":  "nowrap",
                "align-items":  "center"
            })
        .find('input')
            .addClass('form-control input-sm')
            .css({
                "flex-basis": '200px'
            });
} );
</script>

## Getting Started

You use LeanCloud SMS APIs to send SMS messages. Those APIs are part of LeanCloud Storage SDK. You can follow the [SDK Setup](storage-guide.html#installing-sdk) document to load LeanCloud Storage SDK into your app or project.

Next, visit your app's dashboard and go to [App Settings > Security Center](https://leancloud.cn/dashboard/app.html?appid={{appid}}#/security), make sure the **SMS** switch is turned on so that your app can start taking SMS related requests from our SDK.

### SMS Signature

An SMS Signature is a piece of information about the sender, may it be the name of your app, your company, or your brand, it should be easy for the recipients to identify. Once defined, it will be automatically included in an outbound message, at the beginning or the end of the message body, adding up to the total length of the message. Any SMS messages without signature will be rejected by the telecom carrier.

<!-- The signature can be  It should contain 1 to 8 alphanumeric characters and cannot consist of only numbers or only alphabets.  签名【应用A】中的 应用A 为 3 个字符。不能有任何非文字字符，也不可以是变量  -->

To create an SMS signature, go to your app's [Messaging > SMS > Settings](https://leancloud.cn/dashboard/messaging.html?appid={{appid}}#/message/sms/conf) page and click the **Create SMS Signature** button to add one. Your new SMS signature will be ready for use after passing our review.

A LeanCloud app can have up to 50 SMS signatures. If there is more than one signature in an app, you need to choose one and make it as **default signature**. Apps having no signature or lacking a default signature will not be able to send SMS messages successfully. <!-- 或未通过审核且无其他可用签名，必须含有中文 -->

### International SMS

### Insufficient Balance Alert

### Daily Spending Limit

### Local Messaging Requirements

## Verification Code Messages

## Transactional & Promotional Messages 

### Content Censoring

## Templating

## CAPTCHA Service

LeanCloud [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) Service helps developers protect their application or website from spam and abuse, known as SMS bombing attack all free of charge. It keeps automated software from engaging in abusive activities on your site. It does this while letting your valid users pass through with ease.

## Integration with AVUser

## FAQ


## Sending and Receiving Limitations on SMS Messages

To protect your project, messages cannot be sent more than 15 times in a 30 second window between your phone number and another number. Doing so may trigger a server warning that your message rate has been exceeded.
