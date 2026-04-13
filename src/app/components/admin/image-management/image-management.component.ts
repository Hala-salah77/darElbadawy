import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService, GalleryItem } from '../../../services/gallery.service';

@Component({
  selector: 'app-image-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-management.component.html',
  styleUrl: './image-management.component.scss'
})
export class ImageManagementComponent implements OnInit {
  galleryItems: GalleryItem[] = [];
  isLoading = true;

  // Form state
  showForm = false;
  editingItem: GalleryItem | null = null;
  formImgUrl = '';
  formName = '';
  isSaving = false;

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadGalleryImages();
  }

  loadGalleryImages(): void {
    this.isLoading = true;
    this.galleryService.getGalleryItems().subscribe({
      next: (items) => {
        this.galleryItems = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading gallery items:', err);
        this.isLoading = false;
      }
    });
  }

  openAddForm(): void {
    this.editingItem = null;
    this.formImgUrl = '';
    this.formName = '';
    this.showForm = true;
  }

  openEditForm(item: GalleryItem): void {
    this.editingItem = { ...item };
    this.formImgUrl = item.imgUrl;
    this.formName = item.name || '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formImgUrl = '';
    this.formName = '';
    this.editingItem = null;
  }

  saveImage(): void {
    if (!this.formImgUrl.trim()) return;

    this.isSaving = true;
    if (this.editingItem && this.editingItem.id) {
      // Update
      this.galleryService.updateGalleryItem(this.editingItem.id, this.formImgUrl, this.formName).subscribe({
        next: () => {
          this.loadGalleryImages();
          this.closeForm();
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Error updating image:', err);
          this.isSaving = false;
        }
      });
    } else {
      // Add
      this.galleryService.addGalleryItem(this.formImgUrl, this.formName).subscribe({
        next: () => {
          this.loadGalleryImages();
          this.closeForm();
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Error adding image:', err);
          this.isSaving = false;
        }
      });
    }
  }

  deleteImage(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this image?')) {
      this.galleryService.deleteGalleryItem(id).subscribe({
        next: () => {
          this.loadGalleryImages();
        },
        error: (err) => {
          console.error('Error deleting image:', err);
        }
      });
    }
  }
}
