import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BlogService } from '../../services/blog.service';
import { ServiceService } from '../../services/service.service';
import { ImageService } from '../../services/image.service';
import { TranslationService, Lang } from '../../services/translation.service';
import { BlogPost } from '../../models/blog.model';
import { Service } from '../../models/service.model';
import { Image, ImageCategory } from '../../models/image.model';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

interface SinaiEvent {
  id: number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  date: Date;
  icon: string;
  tag: string;
  tagAr: string;
  color: string;
}

interface SecretSpot {
  name: string;
  nameAr: string;
  emoji: string;
  left: string;
  top: string;
  desc: string;
  descAr: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ScheduleItem {
  time?: string;
  timeAr?: string;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
}

interface DaySchedule {
  dayId: string;
  dayEn: string;
  dayAr: string;
  daylight: ScheduleItem[];
  midday: ScheduleItem[];
  nightlife: ScheduleItem[];
}

interface PastEvent {
  id: number;
  imageUrl?: string;
  title: string;
  titleAr: string;
  edition: string;
  editionAr: string;
  slogan: string;
  sloganAr: string;
  activities: string[];
  activitiesAr: string[];
  date: string;
  dateAr: string;
  startTime: string;
  startTimeAr: string;
  venue: string;
  venueAr: string;
  contribution: string;
  contributionAr: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, SafeHtmlPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  featuredBlogPosts: BlogPost[] = [];
  featuredServices: Service[] = [];
  heroImages: Image[] = [];
  isLoading = true;

  get lang(): Lang { return this.ts.current; }

  /* Ken-Burns Hero Slideshow */
  heroSlides = [
    'https://res.cloudinary.com/dkbjna5nf/image/upload/v1775455620/657761373_18067825406660387_3606460862705070570_n_lgqv4h.jpg',
    'https://res.cloudinary.com/dkbjna5nf/image/upload/v1775890622/Gemini_Generated_Image_uno6gkuno6gkuno6_tjltry.png',
    'https://res.cloudinary.com/dkbjna5nf/image/upload/v1775890950/Gemini_Generated_Image_f6r9gcf6r9gcf6r9_wgkqdm.png',
    'https://res.cloudinary.com/dkbjna5nf/image/upload/v1775891246/Gemini_Generated_Image_6conmw6conmw6con_rktvxz.png',
  ];
  currentSlide = 0;
  private slideInterval: any;

  /* Instagram embed */
  instagramEmbed = `<iframe
    src="https://www.instagram.com/p/DGni898NNbI/embed/"
    width="100%"
    height="560"
    frameborder="0"
    scrolling="no"
    allowtransparency="true"
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
    style="border:none; border-radius: 12px; overflow:hidden;">
  </iframe>`;

  /* Upcoming Events */
  events: SinaiEvent[] = [
    {
      id: 1,
      titleEn: 'Mount Sinai Sunrise Hike',
      titleAr: 'رحلة شروق جبل موسى',
      descEn: 'Join us for a magical overnight hike to watch the sunrise from the top of Mount Sinai. Bedouin guides, hot tea & unforgettable views.',
      descAr: 'انضم إلينا لرحلة سهرية ساحرة لمشاهدة شروق الشمس من قمة جبل موسى. دليل بدوي، شاي ساخن ومناظر لا تُنسى.',
      date: new Date('2026-04-12T03:00:00'),
      icon: '🏔️',
      tag: 'Adventure',
      tagAr: 'مغامرة',
      color: '#4A90E2'
    },
    {
      id: 2,
      titleEn: 'Bedouin Oud Night',
      titleAr: 'ليلة عود بدوي',
      descEn: 'An intimate night of authentic Bedouin music under the stars. Live oud, folklore songs, and a traditional BBQ around the fire.',
      descAr: 'أمسية حميمة من الموسيقى البدوية الأصيلة تحت النجوم. عزف عود حي، أغاني تراثية وشواء بدوي حول النار.',
      date: new Date('2026-04-19T20:00:00'),
      icon: '🎵',
      tag: 'Culture',
      tagAr: 'ثقافة',
      color: '#E8A020'
    },
    {
      id: 3,
      titleEn: 'Palm Tree Planting Day',
      titleAr: 'يوم زراعة النخل',
      descEn: 'Be part of our volunteer day to plant palm trees and restore the desert oasis. Food, fun, and a real impact on our community.',
      descAr: 'كن جزءًا من يوم التطوع لزراعة النخيل وترميم واحة الصحراء. أكل وفرح وأثر حقيقي في مجتمعنا.',
      date: new Date('2026-04-26T09:00:00'),
      icon: '🌴',
      tag: 'Volunteering',
      tagAr: 'تطوع',
      color: '#2ECC71'
    }
  ];

