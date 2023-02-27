import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, shareReplay, take, tap } from 'rxjs';
import { Hero } from '../models/hero';

const DATA_URL = 'http://localhost:3000/heroes';

@Injectable({
  providedIn: 'any',
})
export class HeroService {
  private heroSubject = new BehaviorSubject<Hero[]>([]);
  public heroes$ = this.heroSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initData();
  }

  initData(): void {
    this.http
      .get<Hero[]>(DATA_URL)
      .pipe(take(1), shareReplay())
      .subscribe((heroes: Hero[]) => {
        this.heroSubject.next(heroes);
      });
  }

  saveNewHero(hero: Hero) {
    this.http
      .post(DATA_URL, hero)
      .pipe(take(1))
      .subscribe(() => {
        this.initData();
      });
  }

  updateHero(hero: Hero) {
    this.http
      .put(`${DATA_URL}/${hero.id}`, hero)
      .pipe(take(1))
      .subscribe(() => {
        this.initData();
      });
  }

  deleteHero(hero: Hero) {
    this.http
      .delete(`${DATA_URL}/${hero.id}`)
      .pipe(take(1))
      .subscribe(() => {
        this.initData();
      });
  }

  filterHeroesByName(searchText: string): Observable<Hero[]> {
    const searchTextQuery =
      searchText === '' ? '' : `?nameLabel_like=${searchText}`;
    return this.http.get<Hero[]>(`${DATA_URL}${searchTextQuery}`).pipe(
      take(1),
      tap((heroes) => this.heroSubject.next(heroes))
    );
  }
}
