import { ForTestService } from 'src/forTest/forTest.service';
import { Controller, Get, Req, UseGuards, Res, HttpStatus, HttpException, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from '@nestjs/passport';
import { Public } from "src/decorators/public.decorator";

import { toDataURL } from "qrcode";
import { PrismaService } from "src/prisma/prisma.service";
import { AvoidTwoFa } from "src/decorators/avoidtwofa.decorator";


@Controller('test')
export class ForTestController {
  constructor(private authService: AuthService, private readonly forTestService: ForTestService, private prisma: PrismaService) {}

  @Public()
  @Post('create_fake_user')
  async fake_user(@Body() body) {

	  let user = await this.prisma.user.findUnique( { where: { username: body.username } });
	  if (user)
		  return 'username already taken';
	  user = await this.prisma.user.findUnique( { where: { login: body.login } });
	  if (user)
		  return 'login already taken';

		user = await this.prisma.user.create({
			data: {
				login: body.login,
				username: body.username,
				sessionId: "no need",
			},
		});

		return  (await this.prisma.user.findMany());
		//return 'succes';
  }
}
