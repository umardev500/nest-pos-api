import { Module } from '@nestjs/common';
import { ProductModule } from 'src/interface/http/modules';

@Module({
  imports: [ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
