# hubot-lambda

A Hubot script for invoking [AWS Lambda](http://aws.amazon.com/lambda/) functions



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


