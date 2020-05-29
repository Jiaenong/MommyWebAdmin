import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as firebase from 'firebase';

@Component({
  selector: 'app-manage-handbook',
  templateUrl: './manage-handbook.component.html',
  styleUrls: ['./manage-handbook.component.css']
})
export class ManageHandbookComponent implements OnInit {

  ref = firebase.firestore().collection('Guideline');
  ref2 = firebase.firestore().collection('Admin');
  isSpinnerVisible: any;
  isCardVisible: any;
  key: any;
  id: string;
  name: string;
  updatedDate: Date;

  constructor(
    private fb : FormBuilder,
    private route: ActivatedRoute, 
    public snackBar : MatSnackBar,
    private router: Router
  ) { }

  handbookForm : FormGroup;
  oriContent : string;

  ngOnInit(): void {
    this.handbookForm = this.fb.group({
      guideline: ['',[
        Validators.required
      ]],
      enableEdit:''
    });

    this.route.paramMap.subscribe((params)=>{
      this.id = params.get('id');
      console.log(this.id);
    });

    this.isSpinnerVisible = true;
    this.isCardVisible = false;
    this.ref.get().then(snap => {
      snap.forEach(doc =>{
        this.key = doc.id;
        var data = doc.data();
        this.handbookForm.get("guideline").setValue(data.content);
        this.oriContent = this.handbookForm.get("guideline").value;
        this.handbookForm.get("guideline").disable();
        this.isSpinnerVisible = false;
        this.isCardVisible = true;
      });
    }).catch(error=>{
      console.log("Error",error);
    });

    this.ref2.where("id", "==", this.id).get().then(snap => {
      snap.forEach(doc => {
        var data = doc.data();
        this.name = data.name;
      })
    }).catch(error =>{
      console.log("Error", error);
    })
  }

  onEndableEdit(): boolean{
    if(this.handbookForm.get("enableEdit").value == true){
      this.handbookForm.get("guideline").enable();
      return true;
    }else{
      this.handbookForm.get("guideline").disable();
      return false;
    }
  }

  onUpdateContent(){
    var todayDate = new Date();
    if(this.onEndableEdit() == true)
    {
      if(this.handbookForm.valid){
        this.oriContent = this.handbookForm.get("guideline").value;
        this.ref.doc(this.key).update({content: this.handbookForm.get("guideline").value});
        this.ref.doc(this.key).update({updatedID: this.id});
        this.ref.doc(this.key).update({updatedBy: this.name});
        this.ref.doc(this.key).update({updatedDate: todayDate});
        this.snackBar.open("Successfully Updated","",{
          duration: 2000
        });
        this.handbookForm.get("guideline").disable();
        this.handbookForm.get("enableEdit").setValue(false);
      }else{
        this.snackBar.open("The guideline cannot left empty","",{
          duration: 2000
        });
      }
    }else{
      this.snackBar.open("Please enable to perform further update","",{
        duration: 2000
      });
    }
  }

  onUndoContent(){
    this.handbookForm.get("guideline").setValue(this.oriContent);
  }

  goBack(): void{
    this.router.navigate(['/login']);
  }

}
