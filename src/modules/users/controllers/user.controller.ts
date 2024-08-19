import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/authentication/guards/role.guard';
import { PartialUserDto } from '../dtos/partial-user-dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { AccessEnum } from '../enums/acess.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @ApiBody({ type: CreateUserDto })
  @Post('users')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<DefaultResponseDto> {
    const response = this.userService.createUser(createUserDto);

    return new DefaultResponseDto(response, 'User created successfully', true);
  }

  @HttpCode(HttpStatus.OK)
  @Put('users')
  @Roles(AccessEnum.CLIENT, AccessEnum.ADMIN)
  async updateUserById(
    @Body() userDto: UpdateUserDto,
    @Request() req?,
  ): Promise<DefaultResponseDto> {
    const id = req.user.id;
    try {
      const user = await this.userService.updateUser(id, userDto);

      const userResponse = user.mapToPartialUserDto();

      return new DefaultResponseDto(
        userResponse,
        'User update successfully',
        true,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
