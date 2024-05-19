import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class ClubDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    fechaFundacion: Date;

    @IsNotEmpty()
    @IsUrl()
    imagen: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;
 
}
