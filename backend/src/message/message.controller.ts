// import { Controller, Post, Body, Get } from '@nestjs/common';
// import { MessageService } from './message.service';
// import { NewMessageDto } from './dto/message.dto';
// // import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Assurez-vous d'importer votre propre JwtAuthGuard

// @Controller('message')
// // @UseGuards(JwtAuthGuard) // Vous pouvez appliquer votre propre stratégie d'authentification ici
// export class MessageController {
//   constructor(private readonly channelService: MessageService) {}

//   @Post('new')
//   async createMessage(@Body() newmessageDto: NewMessageDto) {
//     try {
//       const message = await this.channelService.createMessage(newmessageDto.content, Number(newmessageDto.senderId),  Number(newmessageDto.channelId));
//       return { message };
//     } catch (error) {
//       return { error: `Une erreur s\'est produite lors de la création du message: ${error}`};
//     }
//   }


//   @Get()
//   async getChannels () {
//     try {
//       const channels = await this.channelService.getChannels();
//       return {channels} ;

//     }
//     catch (error) {
//       return { error: `Une erreur s\'est produite lors de la recupération des channels: ${error}`};
//     }
//   }
// }