import { Module } from '@nestjs/common';
import { AuthModule, ProductModule } from 'src/interface/http/modules';

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
