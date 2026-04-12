// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-info',
//   imports: [],
//   templateUrl: './edit-info.html',
//   styleUrl: './edit-info.scss',
// })
// export class EditInfo {

// }
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-edit-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [MessageService],
  templateUrl: './edit-info.html',
  styleUrls: ['./edit-info.scss']
})
export class EditInfoComponent implements OnInit {
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  userData: any = { firstName: '', lastName: '', email: '', phone: '', address: '' };
  private userId!: number;

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = this.userService.getUserId();
        this.userData = {
          firstName: user.firstName || user.FirstName || '',
          lastName: user.lastName || user.LastName || '',
          email: user.email || user.Email || user.UserName || '',
          phone: user.phone || user.Phone || '',
          address: user.address || user.Address || '',
          userName: user.userName || user.UserName || user.email || '',
          password: user.password || user.Password || ''
        };
      }
    });
  }

  onSave() {
    if (!this.userId) return;
    this.userService.updateUser(this.userId, this.userData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'נשמר', detail: 'הפרטים עודכנו בהצלחה' });
      },
      error: (err) => console.error("Update failed", err)
    });
  }
}
