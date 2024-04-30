import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from './models/language';

interface LanguageStrings {
  [key: string]: string;
}

interface StringResources {
  [key: string]: LanguageStrings;
}

@Injectable({
  providedIn: 'root',
})
export class Constants {
  constructor() {}

  languages: Language[] = [
    { name: 'English', emoji: '🇬🇧' },
    { name: 'Mandarin Chinese (Simplified)', emoji: '🇨🇳' },
    { name: 'Hindi', emoji: '🇮🇳' },
    { name: 'Spanish', emoji: '🇪🇸' },
    { name: 'French', emoji: '🇫🇷' },
    { name: 'Arabic', emoji: '🇸🇦' },
    { name: 'Bengali', emoji: '🇧🇩' },
    { name: 'Russian', emoji: '🇷🇺' },
    { name: 'Portuguese', emoji: '🇵🇹' },
    { name: 'Indonesian', emoji: '🇮🇩' },
  ];

  strings: StringResources = {
    generateStory: {
      English: 'Generate Story',
      'Mandarin Chinese (Simplified)': '生成故事',
      Hindi: 'कहानी उत्पन्न करें',
      Spanish: 'Generar historia',
      French: 'Générer une histoire',
      Arabic: 'توليد قصة',
      Bengali: 'গল্প তৈরি করুন',
      Russian: 'Создать историю',
      Portuguese: 'Gerar história',
      Indonesian: 'Hasilkan Cerita',
    },
    refreshBrowser: {
      English: 'Refresh for a new story',
      'Mandarin Chinese (Simplified)': '刷新浏览器以获取新故事',
      Hindi: 'नई कहानी के लिए ब्राउज़र रीफ़्रेश करें',
      Spanish: 'Refresca el navegador para obtener una nueva historia',
      French: 'Rafraîchir le navigateur pour une nouvelle histoire',
      Arabic: 'تحديث المتصفح للحصول على قصة جديدة',
      Bengali: 'নতুন গল্পের জন্য ব্রাউজার রিফ্রেশ করুন',
      Russian: 'Обновите браузер для новой истории',
      Portuguese: 'Atualize o navegador para uma nova história',
      Indonesian: 'Segarkan browser untuk cerita baru',
    },
    optionA: {
      English: 'Option A',
      'Mandarin Chinese (Simplified)': '选项A',
      Hindi: 'विकल्प A',
      Spanish: 'Opción A',
      French: 'Option A',
      Arabic: 'الخيار A',
      Bengali: 'অপশন A',
      Russian: 'Опция A',
      Portuguese: 'Opção A',
      Indonesian: 'Opsi A',
    },
    optionB: {
      English: 'Option B',
      'Mandarin Chinese (Simplified)': '选项B',
      Hindi: 'विकल्प B',
      Spanish: 'Opción B',
      French: 'Option B',
      Arabic: 'الخيار B',
      Bengali: 'অপশন B',
      Russian: 'Опция B',
      Portuguese: 'Opção B',
      Indonesian: 'Opsi B',
    },
    chapter: {
      English: 'Chapter',
      'Mandarin Chinese (Simplified)': '章',
      Hindi: 'अध्याय',
      Spanish: 'Capítulo',
      French: 'Chapitre',
      Arabic: 'الفصل',
      Bengali: 'অধ্যায়',
      Russian: 'Глава',
      Portuguese: 'Capítulo',
      Indonesian: 'Bab',
    },
    play: {
      English: 'Play',
      'Mandarin Chinese (Simplified)': '播放',
      Hindi: 'चलाएं',
      Spanish: 'Reproducir',
      French: 'Jouer',
      Arabic: 'تشغيل',
      Bengali: 'চালান',
      Russian: 'Воспроизвести',
      Portuguese: 'Reproduzir',
      Indonesian: 'Putar',
    },
    welcome: {
      English: 'Welcome',
      'Mandarin Chinese (Simplified)': '欢迎',
      Hindi: 'स्वागत है',
      Spanish: 'Bienvenido',
      French: 'Bienvenue',
      Arabic: 'أهلاً وسهلاً',
      Bengali: 'স্বাগতম',
      Russian: 'Добро пожаловать',
      Portuguese: 'Bem-vindo',
      Indonesian: 'Selamat datang',
    },
    preparingYourLiteraryJourney: {
      English: 'Preparing your literary journey...',
      'Mandarin Chinese (Simplified)': '准备您的文学之旅...',
      Hindi: 'आपकी साहित्यिक यात्रा तैयार कर रहे हैं...',
      Spanish: 'Preparando tu viaje literario...',
      French: 'Préparation de votre voyage littéraire...',
      Arabic: 'إعداد رحلتك الأدبية...',
      Bengali: 'আপনার সাহিত্যিক যাত্রা প্রস্তুত হচ্ছে...',
      Russian: 'Подготовка вашего литературного путешествия...',
      Portuguese: 'Preparando sua jornada literária...',
      Indonesian: 'Menyiapkan perjalanan sastra Anda...',
    },
    generatingStoryline: {
      English: 'Generating storyline...',
      'Mandarin Chinese (Simplified)': '生成故事情节...',
      Hindi: 'कहानी उत्पन्न कर रहे हैं...',
      Spanish: 'Generando argumento...',
      French: "Génération de l'intrigue...",
      Arabic: 'توليد القصة...',
      Bengali: 'গল্পের কাহিনী তৈরি করা হচ্ছে...',
      Russian: 'Создание сюжета...',
      Portuguese: 'Gerando enredo...',
      Indonesian: 'Menghasilkan alur cerita...',
    },
    warmingUpTheNarrator: {
      English: 'Warming up the narrator...',
      'Mandarin Chinese (Simplified)': '预热叙述者...',
      Hindi: 'नैरेटर को गरम कर रहे हैं...',
      Spanish: 'Calentando al narrador...',
      French: 'Échauffement du narrateur...',
      Arabic: 'تحمية الراوي...',
      Bengali: 'ন্যারেটর উষ্ণ করা হচ্ছে...',
      Russian: 'Разогрев нарратора...',
      Portuguese: 'Aquecendo o narrador...',
      Indonesian: 'Memanaskan narator...',
    },
    generatingAudio: {
      English: 'Generating audio...',
      'Mandarin Chinese (Simplified)': '生成音频...',
      Hindi: 'ऑडियो उत्पन्न कर रहे हैं...',
      Spanish: 'Generando audio...',
      French: "Génération de l'audio...",
      Arabic: 'توليد الصوت...',
      Bengali: 'অডিও তৈরি করা হচ্ছে...',
      Russian: 'Создание аудио...',
      Portuguese: 'Gerando áudio...',
      Indonesian: 'Menghasilkan audio...',
    },
    sprinklingSomeFairyDust: {
      English: 'Sprinkling some fairy dust...',
      'Mandarin Chinese (Simplified)': '撒些仙女粉...',
      Hindi: 'परी की धूल छिड़क रहे हैं...',
      Spanish: 'Espolvoreando polvo de hadas...',
      French: 'Saupoudrage de poussière de fée...',
      Arabic: 'رش بعض غبار الجنية...',
      Bengali: 'কিছু পরীর ধুলো ছড়ানো হচ্ছে...',
      Russian: 'Посыпание волшебной пылью...',
      Portuguese: 'Espalhando pó de fada...',
      Indonesian: 'Menaburkan debu peri...',
    },
    tuningIntoTheFrequencyOfAdventure: {
      English: 'Tuning into the frequency of adventure...',
      'Mandarin Chinese (Simplified)': '调整到冒险的频率...',
      Hindi: 'साहसिक कार्य की फ्रीक्वेंसी में ट्यून कर रहे हैं...',
      Spanish: 'Sintonizando la frecuencia de la aventura...',
      French: "Se caler sur la fréquence de l'aventure...",
      Arabic: 'التناغم مع تردد المغامرة...',
      Bengali: 'অ্যাডভেঞ্চারের ফ্রিকোয়েন্সিতে টিউনিং করা হচ্ছে...',
      Russian: 'Настройка на частоту приключений...',
      Portuguese: 'Sintonizando na frequência da aventura...',
      Indonesian: 'Menyetem ke frekuensi petualangan...',
    },
    brewingUpSomeEpicTales: {
      English: 'Brewing up some epic tales...',
      'Mandarin Chinese (Simplified)': '酝酿一些史诗般的故事...',
      Hindi: 'कुछ महाकाव्य कथाएँ तैयार कर रहे हैं...',
      Spanish: 'Cocinando algunos cuentos épicos...',
      French: 'Préparation de quelques récits épiques...',
      Arabic: 'يخمر بعض الحكايات الملحمية...',
      Bengali: 'কিছু মহাকাব্যিক গল্প বানানো হচ্ছে...',
      Russian: 'Завариваем эпические истории...',
      Portuguese: 'Preparando alguns contos épicos...',
      Indonesian: 'Meracik beberapa cerita epik...',
    },
    queuingTheSuspense: {
      English: 'Queuing the suspense...',
      'Mandarin Chinese (Simplified)': '排队等候悬疑...',
      Hindi: 'सस्पेंस को कतार में लगा रहे हैं...',
      Spanish: 'En cola para el suspense...',
      French: "Mise en file d'attente du suspense...",
      Arabic: 'تصف الإثارة...',
      Bengali: 'সাসপেন্স সারিবদ্ধ করা হচ্ছে...',
      Russian: 'Строим очередь на напряжение...',
      Portuguese: 'Enfileirando o suspense...',
      Indonesian: 'Mengantri ketegangan...',
    },
  };
}