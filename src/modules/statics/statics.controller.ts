import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { join } from 'path';
import { Public } from 'src/common/decorators/is-public.decorator';
import { type Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Statics')
@Controller({ version: '1' })
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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('all-banks')
  allBanksPage(@Res() res: Response) {
    return res.sendFile(join(`${process.cwd()}/public/all-banks.html`));
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('icon')
  notFoundImage(@Res() res: Response) {
    return res.sendFile(
      join(
        `${process.cwd()}/public/icons/lab.png`,
      ),
    );
  }
}
