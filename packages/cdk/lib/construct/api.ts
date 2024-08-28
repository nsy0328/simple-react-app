import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';


export interface ApiProps {

}

export class Api extends Construct {
  public readonly api: apigateway.RestApi;
  public readonly apiEndpoint: string;
  

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "api", {
      restApiName: `apigw`,
      cloudWatchRole: true,
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-Amz-User-Agent'
        ],
        allowCredentials: true,
      },
    });
    
    this.api = api;
    this.apiEndpoint = api.url;
  }
}
