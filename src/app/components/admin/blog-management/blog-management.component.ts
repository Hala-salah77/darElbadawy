import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog.service';
import { ImageService } from '../../../services/image.service';
import { AuthService } from '../../../services/auth.service';
import { BlogPost, BlogPostCreate } from '../../../models/blog.model';
import { Image, ImageCategory } from '../../../models/image.model';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-management.component.html',
  styleUrl: './blog-management.component.scss'
})
export class BlogManagementComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  blogForm: FormGroup;
  isEditing = false;
  editingId: string | null = null;
  isLoading = false;
  showForm = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private imageService: ImageService,
    private authService: AuthService
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      excerpt: ['', [Validators.required, Validators.minLength(20)]],
      author: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      isPublished: [false],
      featuredImage: ['']
    });
  }

  ngOnInit() {
    this.loadBlogPosts();
  }

  loadBlogPosts() {
    this.isLoading = true;
    this.blogService.getAllBlogPosts().subscribe(posts => {
      this.blogPosts = posts;
      this.isLoading = false;
    });
  }

  onSubmit() {
    if (this.blogForm.valid) {
      this.isLoading = true;
      const formData = this.blogForm.value;
      
      // Create slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      const blogPostData: BlogPostCreate = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        tags: formData.tags.split(',').map((tag:any) => tag.trim()),
        isPublished: formData.isPublished,
        slug: slug,
        featuredImage: this.imagePreview || undefined
      };

      if (this.isEditing && this.editingId) {
        this.blogService.updateBlogPost(this.editingId, blogPostData).subscribe({
          next: () => {
            this.loadBlogPosts();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating blog post:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.blogService.createBlogPost(blogPostData).subscribe({
          next: () => {
            this.loadBlogPosts();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error creating blog post:', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

  editBlogPost(blogPost: BlogPost) {
    this.isEditing = true;
    this.editingId = blogPost.id!;
    this.showForm = true;
    
    this.blogForm.patchValue({
      title: blogPost.title,
      content: blogPost.content,
      excerpt: blogPost.excerpt,
      author: blogPost.author,
      tags: blogPost.tags.join(', '),
      isPublished: blogPost.isPublished,
      featuredImage: blogPost.featuredImage
    });
    
    if (blogPost.featuredImage) {
      this.imagePreview = blogPost.featuredImage;
    }
  }

  deleteBlogPost(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlogPost(id).subscribe({
        next: () => {
          this.loadBlogPosts();
        },
        error: (error) => {
          console.error('Error deleting blog post:', error);
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
        category: ImageCategory.BLOG,
        alt: this.blogForm.get('title')?.value || 'Blog image'
      };

      this.imageService.uploadImage(imageUpload, this.authService.getCurrentUser()!.uid).subscribe({
        next: (image) => {
          this.imagePreview = image.url;
          this.blogForm.patchValue({ featuredImage: image.url });
          this.selectedImage = null;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        }
      });
    }
  }

  resetForm() {
    this.blogForm.reset();
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
}

