import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    heroTitle: { en: 'Get in Touch', ar: 'تواصل معنا' },
    heroSub: { en: "We'd love to hear from you. Drop us a message or find us in Sinai.", ar: 'يسعدنا تواصلك. ابعتلنا رسالة أو زورنا في سينا.' },
    contactInfo: { en: 'Contact Info', ar: 'معلومات التواصل' },
    addressLabel: { en: 'Address', ar: 'العنوان' },
    address: { en: 'Dahab, South Sinai, Egypt', ar: 'دهب، جنوب سيناء، مصر' },
    phoneLabel: { en: 'Phone / WhatsApp', ar: 'رقم التليفون / واتساب' },
    socialLabel: { en: 'Social Media', ar: 'السوشيال ميديا' },
    sendWa: { en: 'Send a WhatsApp Message', ar: 'ابعت مسج على الواتساب' },
    emailLabel: { en: 'Email', ar: 'البريد الإلكتروني' },
    email: { en: 'hello@darelbadawi.com', ar: 'hello@darelbadawi.com' },
    mapLabel: { en: 'Find Us', ar: 'موقعنا' }
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(public ts: TranslationService, private titleService: Title, private metaService: Meta) {}

  ngOnInit() {
    const isAr = this.ts.current === 'ar';
    this.titleService.setTitle(
      isAr ? 'تواصل معنا — دار البدوي | دهب، سيناء' : 'Contact Us — Dar El-Badawi | Dahab, Sinai'
    );
    this.metaService.updateTag({
      name: 'description',
      content: isAr
        ? 'تواصل مع دار البدوي في دهب، جنوب سيناء. احجز غرفتك عبر واتساب أو وجدنا على الخريطة.'
        : 'Contact Dar El-Badawi in Dahab, South Sinai. Book your room via WhatsApp or find us on the map.'
    });
    this.metaService.updateTag({ property: 'og:title', content: isAr ? 'تواصل معنا — دار البدوي' : 'Contact — Dar El-Badawi' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://bedouin.dar/contact' });
  }
}

