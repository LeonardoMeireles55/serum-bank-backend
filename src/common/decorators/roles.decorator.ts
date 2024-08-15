import { SetMetadata } from '@nestjs/common';
import { AccessEnum } from 'src/common/constants/acess.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccessEnum[]) => SetMetadata(ROLES_KEY, roles);
