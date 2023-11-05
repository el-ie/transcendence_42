import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/strategy/jwt.global';
import { TwoFaAuthGuard } from './auth/strategy/2fa.global';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

	app.use(cookieParser());

  const reflect = app.get(Reflector);

	app.useGlobalGuards(new JwtAuthGuard(reflect));
	app.useGlobalGuards(new TwoFaAuthGuard(reflect));

  await app.listen(3001);
}
bootstrap();
