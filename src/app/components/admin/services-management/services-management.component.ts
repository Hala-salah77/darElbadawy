import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { ImageService } from '../../../services/image.service';
import { AuthService } from '../../../services/auth.service';
import { Service, ServiceCreate, ServiceCategory } from '../../../models/service.model';
import { Image, ImageCategory } from '../../../models/image.model';

@Component({
  selector: 'app-services-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services-management.component.html',
  styleUrl: './services-management.component.scss'
})
export class ServicesManagementComponent implements OnInit {
  services: Service[] = [];
  serviceForm: FormGroup;
  isEditing = false;
  editingId: string | null = null;
  isLoading = false;
  showForm = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  serviceCategories = Object.values(ServiceCategory);

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private imageService: ImageService,
    private authService: AuthService
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      category: [ServiceCategory.ENTERTAINMENT, [Validators.required]],
      price: [null, [Validators.min(0)]],
      currency: ['EGP'],
      duration: [''],
      icon: [''],
      features: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    this.serviceService.getAllServices().subscribe(services => {
      this.services = services;
      this.isLoading = false;
    });
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      this.isLoading = true;
      const formData = this.serviceForm.value;
      
      const serviceData: ServiceCreate = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        price: formData.price || undefined,
        currency: formData.currency,
        duration: formData.duration || undefined,
        icon: formData.icon || undefined,
        image: this.imagePreview || undefined,
        isActive: formData.isActive,
        features: formData.features ? formData.features.split(',').map((feature:any) => feature.trim()) : []
      };

      if (this.isEditing && this.editingId) {
        this.serviceService.updateService(this.editingId, serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating service:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.serviceService.createService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error creating service:', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

  editService(service: Service) {
    this.isEditing = true;
    this.editingId = service.id!;
    this.showForm = true;
    
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      category: service.category,
      price: service.price,
      currency: service.currency,
      duration: service.duration,
      icon: service.icon,
      features: service.features.join(', '),
      isActive: service.isActive
    });
    
    if (service.image) {
      this.imagePreview = service.image;
    }
  }

  deleteService(id: string) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
        }
      });
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (this.selectedImage && this.authService.getCurrentUser()) {
      const imageUpload = {
        file: this.selectedImage,
        category: ImageCategory.SERVICE,
        alt: this.serviceForm.get('title')?.value || 'Service image'
      };

      this.imageService.uploadImage(imageUpload, this.authService.getCurrentUser()!.uid).subscribe({
        next: (image) => {
          this.imagePreview = image.url;
          this.serviceForm.patchValue({ image: image.url });
          this.selectedImage = null;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        }
      });
    }
  }

  resetForm() {
    this.serviceForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.showForm = false;
    this.selectedImage = null;
    this.imagePreview = null;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  getCategoryDisplayName(category: ServiceCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }
}

