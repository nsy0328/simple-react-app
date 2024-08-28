import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Duration, RemovalPolicy, Fn } from 'aws-cdk-lib';



type BackendProps = {
    api: apigateway.RestApi;
}

export class Backend extends Construct {
  public readonly contactlensBucket: s3.Bucket;
  constructor(scope: Construct, id: string, props: BackendProps) {
    super(scope, id);

    // DynamoDBテーブルの作成
    const table = new dynamodb.Table(this, 'sampleTable', {
      partitionKey: { name: 'Id', type: dynamodb.AttributeType.STRING },
    });

    // Lambdaレイヤーの作成
    const boto3 = new lambda.LayerVersion(this, 'boto3', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/layer.zip')),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
      description: 'Latest boto3 ',
    });    

    // Lambda関数の作成
    const lambdaFunction = new lambda.Function(this, 'sampleFunction', {
      functionName: 'sampleFunction',
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'gen_answer.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')), // 正しいパスを指定
      timeout: Duration.minutes(15), // タイムアウトを15分に設定
      layers: [ boto3 ],      
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    
    // Lambda関数にDynamoDBとS3フルアクセスのIAMポリシーを追加
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'dynamodb:*',
        'bedrock:*'
      ],
      resources: [
        table.tableArn,
        'arn:aws:bedrock:*:*:*'  
      ]
    }));

    table.grantWriteData(lambdaFunction);

    // エンドポイントを作成
    const items = props.api.root.addResource('health');
    items.addMethod('GET', new apigateway.LambdaIntegration(lambdaFunction));
  }
}