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
import { IdentityUserService } from '@alfresco/adf-core';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'adf-view-profile',
    templateUrl: './view-profile.component.html',
    styleUrls: ['./view-profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewProfileComponent implements OnInit, OnDestroy{

  profile_data=[
    {
      "FirstName" : "Darell",
      "LastName" : "Steward",
      "JobTitle" : "Administrator",
      "Location" : "02084536334",
      "Telephone" : "02084536334",
      "Mobile"   : "07984566738",
      "username" : "Darell Steward",
      "email"     : "dsteward@gmail.com",
      "company_email": "dsteward@alfrisco.com",
      "password"  : "********",
      "postcode"  : "KT1 2BW",
      "address"   : "14 Angus close, Surrey, London"
     }
  ];

  dropdown:boolean=true;
  dropdown_icon:boolean=true
  login_toggle:boolean=false;
  login_password:boolean=true;
  contact_toggle:boolean=true;
  contact_details:boolean=true;

  ngOnInit() {
    console.log(this.identityUserService.getCurrentUserInfo())
  }

  ngOnDestroy(): void {}
  constructor(private identityUserService: IdentityUserService) {
}

  generalDetails(){
    this.dropdown= !this.dropdown;
    this.dropdown_icon= !this.dropdown_icon
  }

  loginDetails(){
    this.login_toggle = !this.login_toggle;
    this.login_password = !this.login_password
  }

  companyDetails(){
    this.contact_details = !this.contact_details;
    this.contact_toggle = !this.contact_toggle;
  }
}
