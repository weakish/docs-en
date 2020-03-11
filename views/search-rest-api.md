# Full-text Search REST API Guide

Full-text search is a common feature for applications.
Although it is possible to implement full text search via [`$regex` queries](rest_api.html#regex-queries),
this approach does not scales.
Thus LeanCloud provides dedicated REST API for full-text search powered by [the Elasticsearch engine][elastic].

[elastic]: https://www.elastic.co/elasticsearch/

## Overview

URL | HTTP Method | Functionality
- | - | -
/search/select | GET | full-text search
/search/mlt | GET | more like this, find similar documents

The current API version is `1.1`.
For request format and response format, please refer to the [Request Format section](rest_api.html#Request-Format) and [Response Format section](rest_api.html#Response-Format) of REST API Guide.

## Enable Search Index

{# TODO translate dashboard #}

## Full-text Search

To search for objects, you need to send a `GET` request to `/search/select`.
For example, to search for `dennis` in `GameScore` class:

``` sh
curl -X GET \
  -H "X-LC-Id: {{appid}}" \
  -H "X-LC-Key: {{appkey}}" \
  "https://{{host}}/1.1/search/select?q=dennis&clazz=GameScore"
```

The following query parameters are available:

Parameter|Required|Description
---|---|---
`q`|required|[Elasticsearch query string]
`skip`|Optional|Skipped results. Used for pagination.
`limit`|Optional|The number of returned objects. Defaults to 100 and the max is 1000.
`sid`|Optional|Elasticsearch [scroll id]. Returned by previous search. Used for pagination.
`fields`|Optional|逗号隔开的字段列表，查询的字段列表
`highlights`|Optional|Highlighted keywords. It can be comma separated string or wildcard `*`.
`clazz`|Optional|Class name. If not specified, all search enabled classes will be searched.
`include`|Optional|Also search for Pointers. Example: `user,comment`.
`order`|Optional|Order by. Prefix `-` for descending. Example: `-score,createdAt`.
`sort`|Optional|See the [Advanced Sorting](#advanced_sorting) section below. 

[elasticsearch query string]: https://www.elasticsearch.org/guide/en/elasticsearch/reference/6.5/query-dsl-query-string-query.html#query-string-syntax
[scroll id]: https://www.elastic.co/guide/en/elasticsearch/reference/6.5/search-request-scroll.html

The response will be something like:

``` json
{
"hits": 1,
"results": [
  {
    "_app_url": "http://stg.pass.com//1/go/com.leancloud/classes/GameScore/51e3a334e4b0b3eb44adbe1a",
    "_deeplink": "com.leancloud.appSearchTest://leancloud/classes/GameScore/51e3a334e4b0b3eb44adbe1a",
    "_highlight": null,
    "updatedAt": "2011-08-20T02:06:57.931Z",
    "playerName": "Sean Plott",
    "objectId": "51e3a334e4b0b3eb44adbe1a",
    "createdAt": "2011-08-20T02:06:57.931Z",
    "cheatMode": false,
    "score": 1337
  }
],
"sid": "cXVlcnlUaGVuRmV0Y2g7Mzs0NDpWX0NFUmFjY1JtMnpaRDFrNUlBcTNnOzQzOlZfQ0VSYWNjUm0yelpEMWs1SUFxM2c7NDU6Vl9DRVJhY2NSbTJ6WkQxazVJQXEzZzswOw=="
}
```

In the above response body:

- `hits`： Total number of matched results.
- `_highlight`: Highlighted search results, keywords are wrapped in `em` tags. If you did not pass the `highlights` query parameter, `null` will be returned.

### Advanced Sorting

{# TODO #}


## Word Segmentation

{# TODO translate dashboard #}

## More Like This Query