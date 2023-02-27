import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Gender, Hero } from '../models/hero';
import { HeroService } from './hero.service';

const mockHeroes = [
  {
    id: 1,
    nameLabel: 'Superman',
    genderLabel: Gender.MALE,
    citizenshipLabel: 'United States of America',
    occupationLabel: 'psychologi2'
  },
  {
    id: 2,
    nameLabel: 'Batman',
    genderLabel: Gender.MALE,
    citizenshipLabel: 'United States of America',
    occupationLabel: 'psychologi2'
  }
];

describe('HeroService', () => {
  let heroService: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService]
    });

    heroService = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(heroService).toBeTruthy();
    const req = httpMock.expectOne('http://localhost:3000/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  describe('initData', () => {
    it('should retrieve heroes from the API and update the heroes$ observable', () => {

      const oldReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(oldReq.request.method).toBe('GET');

      oldReq.flush(mockHeroes);
      heroService.initData();

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.method).toBe('GET');

      req.flush(mockHeroes);
    });
  });

  describe('saveNewHero', () => {
    it('should add a new hero to the API and update the heroes$ observable', () => {
      const newHero = {
        nameLabel: 'Wonder Woman',
        genderLabel: Gender.FEMALE,
        citizenshipLabel: 'United States of America',
        occupationLabel: 'psychologi2'
      };

      const oldReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(oldReq.request.method).toBe('GET');

      oldReq.flush(mockHeroes);

      heroService.saveNewHero(newHero);

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newHero);

      req.flush({});

      const newReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(newReq.request.method).toBe('GET');

      newReq.flush(mockHeroes);
    });
  });

  describe('updateHero', () => {
    it('should update an existing hero in the API and update the heroes$ observable', () => {
      const updatedHero = {
        id: 2,
        nameLabel: 'The Dark Knight',
        genderLabel: Gender.MALE,
        citizenshipLabel: 'United States of America',
        occupationLabel: 'Artist'
      };

      const oldReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(oldReq.request.method).toBe('GET');

      oldReq.flush(mockHeroes);

      heroService.updateHero(updatedHero);

      const req = httpMock.expectOne('http://localhost:3000/heroes/2');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedHero);

      req.flush(null);

      const newReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(newReq.request.method).toBe('GET');

      newReq.flush(mockHeroes);
    });
  });

  describe('deleteHero', () => {
    it('should delete an existing hero from the API and update the heroes$ observable', () => {
      const heroToDelete = {
        id: 1,
        nameLabel: 'Superman',
        genderLabel: Gender.MALE,
        citizenshipLabel: 'United States of America',
        occupationLabel: 'Artist'
      };

      const oldReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(oldReq.request.method).toBe('GET');

      oldReq.flush(mockHeroes);

      heroService.deleteHero(heroToDelete);

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('DELETE');

      req.flush(null);
      const newReq = httpMock.expectOne('http://localhost:3000/heroes');
      expect(newReq.request.method).toBe('GET');

      newReq.flush(mockHeroes);
    });
  });

  it('should filter heroes by name via GET', () => {
    const searchText = 'hero';
    const filteredHeroes: Hero[] = [
      {
        id: 1,
        nameLabel: 'Hero 1',
        genderLabel: Gender.MALE,
        citizenshipLabel: 'United States of America',
        occupationLabel: 'Artist'
      },
      {
        id: 2,
        nameLabel: 'Hero 2',
        genderLabel: Gender.MALE,
        citizenshipLabel: 'United States of America',
        occupationLabel: 'Artist'
      }
    ];

    heroService.filterHeroesByName(searchText).subscribe((heroes) => {
      expect(heroes).toEqual(filteredHeroes);
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes?nameLabel_like=${searchText}`);
    expect(req.request.method).toBe('GET');
    req.flush(filteredHeroes);

    const newReq = httpMock.expectOne('http://localhost:3000/heroes');
    expect(newReq.request.method).toBe('GET');

    newReq.flush(mockHeroes);
  });
});
