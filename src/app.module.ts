import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { ClsInterceptor } from 'src/common/interceptors';
import {
  AuthModule,
  ProductModule,
  UserModule,
} from 'src/interface/http/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductModule,
    AuthModule,
    UserModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  controllers: [],
  providers: [ClsInterceptor],
})
export class AppModule {}
