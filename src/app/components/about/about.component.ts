import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    heroTitle: { en: 'Our Story', ar: 'حكايتنا في سيناء' },
    heroSub: { en: 'The journey of Dar El-Badawi', ar: 'رحلة دار البدوي من البداية' },
    storyLabel: { en: 'The Dar', ar: 'الدار' },
    storyTitle: { en: 'Welcome to the Family', ar: 'أهلاً بيك في العيلة' },
    storyP1: { 
      en: 'Dar El-Badawi is more than a hostel. It was born from a passion for the Sinai desert and a desire to create a genuine home for travelers.', 
      ar: 'دار البدوي مش مجرد هوستل. اتولد من شغف بصحراء سيناء ورغبة في خلق بيت حقيقي للمسافرين.' 
    },
    storyP2: { 
      en: 'We believe in keeping the Bedouin spirit alive. Here, strangers become friends around the fire, and every day is an adventure.', 
      ar: 'إحنا بنؤمن بالحفاظ على الروح البدوية. هنا الغرباء بيبقوا صحاب حوالين النار، وكل يوم هو مغامرة.' 
    },
    missionLabel: { en: 'Our Mission', ar: 'مهمتنا' },
    missionTitle: { en: 'Authenticity & Impact', ar: 'الأصالة والأثر' },
    missionText: { 
      en: 'Our goal is to give you an unfiltered Sinai experience while giving back to the local ecosystem through community volunteering.', 
      ar: 'هدفنا نقدملك تجربة سيناوية حقيقية بدون فلاتر، وفي نفس الوقت نرد الجميل للبيئة المحلية من خلال التطوع.' 
    }
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(public ts: TranslationService, private titleService: Title, private metaService: Meta) {}

  ngOnInit() {
    const isAr = this.ts.current === 'ar';
    this.titleService.setTitle(
      isAr ? 'قصتنا — دار البدوي | دهب، سيناء' : 'Our Story — Dar El-Badawi | Dahab, Sinai'
    );
    this.metaService.updateTag({
      name: 'description',
      content: isAr
        ? 'تعرف على قصة دار البدوي — هوستل دهب الأصيل في قلب سيناء. مهمتنا، قيمنا، ورحلتنا من البداية.'
        : 'Learn the story of Dar El-Badawi — Dahab\'s authentic Sinai hostel. Our mission, values, and journey from the beginning.'
    });
    this.metaService.updateTag({ property: 'og:title', content: isAr ? 'قصتنا — دار البدوي' : 'Our Story — Dar El-Badawi' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://bedouin.dar/about' });
  }
}