  countdowns: { [key: number]: CountdownTime } = {};
  private countdownInterval: any;

  /* Weekly Schedule */
  weeklySchedule: DaySchedule[] = [
    {
      dayId: 'sat', dayEn: 'SAT', dayAr: 'السبت',
      daylight: [{ time: '8 AM', timeAr: '8 ص', title: 'DESERT TRIP', titleAr: 'رحلة صحراوية' }],
      midday: [{ title: 'WHITE RED CLOSED CANYONS', titleAr: 'الوديان: الأبيض، الأحمر، المغلق' }],
      nightlife: []
    },
    {
      dayId: 'sun', dayEn: 'SUN', dayAr: 'الأحد',
      daylight: [{ time: '1 PM', timeAr: '1 م', title: 'CARAVAN SNORKLLING', titleAr: 'سنوركلنج بالجزيرة', subtitle: '(ISLAND)', subtitleAr: '(الجزيرة)' }],
      midday: [],
      nightlife: [
        { title: 'GAME NIGHT', titleAr: 'ليلة ألعاب', time: '6 PM', timeAr: '6 م' },
        { title: 'VEGAN DINNER', titleAr: 'عشاء نباتي' }
      ]
    },
    {
      dayId: 'mon', dayEn: 'MON', dayAr: 'الإثنين',
      daylight: [],
      midday: [{ time: '3 AM', timeAr: '3 ف', title: 'BEDOUIN FISHING ADV', titleAr: 'مغامرة صيد بدوية' }],
      nightlife: [
        { title: 'MOODY MONDAY', titleAr: 'إثنين المزاج' },
        { time: '7 PM', timeAr: '7 م', title: 'CONCERT', titleAr: 'حفلة موسيقية' },
        { time: '9 PM', timeAr: '9 م', title: 'JAMMING', titleAr: 'عزف حر' }
      ]
    },
    {
      dayId: 'tues', dayEn: 'TUES', dayAr: 'الثلاثاء',
      daylight: [{ time: '9 AM', timeAr: '9 ص', title: 'SANT CATHERINE SUNSET', titleAr: 'غروب سانت كاترين' }],
      midday: [{ time: '3 PM', timeAr: '3 م', title: 'CARAVAN BECH SUNSET', titleAr: 'غروب الشاطئ' }],
      nightlife: []
    },
    {
      dayId: 'wed', dayEn: 'WED', dayAr: 'الأربعاء',
      daylight: [{ time: '1 PM', timeAr: '1 م', title: 'CARAVAN SUNSETHIKE', titleAr: 'هايكنج وقت الغروب' }],
      midday: [{ time: '3 PM', timeAr: '3 م', title: 'PAINTING WORKSHOP', titleAr: 'ورشة رسم' }],
      nightlife: [
        { title: 'CINEMA WADI MOVIE NIGHT', titleAr: 'سينما الوادي', time: '6 PM', timeAr: '6 م' },
        { title: 'BONFIRE BBQ DINNER', titleAr: 'عشاء شواء على النار' }
      ]
    },
    {
      dayId: 'thur', dayEn: 'THUR', dayAr: 'الخميس',
      daylight: [{ time: '9 AM', timeAr: '9 ص', title: 'BREAKFAST EVENT', titleAr: 'فعالية فطور', subtitle: 'FETER MESHALTET', subtitleAr: 'فطير مشلتت' }],
      midday: [{ time: '5 PM', timeAr: '5 م', title: 'ACRO YOGA SCHOOL', titleAr: 'يوجا الأكرو' }],
      nightlife: [
        { title: 'BEDOUIN MOUNTAIN NIGHT', titleAr: 'ليلة جبل بدوية', time: '9 PM', timeAr: '9 م', subtitle: '(MUSIC JAM)', subtitleAr: '(عزف حر)' },
        { title: 'BONFIRE BBQ DINNER', titleAr: 'عشاء شواء على النار' }
      ]
    },
    {
      dayId: 'fri', dayEn: 'FRIDAY', dayAr: 'الجمعة',
      daylight: [],
      midday: [],
      nightlife: [
        { title: 'COMMUNITY MEET-UP', titleAr: 'لقاء مجتمعي' },
        { title: 'MANDI DINNER', titleAr: 'عشاء مندي' },
        { time: '9 PM', timeAr: '9 م', title: 'KARAOKE NIGHT', titleAr: 'ليلة كاريوكي' }
      ]
    }
  ];

