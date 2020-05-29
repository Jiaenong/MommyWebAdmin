import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    public snackBar : MatSnackBar,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ref = firebase.firestore().collection('MedicalPersonnel');

  key: any;
  editForm: FormGroup;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name:['',[
        Validators.required
      ]],
      email:['',[
        Validators.required,
        Validators.email
      ]],
      ic:['',[
        Validators.required
      ]],
      address:['',[
        Validators.required
      ]],
      personnelType:['',[
        Validators.required
      ]]
    });
    this.editForm.get('name').setValue(this.data.name);
    this.editForm.get('email').setValue(this.data.email);
    this.editForm.get('ic').setValue(this.data.IC);
    this.editForm.get('address').setValue(this.data.address);
    this.editForm.get('personnelType').setValue(this.data.type);
    
    this.ref.where('medicalPersonnelId', '==', this.data.medicalPersonnelId).get().then(snapshot => {
      snapshot.forEach(doc => {
        this.key = doc.id;
      })
    }).catch(err =>{
      console.log("Error getting record", err);
    });
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

  updateRecord(): void{
    if(this.editForm.valid)
    {
      this.ref.doc(this.key).update({name: this.editForm.get('name').value});
      this.ref.doc(this.key).update({email: this.editForm.get('email').value});
      this.ref.doc(this.key).update({IC: this.editForm.get('ic').value});
      this.ref.doc(this.key).update({address: this.editForm.get('address').value});
      this.ref.doc(this.key).update({type: this.editForm.get('personnelType').value});
      this.snackBar.open("Succesfully Updated","",{
        duration: 2000
      });
      this.onNoClick();
    }
  }

  get name(){
    return this.editForm.get('name');
  }
  get email(){
    return this.editForm.get('email');
  }
  get ic(){
    return this.editForm.get('ic');
  }
  get address(){
    return this.editForm.get('address');
  }
  get personnelType(){
    return this.editForm.get('personnelType');
  }

}
