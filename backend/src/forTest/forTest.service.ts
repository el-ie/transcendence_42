
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ForTestService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
}