  /* Past / Detailed Events */
  pastEvents: PastEvent[] = [
    {
      id: 1, imageUrl: '',
      title: 'Sinai Desert Escape', titleAr: 'هروب إلى صحراء سيناء',
      edition: 'Weekly Adventure', editionAr: 'مغامرة أسبوعية',
      slogan: 'Nature, Fire, Stories, and Real Bedouin vibes', sloganAr: 'طبيعة، نار، حكايات، وأجواء بدوية حقيقية',
      activities: ['Hiking in White Canyon', 'Exploring Red Canyon', 'Exploring Closed Canyon', 'BBQ Food in nature', 'Camping under the stars'],
      activitiesAr: ['هايكنج في الوادي الأبيض', 'استكشاف الوادي الأحمر', 'استكشاف الوادي المغلق', 'حفلة شواء في الطبيعة', 'تخييم تحت النجوم'],
      date: 'Every Saturday', dateAr: 'كل سبت',
      startTime: '8:00 AM', startTimeAr: '8:00 صباحاً',
      venue: 'Departure from Bedouin Hostel', venueAr: 'التحرك من فندق بدوي',
      contribution: 'Contact for pricing', contributionAr: 'تواصل لمعرفة السعر'
    },
    {
      id: 2, imageUrl: '',
      title: 'Wednesday Movie Night', titleAr: 'ليلة سينما الأربعاء',
      edition: 'Weekly Edition', editionAr: 'النسخة الأسبوعية',
      slogan: 'Sharing dinner, cinema, and a beautiful evening together', sloganAr: 'نتشارك العشاء، السينما، وأمسية جميلة معاً',
      activities: ['Community Dinner', 'Movie Screening', 'Bonfire & Conversation', 'Social Gathering'],
      activitiesAr: ['عشاء جماعي', 'عرض فيلم', 'تجمع حول النار ونقاش', 'تجمع اجتماعي'],
      date: 'Every Wednesday', dateAr: 'كل أربعاء',
      startTime: '7:00 PM', startTimeAr: '7:00 مساءً',
      venue: 'Bedouin Hostel', venueAr: 'فندق بدوي',
      contribution: 'Dinner: 300 EGP | Movie: 100 EGP', contributionAr: 'العشاء: 300 ج | الفيلم: 100 ج'
    },
    {
      id: 3, imageUrl: '',
      title: 'Bir Aqda Expedition', titleAr: 'رحلة استكشاف بئر عقدة',
      edition: '3 Days Off-Grid Adventure', editionAr: 'مغامرة 3 أيام بعيداً عن المدينة',
      slogan: 'No signal. No noise. Only mountains, sea, and desert', sloganAr: 'لا شبكة.. لا ضوضاء.. فقط الجبال، البحر، والصحراء',
      activities: ['Boat trip along Abu Ghalum coast', 'Camel trekking in granite mountains', 'Camping in abandoned village', 'Hiking to hidden waterfalls', 'Beach camping at Blue Lagoon'],
      activitiesAr: ['رحلة بالمركب على ساحل أبو جالوم', 'ارتحال بالجمال في الجبال', 'تخييم في قرية مهجورة', 'هايكنج للشلالات المخفية', 'تخييم شاطئي في بلو لاجون'],
      date: 'April 4, 18, May 2', dateAr: '4، 18 أبريل، 2 مايو',
      startTime: 'Morning departure', startTimeAr: 'تحرك صباحي',
      venue: 'Dahab & Abu Ghalum', venueAr: 'دهب ومحمية أبو جالوم',
      contribution: 'Early: 75 USD | Regular: 90 USD', contributionAr: 'مبكر: 75 دولار | عادي: 90 دولار'
    },
    {
      id: 4, imageUrl: '',
      title: 'THE SINAI CAMEL EXPEDITION', titleAr: 'حملة سيناء للجمال',
      edition: 'Special Spring Edition', editionAr: 'نسخة الربيع الخاصة',
      slogan: 'A Real Bedouin Journey into the Mountains', sloganAr: 'رحلة بدوية حقيقية في قلب الجبال',
      activities: ['Camel expedition', 'Hiking ancient Bedouin paths', 'Camping in Bir Aqda', 'Drinking from natural springs', 'Stars & fire stories'],
      activitiesAr: ['رحلة بالجمال', 'هايكنج في مسارات قديمة', 'تخييم في بئر عقدة', 'الماء من عيون طبيعية', 'نجوم وقصص نار'],
      date: 'Flexible Dates', dateAr: 'مواعيد مرنة',
      startTime: 'Morning', startTimeAr: 'صباحًا',
      venue: 'Abu Ghalum ↔ Blue Lagoon', venueAr: 'أبو جالوم ↔ بلو لاجون',
      contribution: 'Contact for pricing', contributionAr: 'تواصل لمعرفة السعر'
    },
    {
      id: 5, imageUrl: '',
      title: 'Wadi Gnai Sunset Walk', titleAr: 'رحلة وادي جني (مشي وغروب)',
      edition: 'Bedouin Hostel Escape', editionAr: 'هروب للطبيعة',
      slogan: 'Escape the city, disconnect, and enjoy the mountains', sloganAr: 'اهرب من صخب المدينة، افصل واستمتع بالجبال',
      activities: ['Sunset Mountain Walk', 'Desert Exploration', 'Stargazing', 'Bedouin Dinner experience'],
      activitiesAr: ['مشي جبلي وقت الغروب', 'استكشاف الصحراء', 'تأمل النجوم', 'تجربة عشاء بدوي'],
      date: 'Daily Available', dateAr: 'متاح يومياً',
      startTime: '3:30 PM', startTimeAr: '3:30 عصراً',
      venue: 'Wadi Gnai, Dahab', venueAr: 'وادي جني، دهب',
      contribution: '750 EGP (no dinner) | 1100 EGP (with dinner)', contributionAr: '750 ج (بدون) | 1100 ج (بالعشاء)'
    }
  ];

