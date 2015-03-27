# hubot-lambda
[![Build Status](https://travis-ci.org/davemkirk/hubot-lambda.svg?branch=master)](https://travis-ci.org/davemkirk/hubot-lambda)

[![NPM](https://nodei.co/npm/hubot-lambda.png?downloads=true)](https://nodei.co/npm/hubot-lambda/)

A [Hubot](https://hubot.github.com/) script for invoking [AWS Lambda](http://aws.amazon.com/lambda/) functions

## Why

- Separate invocation privileges from execution privileges.
- New languages will almost certainly be added to AWS Lambda, in this case hubot-lambda would enable easy cross language Hubot integrations.
- Potentially a robust mechanism for enabling ad-hoc hubot script additions/modifications without recycling the hubot process. (I'd like some feedback on this one)  

## Installation

Add `hubot-lambda` to your package.json, run `npm install` and add hubot-lambda to `external-scripts.json`.

Add hubot-lambda to your `package.json` dependencies.

```
"dependencies": {
  "hubot-lambda": "0.0.0"
}
```

Add `hubot-lambda` to `external-scripts.json`.

```
> cat external-scripts.json
> ["hubot-lambda"]
```

##### Required ENV Variables

```
> export HUBOT_LAMBDA_AWS_ACCESS_KEY_ID="XXXX"
> export HUBOT_LAMBDA_AWS_SECRET_ACCESS_KEY="XXXX"
```

##### Required AWS User Policy
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "*"
    }
  ]
}
```


Usage
-----

- `hubot lambda <functionName> <arg1>`

Example
-----

- `hubot lambda helloWorld Yo`


