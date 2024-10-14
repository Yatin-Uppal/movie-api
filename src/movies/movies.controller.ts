import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, UsePipes, ValidationPipe, Put, BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { CommonService } from 'src/common/common.service';
import { MulterError } from 'multer';

@ApiTags("Movies")
@Public()
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService,
    private commonService: CommonService
  ) {}

  @ApiOperation({summary: "Create a new Movie"})
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }), 
  )
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
        },
        title: {
          example: "Movie",
        },
        year: {
          example: "2012",
        }
      }
    }
  })
  async create(@UploadedFile() file, @Body() createMovieDto: CreateMovieDto) {
    const movie = await this.moviesService.create(file, createMovieDto);
    return this.commonService.customSuccessResponse(movie, "Movie successfully added!", 200)
  }

  @ApiOperation({summary: "Get all movies"})
  @Get()
  async findAll(@Query('page',) page: string, @Query('limit') limit: string, @Query('created_by') createdBy: string) {
    let list: any = await this.moviesService.findAll(+page, +limit, +createdBy);
    console.log(list)
    let promise = list.map((val) => {
      return new Promise(async (resolve) => {
        const signedUrl = await this.commonService.generatePresignedUrl(val.image_url)
        console.log(signedUrl)
        resolve({...val, image_url: signedUrl})
      })
    })
    promise = await Promise.all(promise);
    console.log(promise)
    const totalCount = await this.moviesService.findMeta(+createdBy);
    return this.commonService.customSuccessResponse({list: promise, meta: {totalCount, currentPage: page}}, "Movies successfully fetched!", 200)
  }

  @ApiOperation({summary: "Get a specific movie"})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(+id);
    if(!movie) {
      throw new BadRequestException("Movie not found")
    }
    const signedUrl = await this.commonService.generatePresignedUrl(movie.image_url)
    return this.commonService.customSuccessResponse({...movie, image_url: signedUrl}, "Movie successfully fetched!", 200)
  }

  @ApiOperation({summary: "Update a new Movie"})
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', 
  {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    }}
  ))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
        },
        title: {
          example: "Movie",
        },
        year: {
          example: "2012",
        }
      }
    }
  })
  @Put(':id')
  async update(@Param('id') id: string, @UploadedFile() file, @Body() updateMovieDto: UpdateMovieDto) {
    const updated = await this.moviesService.update(+id, file, updateMovieDto);
    if(!updated) {
      throw new BadRequestException("Movie not found or you're not authorized to update!")
    }
    return this.commonService.customSuccessResponse(updated, "Movie successfully updated!", 200)
  }
}
