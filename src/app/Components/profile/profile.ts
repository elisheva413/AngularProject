import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  
  isAdmin: boolean = false;

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.isAdmin = this.userService.isAdmin();
      }
    });
  }
}