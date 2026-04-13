import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { GalleryService, GalleryItem } from '../../services/gallery.service';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  images: GalleryItem[] = [];
  isLoading = true;
  showModal = false;
  currentImageIndex = 0;
  currentImage: GalleryItem | null = null;

  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    heroTitle: { en: 'Our Gallery', ar: 'معرض الصور' },
    heroSub: { en: 'Moments captured at Dar El-Badawi', ar: 'لحظات من دار البدوي' },
    loading: { en: 'Loading images...', ar: 'بنحمّل الصور...' }
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(private galleryService: GalleryService, public ts: TranslationService, private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    const isAr = this.ts.current === 'ar';
    this.titleService.setTitle(
      isAr ? 'معرض الصور — دار البدوي | دهب، سيناء' : 'Gallery — Dar El-Badawi | Dahab, Sinai'
    );
    this.metaService.updateTag({
      name: 'description',
      content: isAr
        ? 'شوف صور دار البدوي في دهب — لحظات حقيقية من الهوستل، الأنشطة، والطبيعة الخلابة في سيناء.'
        : 'Browse real moments from Dar El-Badawi in Dahab — hostel life, activities, and the stunning Sinai landscape.'
    });
    this.metaService.updateTag({ property: 'og:title', content: isAr ? 'معرض الصور — دار البدوي' : 'Gallery — Dar El-Badawi' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://bedouin.dar/gallery' });
    this.loadImages();
  }

  private loadImages() {
    this.galleryService.getGalleryItems().subscribe({
      next: (items) => {
        this.images = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching gallery images:', err);
        this.isLoading = false;
      }
    });
  }

  openModal(image: GalleryItem) {
    this.currentImageIndex = this.images.findIndex(img => img.id === image.id);
    this.currentImage = image;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.currentImage = null;
    document.body.style.overflow = '';
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showModal) return;

    switch (event.key) {
      case 'Escape':
        this.closeModal();
        break;
      case 'ArrowLeft':
        this.ts.current === 'ar' ? this.nextImage() : this.previousImage();
        break;
      case 'ArrowRight':
        this.ts.current === 'ar' ? this.previousImage() : this.nextImage();
        break;
    }
  }

  onModalClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found';
  }
}
