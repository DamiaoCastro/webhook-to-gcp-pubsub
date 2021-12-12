# Webhook to Google Cloud Pubsub
This code has the simple mission of receiving a payload via HTTP 1.1 on any URL and place the content body in a pubsub topic.
The Dockerfile will run the unit tests and generate the image that can be used in a Google Cloud Run instance.

![](documentation/run_to_pubsub.svg)

The webhook will listen to any url path and HTTP method (GET, POST, PUT, ...). As long that there's a body, the message will be sent to Pubsub. The `content-type` of the http message header will be added in the PubsubMessage attributes under the key `content-type`.

The service account associated with the service that runs the container will be checked for permission `pubsub.topics.publish` on the configured topic before it starts to listen to HTTP calls. If the container fails to start the webserver, please check the logs because this is a possible reason of the container failing to start.

A small functionality of IP or DNS whitelisting is implemented. Please check `IP_WHITELIST` and `DNS_WHITELIST` in the expected environment variables below. In case that none of these environment variables is specified, all IP's are accepted. This feature might be usefull if you want to deploy a simple Google Cloud Run endpoint without having to setup additional layers to restrict the access at IP level. IP ranges are not implemented.

## Expected environment variables

|Environment Variable|Mandatory|Default|Description|
|--------------------|---------|-------|-----------|
|DEFAULT_RESPONSE|No|"OK"|string reponse that will be sent as response body on success(200) call of the webhook|
|PROJECT_ID|Yes||ProjectId of the Google Cloud project that the destination Pubsub is in|
|TOPIC_ID|Yes||TopicId of the destination pubsub topic. Internally, with the PROJECT_ID and TOPIC_ID, the topic name will be composed|
|IP_WHITELIST|No||IP's to whitelist. If `IP_WHITELIST` nor `DNS_WHITELIST` are specified, all IP's will be accepted. Example: `169.254.8.128` or `169.254.8.129;169.254.8.129`|
|DNS_WHITELIST|No||DNS URL to whitelist. If `IP_WHITELIST` nor `DNS_WHITELIST` are specified, all IP's will be accepted. Example: `dns.google.com`. The option of multiple DNS URL's is not implemented.|
|DNS_WHITELIST_REFRESH_MINUTES|No||Number value with the number of minutes that the dns URL defined in `DNS_WHITELIST` should be checked for IP's to whitelist. Minimum is 1, recomended is 60.|
 
## Code style guide
https://google.github.io/styleguide/tsguide.html
