/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { QueriesApi, SiteEntry, SitePaging } from '@alfresco/js-api';
import { Store } from '@ngrx/store';
import { AppStore, UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Observable, from, Subject } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-library-metadata-form',
  templateUrl: './library-metadata-form.component.html'
})
export class LibraryMetadataFormComponent implements OnInit, OnChanges, OnDestroy {
  _queriesApi: QueriesApi;
  get queriesApi(): QueriesApi {
    this._queriesApi = this._queriesApi ?? new QueriesApi(this.alfrescoApiService.getInstance());
    return this._queriesApi;
  }

  @Input()
  node: SiteEntry;

  edit: boolean;
  libraryTitleExists = false;

  libraryType = [
    { value: 'PUBLIC', label: 'LIBRARY.VISIBILITY.PUBLIC' },
    { value: 'PRIVATE', label: 'LIBRARY.VISIBILITY.PRIVATE' },
    { value: 'MODERATED', label: 'LIBRARY.VISIBILITY.MODERATED' }
  ];

  form: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl({ value: '', disabled: true }),
    title: new UntypedFormControl({ value: '' }, [Validators.required, Validators.maxLength(256)]),
    description: new UntypedFormControl({ value: '' }, [Validators.maxLength(512)]),
    visibility: new UntypedFormControl(this.libraryType[0].value)
  });

  matcher = new InstantErrorStateMatcher();

  onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private alfrescoApiService: AlfrescoApiService, protected store: Store<AppStore>) {}

  get canUpdateLibrary() {
    return this.node && this.node.entry && this.node.entry.role === 'SiteManager';
  }

  getVisibilityLabel(value: string) {
    return this.libraryType.find((type) => type.value === value).label;
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  cancel() {
    this.updateForm(this.node);
    this.toggleEdit();
  }

  ngOnInit() {
    this.updateForm(this.node);

    this.form.controls['title'].valueChanges
      .pipe(
        debounceTime(300),
        mergeMap((title) => this.findLibraryByTitle(title)),
        takeUntil(this.onDestroy$)
      )
      .subscribe((result) => {
        const { entries } = result.list;

        if (entries.length) {
          if (this.form.controls.title.value === this.node.entry.title) {
            this.libraryTitleExists = false;
          } else {
            this.libraryTitleExists = this.form.controls.title.value === entries[0].entry.title;
          }
        } else {
          this.libraryTitleExists = false;
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnChanges() {
    this.updateForm(this.node);
  }

  update() {
    if (this.canUpdateLibrary && this.form.valid) {
      this.store.dispatch(new UpdateLibraryAction(this.form.value));
    }
  }

  private updateForm(node: SiteEntry) {
    const { entry } = node;

    this.form.setValue({
      id: entry.id,
      title: entry.title,
      description: entry.description || '',
      visibility: entry.visibility
    });
  }

  private findLibraryByTitle(libraryTitle: string): Observable<SitePaging | { list: { entries: any[] } }> {
    return from(
      this.queriesApi
        .findSites(libraryTitle, {
          maxItems: 1,
          fields: ['title']
        })
        .catch(() => ({ list: { entries: [] } }))
    );
  }
}
