import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { ServiceService } from '../../../services/service.service';
import { GalleryService, GalleryItem } from '../../../services/gallery.service';
import { BlogPost } from '../../../models/blog.model';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = {
    totalBlogPosts: 0,
    totalServices: 0,
    totalImages: 0,
    publishedPosts: 0
  };

  recentBlogPosts: BlogPost[] = [];
  recentServices: Service[] = [];
  recentImages: GalleryItem[] = [];
  isLoading = true;
  today = new Date();

  // Alert counters
  draftPosts = 0;
  inactiveServices = 0;

  constructor(
    private blogService: BlogService,
    private serviceService: ServiceService,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    let loaded = 0;
    const done = () => { if (++loaded === 3) this.isLoading = false; };

    this.blogService.getAllBlogPosts().subscribe(posts => {
      this.stats.totalBlogPosts = posts.length;
      this.stats.publishedPosts = posts.filter(p => p.isPublished).length;
      this.draftPosts = posts.filter(p => !p.isPublished).length;
      this.recentBlogPosts = posts.slice(0, 5);
      done();
    });

    this.serviceService.getAllServices().subscribe(services => {
      this.stats.totalServices = services.length;
      this.inactiveServices = services.filter(s => !s.isActive).length;
      this.recentServices = services.slice(0, 5);
      done();
    });

    this.galleryService.getGalleryItems().subscribe(items => {
      this.stats.totalImages = items.length;
      this.recentImages = items.slice(0, 5);
      done();
    });
  }
}
