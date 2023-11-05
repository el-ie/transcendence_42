import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChangePasswordDto, ChannelCreaDto, ChannelJoinDto, DirectCreaDto, NameDto, SetAdminDto, UserloginDto, idDto } from './dto/channel.dto';
import { UserService } from 'src/user/user.service';
import { ChannelType } from '@prisma/client';
import { SocketGateway } from 'src/socket/socket.gateway';
import { ModuleRef } from '@nestjs/core';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Assurez-vous d'importer votre propre JwtAuthGuard

@Controller('channel')
// @UseGuards(JwtAuthGuard) // Vous pouvez appliquer votre propre stratégie d'authentification ici
export class ChannelController {
  constructor(private readonly channelService: ChannelService,
    private userService: UserService,
    private socketRef: ModuleRef) {}

  @Post('create')
  async createChannel(@Body() channelcreaDto: ChannelCreaDto) {
    try {
      const creatorId = await this.userService.getIdByLogin(channelcreaDto.creatorLogin);
      const channel = await this.channelService.createChannel(channelcreaDto.name, channelcreaDto.password, channelcreaDto.type, creatorId);
      return { channel };
    } catch (error) {
      return { error: `server cant create the channel`};
    }
  }

  @Post('createDirect')
  async createDirect(@Body() directcreaDto: DirectCreaDto) {
    try {
      
      const channelName = (directcreaDto.starterLogin > directcreaDto.targetLogin)? (directcreaDto.starterLogin + "-" + directcreaDto.targetLogin) : (directcreaDto.targetLogin + "-" + directcreaDto.starterLogin)
      const starterId = await this.userService.getIdByLogin(directcreaDto.starterLogin);
      const targetId = await this.userService.getIdByLogin(directcreaDto.targetLogin);
      if (starterId === targetId)
        throw new Error;
      const channel = await this.channelService.createChannel(channelName, "", directcreaDto.type, starterId);
      await this.channelService.joinChannel(channelName, targetId, "");
      return { channel };
    } catch (error) {
      return { error: "server cant create direct chat"};
    }
  }

  @Post('setPassword')
  async setPassword(@Body() dto: ChangePasswordDto) {
    const channelId = await this.channelService.getIdByName(dto.name);
    try {
      await this.channelService.setPassword(channelId, dto.password);
    }
    catch{
      return ({error: "server cant change password"});
    }
  }

  @Post('join')
  async joinChannel(@Body() channeljoinDto: ChannelJoinDto) {
    try {
      const joinerId = await this.userService.getIdByLogin(channeljoinDto.login);
      const channel = await this.channelService.joinChannel(channeljoinDto.name, joinerId, channeljoinDto.password);
      return { channel };
    } catch (error) {
      return { error: `you cant join this channel`};
    }
  }

  @Post('leave')
  async leaveChannel(@Body() channelLeaveDto: ChannelJoinDto) {
    try {
      const leaverId = await this.userService.getIdByLogin(channelLeaveDto.login);
      const channelId = await this.channelService.getIdByName(channelLeaveDto.name);
      await this.channelService.leaveChan(leaverId, channelId, channelLeaveDto.login);
    } catch (error) {
      return { error: `you cant leave this channel`};
    }
  }

  @Post('kick')
  async kickUser(@Body() channelLeaveDto: ChannelJoinDto) {
    try {
      const leaverId = await this.userService.getIdByLogin(channelLeaveDto.login);
      const channelId = await this.channelService.getIdByName(channelLeaveDto.name);
      await this.channelService.leaveChan(leaverId, channelId, channelLeaveDto.login);
      const username = await this.userService.getUsernameByLogin(channelLeaveDto.login);
      const socketService = this.socketRef.get(SocketGateway, { strict: false })
      socketService.sendEvent(channelLeaveDto.login, "kicked", null);
    } catch (error) {
      return { error: `you cant kicked this user`};
    }
  }

