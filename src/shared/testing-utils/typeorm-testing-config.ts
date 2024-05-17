import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity'; 
import { ClubEntity } from 'src/club/club.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [SocioEntity, ClubEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([SocioEntity, ClubEntity]),
];