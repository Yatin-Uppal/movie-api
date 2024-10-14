import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Movie Apis')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // @ts-ignore
  const document = SwaggerModule.createDocument(app, config);
  // @ts-ignore
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
