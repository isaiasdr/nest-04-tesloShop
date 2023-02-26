import { Controller, Post, UploadedFile, UseInterceptors, BadGatewayException, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage( 
    @Res() res: Response,
    @Param('imageName') imageName: string 
  ) {

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path ) ;
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter,
    //limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadFile( @UploadedFile() file: Express.Multer.File ) {

    if ( !file )
      return new BadGatewayException('Make sure that the file is an image');

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return { secureUrl };
  }
}