  /* Secret Spots Map */
  secretSpots: SecretSpot[] = [
    { name: 'Blue Hole', nameAr: 'الحفرة الزرقاء', emoji: '🤿', left: '72%', top: '30%', desc: 'World-famous dive site', descAr: 'موقع غوص عالمي' },
    { name: 'Wadi Gnai', nameAr: 'وادي جناي', emoji: '🏜️', left: '30%', top: '55%', desc: 'Secret canyon hike', descAr: 'رحلة كانيون سرية' },
    { name: 'Canyon', nameAr: 'الكانيون', emoji: '🪨', left: '20%', top: '40%', desc: 'Hidden rock canyon swim', descAr: 'سباحة في كانيون الصخور' },
    { name: 'Ras Abu Gallum', nameAr: 'رأس أبو جالوم', emoji: '🐪', left: '78%', top: '18%', desc: 'Camel ride to paradise beach', descAr: 'ركوب جمل للشاطئ الجنة' },
    { name: 'Mount Sinai', nameAr: 'جبل موسى', emoji: '🌅', left: '15%', top: '70%', desc: 'Sunrise from 2285m', descAr: 'شروق من 2285 متر' },
    { name: 'Secret Beach', nameAr: 'الشاطئ السري', emoji: '🏖️', left: '60%', top: '42%', desc: 'Owner\'s hidden gem', descAr: 'جوهرة صاحب الهوستل' }
  ];
  activeSpot: SecretSpot | null = null;

