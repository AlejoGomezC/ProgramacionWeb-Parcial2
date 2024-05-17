import { Column , Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from '../club/club.entity';


@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    correoElectronico: string;

    @Column()
    fechaNacimiento: Date;


    @ManyToMany(() => ClubEntity, club => club.socios)
    clubs: ClubEntity[];

}
