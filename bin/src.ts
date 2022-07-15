#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApplicationStage } from '../lib/app-stage';

const app = new cdk.App();
new ApplicationStage(app, 'DevEnv')

// Real production pipeline using the same stage