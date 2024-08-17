import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { join } from 'path';
import { Public } from 'src/common/decorators/is-public.decorator';
import { type Response } from 'express';

@Controller('statics')
export class StaticsController {
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('home')
  homePage(@Res() res: Response) {
    return res.sendFile(join(`${process.cwd()}/public/index.html`));
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('search')
  searchPage(@Res() res: Response) {
    return res.sendFile(join(`${process.cwd()}/public/search.html`));
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('transaction')
  transactionPage(@Res() res: Response) {
    return res.sendFile(join(`${process.cwd()}/public/transaction.html`));
  }
}
