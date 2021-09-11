#!/bin/bash
set -e
IFS='|'

# VoD prod env without signed urls

VOD="{\
\"service\":\"video\",\
\"serviceType\":\"video-on-demand\",\
\"providerName\":\"awscloudformation\",\
\"resourceName\":\"VoDClientLibTestCMS\",\
\"enableSnsFunction\":false,\
\"enableCDN\":true,\
\"signedKey\":false,\
\"enableCMS\":true\
}"

# API="{\"version\":1,\"serviceConfiguration\":{\"serviceName\":\"AppSync\",\"apiName\":\"myNewHeadlessApi\",\"transformSchema\":\"type Todo @model {\\r\\n  id: ID!\\r\\n  name: String!\\r\\n  description: String\\r\\n}\",\"defaultAuthType\":{\"mode\":\"API_KEY\"}}}"

amplify video add --payload $VOD