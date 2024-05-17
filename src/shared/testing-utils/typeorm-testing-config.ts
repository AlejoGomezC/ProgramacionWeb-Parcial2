import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from 'D:/UniAndes/Octavo_Semestre/Web/Parcial2/Simulacro/my-simulacro-app/src/aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from 'D:/UniAndes/Octavo_Semestre/Web/Parcial2/Simulacro/my-simulacro-app/src/aerolinea/aerolinea.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [AerolineaEntity, AeropuertoEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity]),
];