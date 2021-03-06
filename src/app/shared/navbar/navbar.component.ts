import { AppRoutingModule } from './../../app-routing.module';
import { Component, OnInit, Input, Output,EventEmitter, NgModule } from '@angular/core';
import { LogInHttpService } from 'src/app/log-in/log-in-http.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { notifications } from 'src/app/classes/notifications';
import { navBarService } from "./navbar.service";
import { data } from 'src/app/classes/data';
import { CommonModule } from '@angular/common';
import { Observable, interval, Subscription } from 'rxjs';
import { map, switchMap, timeout } from 'rxjs/operators';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  /**
        * array of notifications
        */
  public notifss: notifications[] = [];
  
  private notifSubscription: Subscription;
   
  constructor(private service:LogInHttpService,private route: ActivatedRoute,private router: Router,private modalService: NgbModal,private httpser:navBarService) { 
   /**
        *for push notifications
        */
    this.notifSubscription = httpser.
    getnotifItems()
    .subscribe((data: notifications) => {
      this.notifss.push(data);
    });

  }
  notifs :notifications[];
 users:any;
 id1:number;
 isUser:boolean=true;
 notifsnb:number=0;

  ngOnInit() {
    /**
        * if there is no token enable guest mode
        */
    if(localStorage.getItem('token')== null){
      this.isUser=false

    }else{this.isUser=true ;
      this.users=JSON.parse(localStorage.getItem('user')) ;
      this.id1=this.users.userInfo.id ;
    }
 /**
        * call notifications service 
        */
   setTimeout(()=>{this.httpser.getNotifications().subscribe(
      data =>{
        this.notifs=data ;
        this.loaddata();
      console.log(data);
      }
    ),1000});

   
  }/**
        * mark notification to be read
        */
  onReadd(nb:number){
    this.httpser.onRead(nb);
    console.log(nb);
  }

  
  /**stores any error message recived  */
  error :any;
  searchTerm:string;
  @Output() clickBtn = new EventEmitter();
  /**On clicking the logout button it sends a request to the server to logout the user and if the response it gets from the server is positive it removes the token from the storage and redirects the user to the login page */
  onLogout()
    {
 
      this.service.logOut().subscribe(
        res=>{localStorage.removeItem('token');
        this.router.navigate(['/login']);
        localStorage.clear();
        
        },err => {
          if(err.status ==405)
          {
          
           localStorage.removeItem('token');
           localStorage.clear();
            this.router.navigate(['/login']);
            console.log(err);
          }
          
          else
          console.log(err);
        })
      
    }
/**
        * function search responsible for searching boooks
        */
    search(){
      console.log(this.searchTerm);
      this.router.navigate(['/searchBooks'],{queryParams:{'search':this.searchTerm,'searchType':'title'}});
      
      this.clickBtn.emit(this.searchTerm);
      
    }
/**
        * calculates the number of notifications and checks if the auth user is concerned with it
        */
    loaddata(){
      var i;
  
      for(i=0;i<this.notifs.length;i++){
        if(this.notifs[i].data.type !=2 && this.notifs[i].data.review_user_id== this.id1)
       this. notifs[i].you=true;
       if(this.notifs[i].read == 0)
        this.notifsnb =this.notifsnb+1;
    }
  }
}
