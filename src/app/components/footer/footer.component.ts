import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(public ts: TranslationService) {}

  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    brand:     { en: 'Dar El-Badawi', ar: 'دار البدوي' },
    brandDesc: { en: 'Your story in Sinai starts here. Authentic experiences, warm community, and the raw beauty of the desert.', ar: 'قصتك في سيناء بتبدأ هنا. تجارب أصيلة، مجتمع دافي، وجمال الصحراء الخام.' },
    explore:   { en: 'Explore', ar: 'استكشف' },
    home:      { en: 'Home', ar: 'الرئيسية' },
    events:    { en: 'Events', ar: 'الفعاليات' },
    stay:      { en: 'Stay', ar: 'الإقامة' },
    gallery:   { en: 'Gallery', ar: 'المعرض' },
    stories:   { en: 'Stories', ar: 'الحكايات' },
    about:     { en: 'About', ar: 'عنا' },
    experience:{ en: 'Experience', ar: 'التجربة' },
    dorms:     { en: 'Dorm Beds', ar: 'أسرة دورمتوري' },
    private:   { en: 'Private Rooms', ar: 'أوض خاصة' },
    rooftop:   { en: 'Rooftop Tents', ar: 'خيام السطح' },
    volunteer: { en: 'Volunteering', ar: 'التطوع' },
    secrets:   { en: 'Secret Spots', ar: 'الأماكن السرية' },
    playlist:  { en: 'The Dar Playlist', ar: 'صوت الدار' },
    contact:   { en: 'Contact', ar: 'تواصل' },
    address:   { en: 'Dahab, South Sinai, Egypt', ar: 'دهب، جنوب سيناء، مصر' },
    bookWa:    { en: 'Book via WhatsApp', ar: 'احجز من واتساب' },
    copy:      { en: 'Made with ❤️ in Sinai', ar: 'صُنع بـ ❤️ في سيناء' },
    privacy:   { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    terms:     { en: 'Terms of Service', ar: 'شروط الخدمة' },
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }
}
