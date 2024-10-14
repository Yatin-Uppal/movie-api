import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/movie.entity';
import { CommonModule } from './common/common.module';
import { CommonService } from './common/common.service';

@Module({
  imports: [
    // env module
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    // DB module
    TypeOrmModule.forRootAsync({
      // @ts-ignore
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Movie],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MoviesModule,
    CommonModule
  ],
  controllers: [AppController],
  // services
  providers: [
    ConfigService,
    CommonService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
