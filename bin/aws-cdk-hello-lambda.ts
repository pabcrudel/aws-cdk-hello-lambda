#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkHelloLambdaStack } from '../lib/aws-cdk-hello-lambda-stack';

const app = new cdk.App();
new AwsCdkHelloLambdaStack(app, 'AwsCdkHelloLambdaStack');