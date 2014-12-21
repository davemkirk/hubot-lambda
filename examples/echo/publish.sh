#!/usr/bin/env bash
dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

#make sure dependencies are installed
npm install

#Prompt for Lambda Execution Role ARN
echo -n "Enter your lambda execution role ARN: "
read role

#prompt for AWS Region
region="us-east-1"
echo -n "Please enter the AWS Region ($region): "  
read input
region="${input:-$region}"


#Zip for upload
pushd $dir
zip -r -q echo.zip * 
popd

#push to AWS
aws lambda upload-function \
   --region $region \
   --function-name "echo" \
   --function-zip "$dir/echo.zip" \
   --role "$role" \
   --mode event \
   --handler handler.handler \
   --runtime nodejs \
   --timeout 3 \
   --memory-size 128
   #--debug 

#Clean up
rm "$dir/echo.zip"
