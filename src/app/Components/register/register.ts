import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

import { UserService } from '../../Services/user-service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    InputTextModule, 
    PasswordModule, 
    ButtonModule, 
    FloatLabelModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'] 
})
export class Register {
  private userService = inject(UserService);
  private router = inject(Router);

  registerData = {
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    Phone: '',
    Address: '',
    Role: 'User'
  };

  onRegister() {
    // 1. ולידציה בסיסית
    if (!this.registerData.Email || !this.registerData.Password || !this.registerData.Phone) {
        alert('נא למלא את כל השדות, כולל טלפון וכתובת');
        return;
    }

    // 2. מיפוי האובייקט לשרת
    const userToRegister = {
      FirstName: this.registerData.FirstName,
      LastName: this.registerData.LastName,
      UserName: this.registerData.Email,
      Password: this.registerData.Password,
      Phone: this.registerData.Phone,
      Address: this.registerData.Address,
      Role: 'User'
    };
    
    // 3. שליחה לשרת
    this.userService.register(userToRegister).subscribe({
      next: (res: any) => {
        this.userService.saveUserToStorage(res);
        alert('נרשמת בהצלחה! ברוכים הבאים לפנדורה');
        
        // הניווט לעמוד הבית כפי שביקשת
        this.router.navigate(['/']); 
      },
      error: (err) => {
        alert(err.error || 'משהו השתבש בהרשמה');
      }
    });
  }
  }
