import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, isNotEmpty, isNumber } from "class-validator"

enum ChannelType {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
    DIRECT = 'DIRECT',
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    password: string;
}

export class SetAdminDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    login: string;
}

export class ChannelCreaDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsEnum(ChannelType)
   type: ChannelType;

   @IsOptional()
   @IsString()
   password: string;

   @IsString()
   @IsNotEmpty()
   creatorLogin: string;
}

export class NameDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class ChannelJoinDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    login: string;

    @IsOptional()
    @IsString()
    password: string;

}

export class UserloginDto {
    @IsString()
    @IsNotEmpty()
    login: string;
}

export class DirectCreaDto {
    @IsString()
    @IsNotEmpty()
    starterLogin: string;

    @IsString()
    @IsNotEmpty()
    targetLogin: string;

    @IsEnum(ChannelType)
    type: ChannelType;
}

export class idDto {
    @IsNumber()
    id: number;
}