  /* Active hero words animation */
  heroWords = ['قصة', 'مغامرة', 'عائلة', 'جنة'];
  heroWordsEn = ['story', 'adventure', 'family', 'paradise'];
  currentWord = 0;
  private wordInterval: any;

  /* Translation maps for inline texts */
  i18n: Record<string, Record<string, string>> = {
    heroBadge: { en: 'Dahab · South Sinai · Egypt', ar: 'دهب · جنوب سيناء · مصر' },
    heroTitleEn: { en: "Sinai isn't just a place.", ar: 'سيناء مش مجرد مكان.' },
    heroTitleAr: { en: 'It\'s your next', ar: 'سيناء دي' },
    heroTitleEnd: { en: 'Ready?', ar: 'جاهز؟' },
    heroSub: { en: 'Dar El-Badawi is not just a hostel — it\'s your Sinai story waiting to happen.', ar: 'دار البدوي مش مجرد هوستل — ده قصتك في سيناء اللي مستنياك.' },
    heroCtaEvents: { en: 'Explore Events', ar: 'اكتشف فعالياتنا' },
    heroCtaBook: { en: 'Book a Bed', ar: 'احجز سرير' },
    statSouls: { en: 'Happy Souls', ar: 'روح سعيدة' },
    statAdventures: { en: 'Adventures', ar: 'مغامرة' },
    statRating: { en: 'Rating', ar: 'تقييم' },
    statStories: { en: 'Stories await', ar: 'قصص تنتظرك' },
    scroll: { en: 'Explore', ar: 'اكتشف' },
    eventsLabel: { en: "What's On", ar: 'الفعاليات' },
    eventsTitle: { en: "What's new at the Dar?", ar: 'إيه الجديد في الدار؟' },
    eventsSub: { en: "Don't just visit. Live it. Here's what's happening next.", ar: 'متزورش بس. عيشها. ده اللي جاي في الدار.' },
    countdownTitle: { en: 'Starts in', ar: 'بيبدأ في' },
    days: { en: 'Days', ar: 'يوم' },
    hrs: { en: 'Hrs', ar: 'ساعة' },
    min: { en: 'Min', ar: 'دقيقة' },
    sec: { en: 'Sec', ar: 'ثانية' },
    reserveSpot: { en: 'Reserve My Spot', ar: 'احجز مكاني' },
    videoLabel: { en: 'Our World', ar: 'عالمنا' },
    videoTitle: { en: 'Before you arrive, feel it.', ar: 'شوف قبل ما توصل.' },
    videoDesc: { en: 'This is Dar El-Badawi. Not a brochure — just real moments, real people, and the raw magic of Sinai.', ar: 'ده مش إعلان. ده الحقيقة. لحظات حقيقية، ناس حقيقيين، وسحر سيناء الخام.' },
    followUs: { en: 'Follow Us', ar: 'تابعنا' },
    planTrip: { en: 'Plan Your Trip', ar: 'خطط رحلتك' },
    historyLabel: { en: 'Sinai Stories', ar: 'حكايات سيناء' },
    historyTitle: { en: 'A Land That Whispers History', ar: 'أرض بتحكي تاريخ' },
    historyText: { en: "Sinai is more than mountains and sea. It's 3,000 years of stories — prophets walked here, civilizations rose, Bedouin tribes have kept their traditions alive.", ar: 'سيناء مش بس جبال وبحر. دي 3000 سنة من الحكايات — أنبياء مشوا هنا، حضارات اتبنت، وقبائل بدوية حافظت على تراثها.' },
    readStories: { en: 'Read Our Stories', ar: 'اقرأ حكاياتنا' },
    volLabel: { en: 'Volunteering', ar: 'التطوع' },
    volTitle: { en: 'Be Part of the Family', ar: 'كن جزء من العيلة' },
    volText: { en: 'At Dar El-Badawi we believe travel should give back. Join our volunteer community.', ar: 'في دار البدوي بنؤمن إن السفر لازم يرجع بخير. انضم لمجتمع المتطوعين.' },
    volJoin: { en: 'Join the Family', ar: 'انضم للعيلة' },
    stayLabel: { en: 'Stay With Us', ar: 'اقعد في الدار' },
    stayTitle: { en: 'Your home in Sinai', ar: 'دارك في سيناء' },
    staySub: { en: "Simple, cosy, and full of soul. No luxury gimmicks — just what you actually need.", ar: 'بسيط، مريح، ومليان روح. من غير رفاهية مزيفة — بس اللي انت فعلاً محتاجه.' },
    book: { en: 'Book', ar: 'احجز' },
    amenitiesTitle: { en: "What's Included", ar: 'اللي معاك' },
    mapLabel: { en: 'Secret Spots', ar: 'الأماكن السرية' },
    mapTitle: { en: "Owner's Secret Map", ar: 'خريطة صاحب الهوستل السرية' },
    mapSub: { en: "Not TripAdvisor. These are the places the owner actually takes his friends.", ar: 'مش TripAdvisor. دول الأماكن اللي صاحب الهوستل فعلاً بياخد صحابه فيها.' },
    mapLegend: { en: "Owner's Picks", ar: 'اختيارات المالك' },
    mapLegendSub: { en: 'Hover/tap each pin to discover the story', ar: 'اضغط على كل علامة عشان تعرف الحكاية' },
    findOnMap: { en: 'Find Us on Google Maps', ar: 'لاقينا على خرائط جوجل' },
    insideGuide: { en: 'Get the Inside Guide', ar: 'اطلب الدليل السري' },
    playlistLabel: { en: 'The Vibe', ar: 'أجواء الدار' },
    playlistTitle: { en: 'Sound of the Dar', ar: 'صوت الدار' },
    playlistSub: { en: 'The music playing while you sip tea and watch the sunset from our rooftop.', ar: 'الموسيقى اللي بتشتغل وانت بتشرب شاي وبتتفرج على الغروب من سطحنا.' },
    blogLabel: { en: 'Stories', ar: 'الحكايات' },
    blogTitle: { en: "From the Dar's Journal", ar: 'من دفتر الدار' },
    readStory: { en: 'Read Story', ar: 'اقرأ الحكاية' },
    allStories: { en: 'All Stories', ar: 'كل الحكايات' },
    ctaTitle: { en: 'Ready for your', ar: 'جاهز لـ' },
    ctaTitleWord: { en: 'Sinai story?', ar: 'قصتك في سيناء؟' },
    ctaSub: { en: 'Pack light. Bring an open heart. We\'ll take care of the rest.', ar: 'خفف شنطتك. جيب قلب مفتوح. واحنا هنتكفل بالباقي.' },
    ctaBook: { en: 'Book via WhatsApp', ar: 'احجز من واتساب' },
    ctaMessage: { en: 'Send a Message', ar: 'ابعت رسالة' },
    scheduleLabel: { en: 'The Timeline', ar: 'الجدول الزمني' },
    scheduleTitle: { en: 'Weekly Schedule', ar: 'الجدول الأسبوعي للدار' },
    scheduleSub: { en: 'Discover our daily rhythm. From active mornings to deep nights.', ar: 'اكتشف إيقاعنا اليومي. من الصباح النشيط إلى سهرات الليل.' },
    daylightTitle: { en: 'Daylight', ar: 'النهار' },
    middayTitle: { en: 'Midday', ar: 'منتصف اليوم' },
    nightlifeTitle: { en: 'Nightlife', ar: 'الليل' },
    detailedLabel: { en: 'Adventures', ar: 'مغامرات' },
    detailedTitle: { en: 'Past & Upcoming Expeditions', ar: 'رحلاتنا وتجاربنا الاستثنائية' },
    detailedSub: { en: 'Deep dive into what we do when we leave the hostel walls.', ar: 'تعمق في اللي بنعمله لما نخرج بره جدران الدار.' },
    priceReveal: { en: 'Hold to reveal price', ar: 'اضغط لعرض السعر' },
  };

