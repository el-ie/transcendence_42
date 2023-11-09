import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, isNotEmpty, isNumber } from "class-validator"

enum ChannelType {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
    DIRECT = 'DIRECT',
}

export class AddFriendDto {
    @IsNotEmpty()
    @IsString()
    login: string;

    @IsString()
    @IsNotEmpty()
    target: string;
}

export class ChangeLoginDto {
    @IsString()
    @IsNotEmpty()
    newLogin: string;
}