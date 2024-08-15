import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/authentication/guards/role.guard';
import { PartialUserDto } from '../dtos/partial-user-dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<PartialUserDto> {
    return this.userService.createUser(createUserDto);
  }
}
