import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Web } from './construct/web';
import { Api } from './construct/api';
import { Backend } from './construct/backend';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new Api(this, 'Api', {});
    const web = new Web(this, 'Web', {
      apiEndpointUrl: api.apiEndpoint
    });

    const backend = new Backend(this, 'Backend', {
      api: api.api
    });

    new cdk.CfnOutput(this, 'WebUrl', {
      value: `https://${web.distribution.domainName}`,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
