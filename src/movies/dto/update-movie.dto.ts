import {
    IsOptional,
    IsString,
  } from 'class-validator';
  import {
    ApiProperty
  } from '@nestjs/swagger';

export class UpdateMovieDto {

    @IsString()
    @IsOptional()
    @ApiProperty({example: "My movie"})
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: "2012"})
    year: number
}
