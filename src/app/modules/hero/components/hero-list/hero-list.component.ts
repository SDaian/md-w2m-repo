import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';

import { Action, Gender, Hero, ModalObject } from '../../models/hero';
import { HeroDialogComponent } from '../hero-dialog/hero-dialog.component';
import { HeroService } from '../../services/hero.service';

const columns: string[] = [
  'nameLabel',
  'genderLabel',
  'citizenshipLabel',
  'occupationLabel',
  'actions',
];

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
})
export class HeroListComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  private heroes$ = this.heroService.heroes$;

  searchHeroFilter = new FormControl();
  dataSource = new MatTableDataSource<Hero>();
  displayedColumns = columns;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private heroService: HeroService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.heroes$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((heroes: Hero[]) => {
        this.dataSource.data = heroes;
        this.dataSource.paginator = this.paginator;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.searchHeroFilter.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => {
          const searchText =
            this.searchHeroFilter.value === null
              ? ''
              : this.searchHeroFilter.value;
          return this.heroService.filterHeroesByName(searchText);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((heroes: Hero[]) => {
        this.dataSource.data = heroes;
        this.dataSource.paginator = this.paginator;
      });
  }

  editHero(hero: Hero): void {
    this.openHeroDialog(hero, Action.UPDATE);
  }

  deleteHero(hero: Hero): void {
    this.openHeroDialog(hero, Action.DELETE);
  }

  openHeroDialog(hero: Hero, action: string) {
    const dialogRef = this.dialog.open(HeroDialogComponent, {
      width: '350px',
      data: { hero, action },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: ModalObject) => {
        if (result.action) {
          const { hero, action } = result;
          switch (action) {
            case Action.CREATE:
              this.heroService.saveNewHero(hero);
              break;
            case Action.UPDATE:
              this.heroService.updateHero(hero);
              break;
            case Action.DELETE:
              this.heroService.deleteHero(hero);
              break;
            default:
              break;
          }
        }
      });
  }

  createHero(): void {
    const hero: Hero = {
      nameLabel: '',
      genderLabel: Gender.FEMALE,
      citizenshipLabel: '',
      occupationLabel: '',
    };
    this.openHeroDialog(hero, Action.CREATE);
  }
}
