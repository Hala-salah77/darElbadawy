import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  isLoading = true;

  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    heroTitle: { en: 'Our Stories', ar: 'حكايات الدار' },
    heroSub: { en: 'Tales from the desert, volunteer experiences, and Sinai secrets.', ar: 'حكايات من الصحراء، تجارب التطوع، وأسرار سيناء.' },
    readStory: { en: 'Read Story', ar: 'اقرأ الحكاية' },
    noPosts: { en: 'No stories found yet. Come back later!', ar: 'مفيش حكايات لسه. ارجع لنا قريب!' },
    loading: { en: 'Loading stories...', ar: 'بنحمّل الحكايات...' }
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(private blogService: BlogService, public ts: TranslationService, private titleService: Title, private metaService: Meta) {}

  ngOnInit() {
    const isAr = this.ts.current === 'ar';
    this.titleService.setTitle(
      isAr ? 'حكايات الدار — دار البدوي | قصص سيناء' : 'Stories — Dar El-Badawi | Tales from Sinai'
    );
    this.metaService.updateTag({
      name: 'description',
      content: isAr
        ? 'حكايات من الصحراء، تجارب التطوع، وأسرار سيناء من مدونة دار البدوي.'
        : 'Tales from the desert, volunteer experiences, and Sinai secrets from the Dar El-Badawi journal.'
    });
    this.metaService.updateTag({ property: 'og:title', content: isAr ? 'حكايات الدار — دار البدوي' : 'Stories — Dar El-Badawi' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://bedouin.dar/blog' });
    this.loadBlogPosts();
  }

  private loadBlogPosts() {
    this.blogService.getBlogPosts().subscribe(posts => {
      this.blogPosts = posts;
      this.isLoading = false;
    });
  }
}
