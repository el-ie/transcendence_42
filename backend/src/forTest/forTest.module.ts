import { Module } from '@nestjs/common';
import { ForTestService } from './forTest.service';
import { ForTestController } from './forTest.controller';


import { AuthController } from 'src/auth/auth.controller';
import { AuthModule } from 'src/auth/auth.module';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';

import { FortyTwoStrategy } from 'src/auth/strategy/42.strategy';
//import { PassportModule } from '@nestjs/passport';

import { UserModule } from "src/user/user.module";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { TwoFaJwtStrategy } from "src/auth/strategy/2fa.jwt.strategy";

@Module({
	imports: [JwtModule.register({}), UserModule, AuthModule],
  controllers: [ForTestController],
  providers: [ForTestService],
})
export class ForTestModule {}
