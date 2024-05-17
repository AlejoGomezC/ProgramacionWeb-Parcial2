import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio/socio.entity';
import { ClubEntity } from './club/club.entity';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';

@Module({
  imports: [SocioEntity, ClubEntity,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2_db',
      entities: [SocioEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    SocioModule,
    ClubModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
