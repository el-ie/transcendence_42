import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AddFriendDto, ChangeLoginDto } from './dto/user.dto';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @Get('me')
    getme(@Req() req: Request) {
        return (req.user);
    }

    @Get('getLogin')
    getLogin (@Req() req) {
        return (req.user.login);
    }

    @Get(':id/avatar')
    async getUserAvatar(@Param('id') userId: string, @Res() res: Response) {
        const fileName = await this.userService.getAvatarPath(parseInt(userId));
        console.log("filename: ", fileName);
        const avatarPath = path.join(__dirname, '..', '..', 'images', fileName);
        res.sendFile(avatarPath);
    }

    @Get('other')
    async getuser(@Query('login') login: string)
    {
        try {
            const user = await this.userService.getUser(login);
            return ({user});
        }
        catch {
            return {error: "404 User not found"}
        }
    }

    @Get('otherById')
    async getUserById(@Query('id') id: string)
    {
        try {
            const user = await this.userService.getUserById(parseInt(id));
            return ({user});
        }
        catch {
            console.log("oups");
            return {error: "404 User not found"}
        }
    }

    @Get('friends')
    async getFriends(@Req() req:any)
    {
        try {
            const users = await this.userService.getFriends(req.user.login);
            return {users};
        }
        catch {
            return {error: "404 User not found"}
        }
    }

    @Get('blocked')
    async getBlocked(@Req() req: any)
    {
        try {
            const usersIds = await this.userService.getBlocked(req.user.login);
            return ({usersIds});
        }
        catch {
            return {error: "404 User not found"}
        }
    }


@Post('uploadAvatar')
@UseInterceptors(FileInterceptor('avatar', {dest: './temp',}))
async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const newFileName = `${req.user.id}_avatar${path.extname(file.originalname)}`;

    const avatarPath = path.join(__dirname, '..', '..', 'images', newFileName);
    console.log(file);
    fs.copyFileSync(file.path, avatarPath);
    fs.unlinkSync(file.path);
    await this.userService.changeAvatarPath(req.user.id, newFileName);

    console.log(`Fichier copié avec succès : ${newFileName}`);
    return (true);
}


    @Post('addFriend')
    async addFriend(@Body() dto: AddFriendDto) {
        try {
          const added = await this.userService.addFriend(dto.login, dto.target);
          return ({added})
        } 
        catch (error) {
          return { error: `you cant add this user`};
        }
    }

    @Post('delFriend')
    async delFriend(@Body() dto: AddFriendDto) {
        try {
          const deleted = await this.userService.delFriend(dto.login, dto.target);
          return ({deleted})
        } 
        catch (error) {
          return { error: `you cant add this user`};
        }
    }

    @Post('blockUser')
    async blockUser(@Body() dto: AddFriendDto) {
        try {
         const blocked = await this.userService.blockUser(dto.login, dto.target);
         return ({blocked});
        } 
        catch (error) {
          return { error: `you cant block this user`};
        }
    }

    @Post('unblockUser')
    async unblockUser(@Body() dto: AddFriendDto) {
        try {
         const unblocked = await this.userService.unblockUser(dto.login, dto.target);
         return ({unblocked});
        } 
        catch (error) {
          return { error: `you cant block this user`};
        }
    }
    @Post('changeLogin')
    async changeLogin(@Req() req: any, @Body() dto: ChangeLoginDto ){
        try {
            const user = await this.userService.changeLogin(req.user.id, dto.newLogin);
            return ({user});
           } 
           catch (error) {
             return { error: `you cant change login`};
           }
    }

}
