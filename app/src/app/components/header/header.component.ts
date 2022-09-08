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

import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppStore, getHeaderColor, getAppName, getLogoPath, getHeaderImagePath, getHeaderTextColor } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { takeUntil } from 'rxjs/operators';
import { AppConfigService } from '@alfresco/adf-core';
import { isContentServiceEnabled } from '@alfresco/aca-shared/rules';
import { ContentUrlService } from '../../services/content-url.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-header' }
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  createActions: any = [];
  actionUpload: any = [];
  searchBarExpanded = false;
  showSearchBar = true;
  actions = [];
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  @Output()
  toggleClicked = new EventEmitter();

  @Input() expandedSidenav = true;

  appName$: Observable<string>;
  headerColor$: Observable<any>;
  headerTextColor$: Observable<string>;
  logo$: Observable<string>;
  pageName;
  landingPage: string;
  buttonList;
  actionRef: ContentActionRef;
  actionRefUpload: ContentActionRef;

  constructor(store: Store<AppStore>, private appExtensions: AppExtensionService,
    private contentservce: ContentUrlService, private appConfigService: AppConfigService, private router: Router) {
    this.headerColor$ = store.select(getHeaderColor);
    this.headerTextColor$ = store.select(getHeaderTextColor);
    this.appName$ = store.select(getAppName);
    this.logo$ = store.select(getLogoPath);
    this.landingPage = this.appConfigService.get('landingPage', '/personal-files');

    store.select(getHeaderImagePath).subscribe((path) => {
      document.body.style.setProperty('--header-background-image', `url('${path}')`);
    });
  }
  

  ngOnInit() {
    this.contentservce.sendSidePageName.subscribe(data => {
      this.pageName = data.pageName;
    });

    this.getPageTitle();
    this.appExtensions
      .getHeaderActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.actions = actions;
      });

    this.buttonList = this.appConfigService.get('actions-list');

    this.headerTextColor$.subscribe((color) => {
      document.documentElement.style.setProperty('--adf-header-text-color', color);
    });
    
    this.appExtensions
      .getCreateActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((createActions) => {
        let data = [];
        data = createActions;
        this.createActions = data.filter((item)=>{
          return item.id == "app.create.library";
        });
        this.actionRef = Object.assign({},this.createActions);
        this.actionUpload = data.filter((item)=>{
          return item.id == "app.create.uploadFolder";
        });
        this.actionRefUpload = Object.assign({},this.actionUpload);
        console.log("header accc-->", this.createActions);
      });
  }

  runAction(data) {
    console.log("header accc refff-->", this.actionRef);
    if ((data == "create") && (this.router.url == '/favorite/libraries' || this.router.url == '/libraries')) {
      this.appExtensions.runActionById(this.actionRef[0].actions.click);
    } else if (data == "upload" && this.router.url == '/personal-files') {
        this.appExtensions.runActionById(this.actionRefUpload[0].actions.click);
    }
  }

  getPageTitle() {
    const url = this.router.url;
    switch (url) {
      case '/personal-files':
      case '/': {
        this.pageName = 'APP.BROWSE.PERSONAL.SIDENAV_LINK.LABEL';
        break;
      }
      case '/favorite/libraries': {
        this.pageName = 'APP.BROWSE.LIBRARIES.SIDENAV_LINK.LABEL';
        break;
      }
      case '/favorite/libraries': {
        this.pageName = 'APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.SIDENAV_LINK.LABEL';
        break;
      }
      case '/libraries': {
        this.pageName = 'APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.SIDENAV_LINK.LABEL';
        break;
      }
      case '/shared': {
        this.pageName = 'APP.BROWSE.SHARED.SIDENAV_LINK.LABEL';
        break;
      }
      case '/recent-files': {
        this.pageName = 'APP.BROWSE.RECENT.SIDENAV_LINK.LABEL';
        break;
      }
      case '/favorites': {
        this.pageName = 'APP.BROWSE.FAVORITES.SIDENAV_LINK.LABEL';
        break;
      }
      case '/trashcan': {
        this.pageName = 'APP.BROWSE.TRASHCAN.SIDENAV_LINK.LABEL';
        break;
      }
      default:
        break;
    }
  }

  isContentServiceEnabled(): boolean {
    return isContentServiceEnabled();
  }
  isSearchBarExpanded(value) {
    this.searchBarExpanded = value;
  }
  get isSmallScreen(): boolean {
    return false;
  }


  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
}
