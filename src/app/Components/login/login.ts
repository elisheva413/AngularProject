import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserService } from '../../Services/user-service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    InputTextModule, 
    PasswordModule, 
    ButtonModule, 
    FloatLabelModule,
    DividerModule,
    RadioButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  loginData = {
    email: '', // נשאר לצורך ה-HTML
    password: ''
  };

  userType: string = 'user';

  ngOnInit() {
    this.loginData = { email: '', password: '' };
  }

  onLogin() {
    // 1. ולידציה
    if (!this.loginData.email || !this.loginData.password) {
      alert('נא למלא אימייל וסיסמה');
      return;
    }

    const credentials = {
      userName: this.loginData.email,
      password: this.loginData.password
    };

    // 2. שליחה לשרת
    this.userService.login(credentials).subscribe({
      next: (res) => {
        if (!res) {
          alert('שגיאה בנתוני המשתמש');
          return;
        }

        this.userService.saveUserToStorage(res);

        // שליפת התפקיד מהתשובה של השרת
        const serverRole = (res?.Role || res?.role || "").toLowerCase().trim();

        if (serverRole === 'admin') {
          this.router.navigate(['/admin']); 
        } else {
          // --- ניווט חכם (התוספת שלך) ---
          // בודקים אם יש כתובת שחיכתה לנו ב-Storage (למשל /checkout)
          const returnUrl = localStorage.getItem('returnUrl') || '/';
          
          // מנקים את ה-Storage כדי שבפעם הבאה הוא לא ינווט לשם בטעות
          localStorage.removeItem('returnUrl'); 
          
          // ניווט ליעד המבוקש או לעמוד הבית כברירת מחדל
          this.router.navigate([returnUrl]); 
        }
      },
      error: (err) => {
        alert(err.status === 401 ? 'אימייל או סיסמה שגויים' : 'שגיאת שרת');
      }
    });
  }
}