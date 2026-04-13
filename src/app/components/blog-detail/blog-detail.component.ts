import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  blogPost: BlogPost | null = null;
  isLoading = true;

  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    back: { en: 'Back to Stories', ar: 'الرجوع للحكايات' },
    loading: { en: 'Loading story...', ar: 'بنحمّل الحكاية...' },
    notFound: { en: 'Story not found!', ar: 'الحكاية مش موجودة!' }
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    public ts: TranslationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlogPost(id);
    }
  }

  private loadBlogPost(id: string) {
    this.blogService.getBlogPost(id).subscribe(post => {
      this.blogPost = post;
      this.isLoading = false;
    });
  }
}
