import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), CommonModule],
  controllers: [MoviesController],
  providers: [MoviesService, CommonService],
})
export class MoviesModule {}
