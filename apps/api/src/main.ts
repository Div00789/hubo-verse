import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('HuboVerse Enterprise API Gateway')
    .setDescription('OpenAPI specification for HubSpot Integrations, Anna AI Engine, and Tenant Management.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT_API || 4000;
  await app.listen(port);
  console.log(`HuboVerse NestJS API running on: http://localhost:${port}/api/docs`);
}
bootstrap();
