import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException , BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubs"] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const Socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["clubs"] } );
        if (!Socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
   
        return Socio;
    }
    async create(socio: SocioEntity): Promise<SocioEntity> {

        if (socio.correoElectronico && !socio.correoElectronico.includes('@')) {
            throw new BusinessLogicException("The club email must contain an '@' character", BusinessError.PRECONDITION_FAILED);
        }
        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!persistedSocio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
        
        if (socio.correoElectronico && !socio.correoElectronico.includes('@')) {
            throw new BusinessLogicException("The club email must contain an '@' character", BusinessError.PRECONDITION_FAILED);
        }
        
        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.socioRepository.remove(socio);
    }    
    
}
