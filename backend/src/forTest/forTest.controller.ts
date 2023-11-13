import { ForTestService } from 'src/forTest/forTest.service';
import { Controller, Get, Req, UseGuards, Res, HttpStatus, HttpException, Post, Body, HttpCode, Query } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from '@nestjs/passport';
import { Public } from "src/decorators/public.decorator";

import { toDataURL } from "qrcode";
import { PrismaService } from "src/prisma/prisma.service";
import { AvoidTwoFa } from "src/decorators/avoidtwofa.decorator";


@Public()
@Controller('test')
export class ForTestController {
	constructor(private authService: AuthService, private readonly forTestService: ForTestService, private prisma: PrismaService) {}

	@Public()
	@Get('create_fake_user')
	async fake_user(@Body() body, @Req() req, @Res() response, @Query('username') username: string, @Query('login') login: string) {

		let user = await this.prisma.user.findUnique( { where: { username: username } });
		if (user)
			response.send('username already taken');
		user = await this.prisma.user.findUnique( { where: { login: login } });
		if (user)
			response.send('login already taken');

		user = await this.prisma.user.create({
			data: {
				login: login,
				username: username,
				sessionId: "no need",
			},
		});

		const token = await this.authService.generateJwt(user, 'basic_auth');

		response.cookie('AUTH_TOKEN', token, { httpOnly: false });

		//return response.send();//options?
		response.redirect('http://localhost:3000/home');
			//return  (await this.prisma.user.findMany());
	}

	//pareil que create_fake_user sauf que on donne seulement le parametre name qui sera donne a la fois pour le username et le login ( le meme )
	@Public()
	@Get('create')
	async fake_user2(@Body() body, @Req() req, @Res() response, @Query('name') name: string) {

		let user = await this.prisma.user.findUnique( { where: { username: name } });
		if (user)
			response.send('username already taken');
		user = await this.prisma.user.findUnique( { where: { login: name } });
		if (user)
			response.send('login already taken');

		user = await this.prisma.user.create({
			data: {
				login: name,
				username: name,
				sessionId: "no need",
			},
		});

		const token = await this.authService.generateJwt(user, 'basic_auth');

		response.cookie('AUTH_TOKEN', token, { httpOnly: false });

		//return response.send();//options?
		response.redirect('http://localhost:3000/game');
			//return  (await this.prisma.user.findMany());
	}

	@Public()
	@Get('list_users')
	async list_users()
	{
			return  (await this.prisma.user.findMany());
	}
}
