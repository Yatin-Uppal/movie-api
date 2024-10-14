import { Inject, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CommonService } from 'src/common/common.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private commonService: CommonService,
    @Inject(REQUEST) private readonly request: Request
  ) {}
  async create(file: any, createMovieDto: CreateMovieDto) {
    const fileUploadRes = await this.commonService.uploadFile(file);
    // @ts-ignore
    return this.movieRepository.insert({...createMovieDto, image_url: fileUploadRes, created_by: this.request.user.id})
  }

  findMeta(created_by: number = 0) {
    // find all count
    return this.movieRepository.count({
      ...(created_by ? {where: {
        created_by
      }} : null) 
    })
  }

  findAll(page: number = 1, limit: number = 10, created_by: number = 0) {
    return this.movieRepository.find({
      skip: (+page - 1) * +limit,
      take: +limit,
      ...(created_by ? {where: {
        created_by
      }} : null)
    })
  }

  findOne(id: number) {
    // get user by id
    return this.movieRepository.findOneBy({ id });
  }

  async update(id: number, file, info: Partial<Movie>) {
    // check if the record exists
    const theOne = await this.movieRepository.findOne({
      // @ts-ignore
      where: {id, created_by: this.request.user.id}
    });
    if(!theOne) {
      return null;
    }
    let fileUploadRes = null
    if(file) {
      fileUploadRes = await this.commonService.uploadFile(file);
      info.image_url = fileUploadRes
    }
    return this.movieRepository.update(id, info);
  }
}
