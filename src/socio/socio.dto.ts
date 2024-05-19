import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class SocioDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    correoElectronico: string;

    @IsNotEmpty()
    fechaNacimiento: Date;


}