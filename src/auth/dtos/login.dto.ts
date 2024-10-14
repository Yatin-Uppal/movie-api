import {
    IsNotEmpty,
    IsString,
    IsEmail
  } from 'class-validator';
  import {
    ApiProperty
  } from '@nestjs/swagger';

  // login dto object
export class LoginregisterDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example: "sample@yopmail.com"})
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "password"})
    password: string
}