  @Post('ban')
  async banUser(@Body() channelLeaveDto: ChannelJoinDto) {
    try {
      const leaverId = await this.userService.getIdByLogin(channelLeaveDto.login);
      const channelId = await this.channelService.getIdByName(channelLeaveDto.name);
      await this.channelService.leaveChan(leaverId, channelId, channelLeaveDto.login);
      await this.channelService.banUser(channelId, leaverId)
      const socketService = this.socketRef.get(SocketGateway, { strict: false })
      socketService.sendEvent(channelLeaveDto.login, "kicked", null);
    } catch (error) {
      return { error: `you cant kicked this user`};
    }
  }

  @Post('invite')
  async inviteUser(@Body() inviteDto: ChannelJoinDto) {
    try {
      const invitedId = await this.userService.getIdByLogin(inviteDto.login);
      const channelId = await this.channelService.getIdByName(inviteDto.name);
      await this.channelService.inviteUser(channelId, invitedId)
      const socketService = this.socketRef.get(SocketGateway, { strict: false })
      // socketService.sendEvent(channelLeaveDto.login, "kicked", null);
    } catch (error) {
      return { error: `you cant invite this user`};
    }
  }

  @Post('mute')
  async MuteUser(@Body() channelLeaveDto: ChannelJoinDto) {
    try {
      const leaverId = await this.userService.getIdByLogin(channelLeaveDto.login);
      const channelId = await this.channelService.getIdByName(channelLeaveDto.name);
      await this.channelService.muteUser(leaverId, channelId);
    } catch (error) {
      return { error: `you cant kicked this user`};
    }
  }

  @Post('setAdmin')
  async setAdmin(@Body() dto: SetAdminDto) {
    try {
      const userId = await this.userService.getIdByLogin(dto.login);
      const channelId = await this.channelService.getIdByName(dto.name);
      await this.channelService.setNewAdmin(userId, channelId);
    } catch (error) {
      return { error: `you cant set this user as admin`};
    }
  }


  @Post('delete')
  async deleteChannel(@Body() nameDto: NameDto) {
    try {
      const channelId = await this.channelService.getIdByName(nameDto.name);
      await this.channelService.deleteChan(channelId);
    } catch (error) {
      return { error: `cant destroy this channel`};
    }
  }

  @Get()
  async getChannels () {
    try {
      const channels = await this.channelService.getChannels();
      return {channels} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des channels: ${error}`};
    }
  }

  @Get('mine')
  async getUserChannels (@Query('login') userlogin: string) {
    try {
      const userId = await this.userService.getIdByLogin(userlogin);
      const channels = await this.channelService.getUserChannels(userId);
      return {channels} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des channels: ${error}`};
    }
  }

  @Get('users')
  async getchannelUser (@Query('name') name: string) {
    try {
      const channelId = await this.channelService.getIdByName(name);
      const users = await this.channelService.getChannelUsers(channelId);
      return {users} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des users`};
    }
  }

  @Get('default')
  async getchanneldefault (@Query('name') name: string) {
    try {
      const channelId = await this.channelService.getIdByName(name);
      const users = await this.channelService.getChannelDefaultUsers(channelId);
      return {users} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des users`};
    }
  }

  @Get('all')
  async getchanneldefaultadmin (@Query('name') name: string) {
    try {
      const channelId = await this.channelService.getIdByName(name);
      const users = await this.channelService.getChannelDefaultAdminUsers(channelId);
      return {users} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des users`};
    }
  }



  @Get('direct')
  async getUserDirect (@Query('login') userlogin: string) {
    try {
      const userId = await this.userService.getIdByLogin(userlogin);
      const channels = await this.channelService.getUserDirect(userId);
      return {channels} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des directs: ${error}`};
    }
  }


  @Get('messages')
  async getChannelMessage (@Query('name') channelName: string) {
    try {
      const channelId = await this.channelService.getIdByName(channelName);
      const messages = await this.channelService.getChannelMessages(channelId);
      return {messages} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des messages: ${error}`};
    }
  }


  @Get('role')
  async getRole (@Query('name') channelName: string, @Query('login') login: string) {
    try {
      const channelId = await this.channelService.getIdByName(channelName);
      const userId = await this.userService.getIdByLogin(login);
      const role = await this.channelService.getChanRole(userId, channelId);
      return {role} ;

    }
    catch (error) {
      return { error: `Une erreur s\'est produite lors de la recupération des messages: ${error}`};
    }
  }
}