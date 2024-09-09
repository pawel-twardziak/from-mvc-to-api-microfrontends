/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import './styles/main.scss';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';

import { AppModule } from './app/app.module';
import {
  registerHbsGlobalPrefixHelper,
  registerHbsJsonHelper,
} from './helpers/hbs';

const appName = 'mature-mvc-app';
const globalPrefix = appName.replace('mature-', '');
let port: string | number;

async function bootstrap() {
  port = process.env.PORT || 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, 'public'), {
    prefix: `/${globalPrefix}/public`,
  });
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  app.setGlobalPrefix(globalPrefix);
  registerHbsJsonHelper();
  registerHbsGlobalPrefixHelper(globalPrefix);

  await app.listen(port);
}

bootstrap().then(() => {
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
});
