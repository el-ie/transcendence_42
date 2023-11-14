import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, isNotEmpty, isNumber } from "class-validator"



export class LoginDto {
    @IsString()
    @IsNotEmpty()
    login: string
}