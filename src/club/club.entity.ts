import { Column , Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';


@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fechaFundacion: Date;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    socios: ClubEntity[];

}
