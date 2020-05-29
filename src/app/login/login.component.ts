import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import {Validators, FormControl, FormBuilder, FormGroup} from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    public snackBar : MatSnackBar,
    private route: ActivatedRoute, 
    private router: Router
    ) {}

  ref = firebase.firestore().collection('Admin');
  loginForm : FormGroup;
  isCardSpinnerVisible: any;
  isCardVisible: any;
  color = 'accent';
  breakpoint: any;
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      id:['',[
        Validators.required
      ]],
      password:['',[
        Validators.required
      ]]
    });
    this.isCardSpinnerVisible = false;
    this.isCardVisible = true;
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 2;
  }

  onCheckLogin(){
    this.isCardSpinnerVisible = true;
    this.isCardVisible = false;
    this.ref.get().then(snapshot =>{
      if(snapshot.empty)
      {
        console.log('No matching documents.');
        return;
      }
      snapshot.forEach(doc => {
        let data = doc.data();
        if(this.loginForm.get('id').value == data.id && this.loginForm.get('password').value == data.password){
          this.isCardSpinnerVisible = false;
          this.isCardVisible = true;
          this.router.navigate(['/admin-main-view',data.id]);
        }else{
          if(!this.loginForm.get('id').value || !this.loginForm.get('password').value)
          {
            this.isCardSpinnerVisible = false;
            this.isCardVisible = true;
            if(!this.loginForm.get('id').value)
            {
              this.loginForm.get('id').markAsTouched();
            }
            if(!this.loginForm.get('password').value)
            {
              this.loginForm.get('password').markAsTouched();
            }
          }else 
          {
            this.isCardSpinnerVisible = false;
            this.isCardVisible = true;
            this.loginForm.get('id').setErrors({
              invalid: true
            });
            this.loginForm.get('password').setErrors({
              invalid: true
            });
            this.snackBar.open("Invalid User", "", {
              duration: 2000
            });
          }
        }
      });
    }).catch(err => {
      console.log('Error getting document', err);
    });
  }

  clearField(){
    this.loginForm.get('id').setValue("");
    this.loginForm.get('password').setValue("");
  }

  get id(){
    return this.loginForm.get('id');
  }
  get password(){
    return this.loginForm.get('password');
  }

}
