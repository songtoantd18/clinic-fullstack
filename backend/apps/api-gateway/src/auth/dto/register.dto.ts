import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@app/database';

export class RegisterDto {
  @ApiProperty({ example: 'clinic@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, example: 'clinic' })
  @IsEnum(UserRole)
  role: UserRole;
}
