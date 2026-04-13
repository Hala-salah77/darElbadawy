import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService, Lang } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  get lang(): Lang { return this.ts.current; }

  i18n: Record<string, Record<string, string>> = {
    title: { en: 'Welcome Back', ar: 'أهلاً بيك تاني' },
    sub: { en: 'Sign in to Dar El-Badawi', ar: 'تسجيل الدخول لدار البدوي' },
    emailLabel: { en: 'Email Address', ar: 'البريد الإلكتروني' },
    emailPlaceholder: { en: 'name@example.com', ar: 'name@example.com' },
    passLabel: { en: 'Password', ar: 'كلمة السر' },
    passPlaceholder: { en: 'Enter your password', ar: 'اكتب كلمة السر' },
    btnAction: { en: 'Sign In', ar: 'دخول' },
    btnLoading: { en: 'Signing in...', ar: 'جاري الدخول...' },
    errorReqUser: { en: 'Email is required!', ar: 'البريد الإلكتروني مطلوب!' },
    errorReqPass: { en: 'Password must be at least 6 characters.', ar: 'كلمة السر لازم تكون 6 حروف على الأقل.' },
    errorInvalid: { en: 'Invalid email or password. Please try again.', ar: 'البريد أو كلمة السر غلط. جرب تاني.' },
    backBtn: { en: 'Back to Home', ar: 'الرجوع للرئيسية' },
  };

  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public ts: TranslationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.signIn(email, password).then((user) => {
        this.isLoading = false;
        console.log(user);
        user.uid ? this.router.navigate(['/admin/dashboard']) : this.router.navigate(['/']);
        // if (user.email == 'admin@gmail.com') {
        //   
        // } else {
        //   this.router.navigate(['/']);
        // }
      }).catch((error) => {
        this.isLoading = false;
        this.errorMessage = this.t('errorInvalid');
        console.error('Login error:', error);
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.controls[key].markAsTouched();
      });
    }
  }
}