  /** Get translated text */
  t(key: string): string {
    const map = this.i18n[key];
    return map ? (map[this.lang] || map['en'] || '') : key;
  }

  constructor(
    private blogService: BlogService,
    private serviceService: ServiceService,
    private imageService: ImageService,
    public ts: TranslationService,
    private el: ElementRef,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit() {
    this.setSEO();
    this.loadFeaturedContent();
    this.startSlideshow();
    this.startCountdowns();
    this.startWordRotation();
  }

  private setSEO() {
    const isAr = this.ts.current === 'ar';
    this.titleService.setTitle(
      isAr
        ? 'دار البدوي — هوستل دهب، جنوب سيناء، مصر'
        : 'Dar El-Badawi — Sinai Hostel in Dahab, Egypt'
    );
    this.metaService.updateTag({
      name: 'description',
      content: isAr
        ? 'دار البدوي — تجربة دهب الأصيلة. حفلات شواء، رحلات جبلية، موسيقى بدوية، تطوع ومغامرة في جنوب سيناء. احجز الآن عبر واتساب.'
        : 'Dar El-Badawi — Dahab\'s most authentic hostel. BBQ nights, mountain hikes, Bedouin music, volunteering & adventure in South Sinai, Egypt.'
    });
    this.metaService.updateTag({ property: 'og:title', content: isAr ? 'دار البدوي — قصتك في سيناء تبدأ هنا' : 'Dar El-Badawi — Your Sinai Story Starts Here' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://bedouin.dar' });
  }

  ngAfterViewInit() {
    this.initScrollReveal();
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
    clearInterval(this.countdownInterval);
    clearInterval(this.wordInterval);
  }

  private loadFeaturedContent() {
    // Fetch all then slice to avoid potential limit() composite index issues on Firebase
    this.blogService.getBlogPosts().subscribe(posts => {
      if (posts && posts.length > 0) {
        this.featuredBlogPosts = posts.slice(0, 3);
      } else {
        // Show mock posts if DB is empty so the section doesn't disappear
        this.featuredBlogPosts = [
          { id: '1', title: 'The Magic of Sinai Mountains', slug: 'magic-sinai', excerpt: 'Discover the hidden valleys and secret hiking trails that only the locals know about. A journey to the heart of the desert...', author: 'Dar El-Badawi', publishedAt: new Date(), updatedAt: new Date(), tags: [], featuredImage: 'assets/images/cover.jpg', content: '', isPublished: true },
          { id: '2', title: 'Why Volunteering Changed My Life', slug: 'volunteering-life', excerpt: 'A story from one of our guests who originally came for a weekend but ended up staying for a month to help build the palm oasis...', author: 'Sarah J.', publishedAt: new Date(), updatedAt: new Date(), tags: [], featuredImage: 'assets/images/cover2.jpg', content: '', isPublished: true },
          { id: '3', title: 'Bedouin Tea Protocol', slug: 'tea-protocol', excerpt: 'There is a whole language behind pouring tea in the desert. We explain the traditions, the herbs, and why you never fill the cup to the top...', author: 'Dar El-Badawi', publishedAt: new Date(), updatedAt: new Date(), tags: [], featuredImage: 'assets/images/cover3.jpg', content: '', isPublished: true }
        ];
      }
      setTimeout(() => this.initScrollReveal(), 100);
    });

    this.serviceService.getServices().subscribe(services => {
      this.featuredServices = services.slice(0, 3);
      this.isLoading = false;
    });

    this.imageService.getImagesByCategory(ImageCategory.HOSTEL).subscribe(images => {
      this.heroImages = images.slice(0, 4);
    });
  }

  private startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 5000);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  private startCountdowns() {
    this.updateCountdowns();
    this.countdownInterval = setInterval(() => this.updateCountdowns(), 1000);
  }

  private updateCountdowns() {
    const now = new Date().getTime();
    this.events.forEach(event => {
      const diff = event.date.getTime() - now;
      if (diff > 0) {
        this.countdowns[event.id] = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
      } else {
        this.countdowns[event.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    });
  }

  private startWordRotation() {
    this.wordInterval = setInterval(() => {
      this.currentWord = (this.currentWord + 1) % this.heroWords.length;
    }, 2500);
  }

  setActiveSpot(spot: SecretSpot | null) {
    this.activeSpot = spot;
  }

  private initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const elements = this.el.nativeElement.querySelectorAll('[data-reveal]');
    elements.forEach((el: Element) => observer.observe(el));
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
