import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import * as firebase from 'firebase';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    public snackBar : MatSnackBar,
    private route: ActivatedRoute, 
    private router: Router
  ) { }
  
  ref = firebase.firestore().collection("Admin");
  profileForm: FormGroup;
  breakpoint: any;
  id: string;
  isPasswordField: any;
  key: string;
  oriPass: string;
  adminName: string;
  adminGender: string;
  isSpinnerVisible: any;
  isCardVisible: any;

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      adminId:'',
      name: ['',[
        Validators.required
      ]],
      age: ['',[
        Validators.required
      ]],
      email: ['',[
        Validators.required,
        Validators.email
      ]],
      gender: ['',[
        Validators.required
      ]],
      address: ['',[
        Validators.required
      ]],
      updatePassword:'',
      endable:'',
      oldpassword: ['',[
        Validators.required
      ]],
      newpassword: ['',[
        Validators.required
      ]],
      confrimPassword: ['',[
        Validators.required
      ]]
    });
    this.fieldDisable();
    this.isPasswordField = false;
    this.isSpinnerVisible = true;
    this.isCardVisible = false;
    this.route.paramMap.subscribe((params)=>{
      this.id = params.get('id');
    });
    this.ref.where("id","==",this.id).get().then(snap =>{
      snap.forEach( doc => {
        var data = doc.data();
        this.key = doc.id;
        this.profileForm.get("adminId").setValue(data.id);
        this.profileForm.get("name").setValue(data.name);
        this.profileForm.get("age").setValue(data.age);
        this.profileForm.get("email").setValue(data.email);
        this.profileForm.get("gender").setValue(data.gender);
        this.profileForm.get("address").setValue(data.address);
        this.oriPass = data.password;
        this.adminName = data.name;
        if(this.profileForm.get("gender").value == "Male"){
          this.adminGender = "assets/avatar.jpg";
        }else{
          this.adminGender = "assets/avatarFemale.jpg";
        }
        this.isSpinnerVisible = false;
        this.isCardVisible = true;
      });
    });
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 2;
  }

  onViewPassword(){
    if(this.profileForm.get("updatePassword").value == true){
      this.isPasswordField = false;
    }else{
      this.isPasswordField = true;
    }
  }

  onEnableField(){
    if(this.profileForm.get("endable").value == true){
      this.fieldEnable();
    }else{
      this.fieldDisable();
    }
  }

  fieldDisable(): void{
    this.profileForm.get("adminId").disable();
    this.profileForm.get("name").disable();
    this.profileForm.get("age").disable();
    this.profileForm.get("email").disable();
    this.profileForm.get("gender").disable();
    this.profileForm.get("address").disable();
    this.profileForm.get("oldpassword").disable();
    this.profileForm.get("newpassword").disable();
    this.profileForm.get("confrimPassword").disable();
    this.profileForm.get("updatePassword").disable();
  }

  fieldEnable(): void{
    this.profileForm.get("adminId").enable();
    this.profileForm.get("name").enable();
    this.profileForm.get("age").enable();
    this.profileForm.get("email").enable();
    this.profileForm.get("gender").enable();
    this.profileForm.get("address").enable();
    this.profileForm.get("oldpassword").enable();
    this.profileForm.get("newpassword").enable();
    this.profileForm.get("confrimPassword").enable();
    this.profileForm.get("updatePassword").enable();
  }

  checkValid(): boolean{
    if(this.profileForm.get("name").valid && this.profileForm.get("age").valid && this.profileForm.get("email").valid 
      && this.profileForm.get("gender").valid && this.profileForm.get("address").valid)
    {
      return true;
    }else{
      return false;
    }
  }

  onUpdateProfile(): void{
    var num = 0;
    if(this.profileForm.get("endable").value == true)
    {
      this.profileForm.get("adminId").markAsTouched();
      this.profileForm.get("name").markAsTouched();
      this.profileForm.get("age").markAsTouched();
      this.profileForm.get("email").markAsTouched();
      this.profileForm.get("gender").markAsTouched();
      this.profileForm.get("address").markAsTouched();
      this.profileForm.get("oldpassword").markAsTouched();
      this.profileForm.get("newpassword").markAsTouched();
      this.profileForm.get("confrimPassword").markAsTouched();

      if(this.checkValid() == true)
      {
        if(this.profileForm.get("updatePassword").value == true)
        {
          if(this.profileForm.get("oldpassword").value != this.oriPass)
          {
            num++;
            this.profileForm.get("oldpassword").setErrors({
              invalid: true
            });
          }else{
            if(this.profileForm.get("newpassword").value != this.profileForm.get("confrimPassword").value)
            {
              num++;
              this.profileForm.get("confrimPassword").setErrors({
                invalid: true
              });
            }else{
              this.ref.doc(this.key).update({password: this.profileForm.get("confrimPassword").value});
            }
          }
        }
        if(num == 0)
        {
          this.ref.doc(this.key).update({name: this.profileForm.get("name").value});
          this.ref.doc(this.key).update({age: this.profileForm.get("age").value});
          this.ref.doc(this.key).update({email: this.profileForm.get("email").value});
          this.ref.doc(this.key).update({gender: this.profileForm.get("gender").value});
          this.ref.doc(this.key).update({address: this.profileForm.get("address").value});

          this.snackBar.open("Succesfully Updated","",{
            duration: 2000
          });
          this.fieldDisable();
          this.profileForm.get("endable").setValue(false);
          this.adminName = this.profileForm.get("name").value;
          if(this.profileForm.get("gender").value == "Male"){
            this.adminGender = "assets/avatar.jpg";
          }else{
            this.adminGender = "assets/avatarFemale.jpg";
          }
        }
      }
    }else{
        this.snackBar.open("Please enable to update","",{
          duration: 2000
        });
    }
  }

  goBack(): void{
    this.router.navigate(['/login']);
  }

  get name(){
    return this.profileForm.get('name');
  }

  get age(){
    return this.profileForm.get('age');
  }

  get email(){
    return this.profileForm.get('email');
  }

  get gender(){
    return this.profileForm.get('gender');
  }

  get address(){
    return this.profileForm.get('address');
  }

  get oldpassword(){
    return this.profileForm.get('oldpassword');
  }

  get newpassword(){
    return this.profileForm.get('newpassword');
  }

  get confrimPassword(){
    return this.profileForm.get('confrimPassword');
  }
}
