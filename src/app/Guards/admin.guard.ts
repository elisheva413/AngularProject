import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../Services/user-service'; 

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // בודק אם יש משתמש מחובר והוא אדמין (לפי הלוגיקה המושלמת שכבר כתבת בשירות)
  if (userService.isAdmin()) {
    return true; // פותח את הדלת - הגישה מאושרת!
  } else {
    // מזהה ניסיון פריצה או סתם משתמש רגיל - זורק אותו לעמוד הבית
    router.navigate(['/']); 
    return false;
  }
};