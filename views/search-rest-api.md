# Full-text Search REST API Guide

Full-text search is a common feature for applications.
Although it is possible to implement full text search via [`$regex` queries](rest_api.html#regex-queries),
thi approach does not scales.
Thus LeanCloud provides dedicated REST API for full-text search powered by [the Elasticsearch engine][elastic].

[elastic]: https://www.elastic.co/elasticsearch/

## Overview

URL | HTTP Method | Functionality
- | - | -
/search/select | GET | full text search
/search/mlt | GET | more like this, find similar documents

The current API version is `1.1`.
For request format and response format, please refer to the [Request Format section](rest_api.html#Request-Format) and [Response Format section](rest_api.html#Response-Format) of REST API Guide.

## Enable Search Index

{# TODO translate dashboard #}