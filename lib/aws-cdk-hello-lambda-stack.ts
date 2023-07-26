import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class AwsCdkHelloLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,    // execution environmet
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "./lambda" directory
      handler: "hello.handler"                // file is "hello.js", function is "handler"
    });

    // Defines an API Gateway REST API resource backed by the "hello" function
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    });
  }
}
