import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { HitCounter } from './hit-counter-construct';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class AwsCdkHelloLambdaStack extends cdk.Stack {
  public readonly hcViewerUrl: cdk.CfnOutput;
  public readonly hcEndpoint: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,    // execution environmet
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "./lambda" directory
      handler: "hello.handler"                // file is "hello.js", function is "handler"
    });

    // Defines an AWS Lambda resorce that lives between "hello" and API Gateway
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    })

    // Defines an API Gateway REST API resource backed by the "hello" function
    const gateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
      /* 
        API Gateway will route the request to the hit counter handler, 
        which will log the hit and relay it over to the hello function. 
        Then, the responses will be relayed back in the reverse order all the way to the user
      */
    });

    const tv = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table
    });

    // Expose TableViewer and ApiGateway endpoints to the CDK Pipeline
    this.hcEndpoint = new cdk.CfnOutput(this, 'GatewayUrl', {
      value: gateway.url
    });

    this.hcViewerUrl = new cdk.CfnOutput(this, 'TableViewerUrl', {
      value: tv.endpoint
    });
  }
}
