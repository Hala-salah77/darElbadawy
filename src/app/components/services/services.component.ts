import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  isLoading = true;

  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    heroTitle: { en: 'Stay With Us', ar: 'اقعد في الدار' },
    heroSub: { en: 'Find your perfect spot under the Sinai sky.', ar: 'اختار مكانك تحت سما سيناء.' },
    loading: { en: 'Loading rooms...', ar: 'بنحمّل الأوض...' },
    noRooms: { en: 'No rooms available at the moment.', ar: 'مفيش أوض متاحة حالياً.' },
    bookNow: { en: 'Book Now', ar: 'احجز الآن' },
    from: { en: 'From', ar: 'من' },
    night: { en: '/ night', ar: '/ ليلة' }
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(
    private serviceService: ServiceService,
    public ts: TranslationService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    const isAr = this.ts.current === 'ar';
    this.titleService.setTitle(
      isAr ? 'الإقامة — دار البدوي | غرف في دهب، سيناء' : 'Stay With Us — Dar El-Badawi | Rooms in Dahab, Sinai'
    );
    this.metaService.updateTag({
      name: 'description',
      content: isAr
        ? 'اختار غرفتك في دار البدوي — دهب، سيناء. سراير دورمتوري، غرف خاصة، وخيام السطح. احجز الآن عبر واتساب.'
        : 'Book your stay at Dar El-Badawi in Dahab, Sinai. Dorm beds, private rooms & rooftop tents. Book via WhatsApp.'
    });
    this.metaService.updateTag({ property: 'og:title', content: isAr ? 'الإقامة — دار البدوي' : 'Stay — Dar El-Badawi' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://bedouin.dar/services' });
    this.loadServices();
  }

  private loadServices() {
    this.serviceService.getServices().subscribe(services => {
      this.services = services;
      this.isLoading = false;
    });
  }
}
