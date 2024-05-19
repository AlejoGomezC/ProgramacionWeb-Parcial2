import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity'
import { SocioEntity } from '../socio/socio.entity'
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';


describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];
  let clubsList: ClubEntity[];
  let club: ClubEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();
 
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombre: faker.company.name(),
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.past(),
      })
      sociosList.push(socio);
    }

    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await clubRepository.save({
        nombre: faker.company.name(),
        fechaFundacion: faker.date.past(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence()
      })
      clubsList.push(club);
    }
 
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addMemberToClub should add a socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.person.fullName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    });
  
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    });
  
    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);
    
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(newSocio.nombre);
    expect(result.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
    expect(result.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);
  });
  
  it('addMemberToClub should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    });
  
    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });
  
  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.person.fullName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    });
  
    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
  



  it('findMemberFromClub should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id);
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toBe(socio.nombre);
    expect(storedSocio.correoElectronico).toBe(socio.correoElectronico);
    expect(storedSocio.fechaNacimiento).toBe(socio.fechaNacimiento);
  });
  
  it('findMemberFromClub should throw an exception for an invalid socio', async () => {
    await expect(() => service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });
  
  it('findMemberFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
  
  it('findMemberFromClub should throw an exception for a socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.person.fullName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    });
  
    await expect(() => service.findMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");
  });


  it('findMembersFromClub should return socios by club', async () => {
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5);
  });
  
  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(() => service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
  


  it('updateMembersFromClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.person.fullName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    });
  
    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);
  
    expect(updatedClub.socios[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
    expect(updatedClub.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);
  });
  
  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.person.fullName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    });
  
    await expect(() => service.updateMembersFromClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
  
  it('updateMembersFromClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";
  
    await expect(() => service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });
  

  it('deleteSocioFromClub should remove a socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteSocioFromClub(club.id, socio.id);
  
    const storedClub: ClubEntity = await clubRepository.findOne({ where: { id: club.id }, relations: ["socios"] });
    const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);
  
    expect(deletedSocio).toBeUndefined();
  });
  
  it('deleteSocioFromClub should throw an exception for an invalid socio', async () => {
    await expect(() => service.deleteSocioFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });
  
  it('deleteSocioFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.deleteSocioFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
  
  it('deleteSocioFromClub should throw an exception for a socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.person.fullName(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    });
  
    await expect(() => service.deleteSocioFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");
  });
  
  


});
