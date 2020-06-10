import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Location } from '@angular/common';
import * as firebase from 'firebase';
import { MedicalPersonnel } from '../MedicalPersonnel';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.css']
})

export class AdminMainViewComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    public snackBar : MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute, 
    private router: Router,
    private location: Location
    ) { }

  ref = firebase.firestore().collection('MedicalPersonnel');
  createForm : FormGroup;
  medicapPersonnel: MedicalPersonnel;
  medicalPersonnelId: string;
  medicalNum: number;
  isSpinnerVisible: any;
  color = 'accent';
  id : string;

  medicalPersonnel: MedicalPersonnel;
  dataSource = new MatTableDataSource<MedicalPersonnel>();
  displayedColumns: string[] = ['medicalPersonnelId', 'name', 'IC', 'email', 'address', 'type', 'edit'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    //Section Create Personnel
    this.createForm = this.fb.group({
      name:['',[
        Validators.required
      ]],
      ic:['',[
        Validators.required
      ]],
      email:['',[
        Validators.required,
        Validators.email
      ]],
      address:['',[
        Validators.required
      ]],
      password:['',[
        Validators.required
      ]],
      confrimPassword:['',[
        Validators.required
      ]],
      personnelType:['',[
        Validators.required
      ]]
    });
    this.route.paramMap.subscribe((params)=>{
      this.id = params.get('id');
      console.log("user: "+params);
    });
    this.createForm.get('personnelType').setValue("nurse");
    this.ref.orderBy("medicalNum").get().then(snapshot => {
      if(snapshot.empty)
      {
        this.medicalPersonnelId = "MP"+1;
        this.medicalNum= 1;
      }else{
        snapshot.forEach(doc => {
          var data = doc.data();
          var num = Number(data.medicalPersonnelId.substring(2));
          num++;
          this.medicalPersonnelId = "MP"+num;
          this.medicalNum = ++data.medicalNum;
        });
      }
      console.log(this.medicalPersonnelId+" "+this.medicalNum)
    }).catch(err => {
      console.log("Error", err);
    });

    //Section Personnel List
    var record = [];
    this.isSpinnerVisible = true;
    this.ref.orderBy("medicalNum","asc").onSnapshot(snapshot => {
      record = [];
      snapshot.forEach(doc =>{
        var data = doc.data();
        this.medicalPersonnel = {
          medicalPersonnelId: data.medicalPersonnelId,
          name: data.name,
          IC: data.IC,
          email: data.email,
          address: data.address,
          type: data.type,
          ImageUrl: data.ImageUrl,
          medicalNum: data.medicalNum,
          password: data.password
        }
        record.push(this.medicalPersonnel);
      })
      this.dataSource = new MatTableDataSource<MedicalPersonnel>(record);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isSpinnerVisible = false;
    },err =>{
      console.log("Error getting record", err);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSaveRecord(){
    this.createForm.get('name').markAsTouched();
    this.createForm.get('ic').markAsTouched();
    this.createForm.get('email').markAsTouched();
    this.createForm.get('address').markAsTouched();
    this.createForm.get('password').markAsTouched();
    this.createForm.get('confrimPassword').markAsTouched();
    this.createForm.get('personnelType').markAsTouched();
    var data ={
        IC: this.createForm.get('ic').value,
        ImageUrl: '',
        address: this.createForm.get('address').value,
        email: this.createForm.get('email').value,
        medicalPersonnelId: this.medicalPersonnelId,
        medicalNum: this.medicalNum,
        name: this.createForm.get('name').value,
        password: this.createForm.get('confrimPassword').value,
        type: this.createForm.get('personnelType').value
    }
    if(this.createForm.get('confrimPassword').value != this.createForm.get('password').value)
    {
      this.createForm.get('confrimPassword').setErrors({
        invalid: true
      });
      this.snackBar.open("Confirm Password must be same with Password","",{
        duration: 2000
      });
    }else if(this.createForm.invalid)
    {
      this.snackBar.open("All field must be fill in","",{
        duration: 2000
      });
    }else{
      this.ref.add(data).then(ref => {
        var num = Number(this.medicalPersonnelId.substring(2));
        num++;
        this.medicalPersonnelId = "MP"+num;
        this.medicalNum++;
        console.log(this.medicalPersonnelId +" "+ this.medicalNum);
        this.snackBar.open("Successfully create new record","",{
          duration: 2000
        });
        window.location.reload();
      }).catch(err => {
        console.log("Error Add document", err);
      });
    }
  }

  onClearField(){
    this.createForm.get('name').setValue("");
    this.createForm.get('email').setValue("");
    this.createForm.get('password').setValue("");
    this.createForm.get('ic').setValue("");
    this.createForm.get('address').setValue("");
    this.createForm.get('confrimPassword').setValue("");
  }

  openDialog(data): void{
    const dialogRef = this.dialog.open(EditDialogComponent,{
      width: '350px',
      data: data
    });
  }

  goBack(): void{
    this.router.navigate(['/login']);
  }

  get name(){
    return this.createForm.get('name');
  }
  get email(){
    return this.createForm.get('email');
  }
  get ic(){
    return this.createForm.get('ic');
  }
  get address(){
    return this.createForm.get('address');
  }
  get personnelType(){
    return this.createForm.get('personnelType');
  } 
  get confrimPassword(){
    return this.createForm.get('confrimPassword');
  }
  get password(){
    return this.createForm.get('password');
  }

}
