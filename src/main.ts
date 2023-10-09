import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cors from 'cors';

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(express()));
    app.use(
        cors({
            origin: 'http://localhost:5173',
            credentials: true,
        }),
    );
    await app.listen(PORT, () => {
        console.log('Server started on port:', PORT);
    });
}
bootstrap();
