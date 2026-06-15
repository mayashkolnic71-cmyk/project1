import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Link as LinkIcon, User, CreditCard, Printer, UploadCloud, FileText, X, Bot, Activity, Award, Target, Lightbulb, BookOpen } from 'lucide-react';

const COURSES = [
  "ניהול סיכונים ובטיחות המטופל בגריאטריה",
  "אתיקה מקצועית ומשפט רפואי",
  "מבוא למערכות מידע ברפואה",
  "ניהול איכות ברפואה מונעת"
];

const DigitalSubmission = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    courseName: '',
    fullName: '',
    idNumber: '',
    urls: ['', '', ''],
    files: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Load Confetti
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      if(document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const triggerConfetti = () => {
    if (window.confetti) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        window.confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#4f46e5', '#a855f7', '#ec4899']
        });
        window.confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4f46e5', '#a855f7', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...formData.urls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, urls: newUrls }));
    if (index === 0 && errors.mainUrl) setErrors(prev => ({ ...prev, mainUrl: null }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (formData.files.length + selectedFiles.length > 3) {
      setErrors(prev => ({ ...prev, files: 'ניתן לצרף עד 3 מסמכים בלבד' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }));
    setErrors(prev => ({ ...prev, files: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
    setErrors(prev => ({ ...prev, files: null }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.courseName) newErrors.courseName = 'חובה לבחור קורס מרשימת הקורסים';
    if (!formData.fullName.trim()) newErrors.fullName = 'שם מלא הוא שדה חובה';
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'תעודת זהות היא שדה חובה';
    } else if (!/^\d{8,9}$/.test(formData.idNumber.trim())) {
      newErrors.idNumber = 'תעודת זהות חייבת להכיל 8-9 ספרות';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    const hasMainUrl = formData.urls[0].trim().length > 0;
    const hasFiles = formData.files.length > 0;
    
    if (!hasMainUrl && !hasFiles) {
      newErrors.mainUrl = 'חובה להזין קישור ראשי או לצרף לפחות מסמך אחד';
    } else if (hasMainUrl && !urlPattern.test(formData.urls[0].trim())) {
      newErrors.mainUrl = 'אנא הזן כתובת URL תקינה';
    }
    
    if (formData.files.length > 3) {
      newErrors.files = 'ניתן לצרף מקסימום 3 מסמכים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (step === 1 && validateStep1()) setStep(2); };
  const prevStep = () => { if (step === 2) setStep(1); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 2 && validateStep2()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsAnalyzing(true);
        setStep('analyzing');
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setTimestamp(new Date());
          setStep(3);
          triggerConfetti(); // Trigger fireworks and confetti!
        }, 3500);
      }, 1000);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const renderProgressBar = () => {
    if (step === 'analyzing' || step === 3) return null;
    const progress = step === 1 ? 50 : 100;
    return (
      <div className="w-full mb-8" dir="rtl">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-slate-600">
          <span>שלב {step} מתוך 2</span>
          <span>{progress}% הושלמו</span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-l from-indigo-600 to-purple-500 rounded-full transition-all duration-700 ease-in-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };

  const feedbackData = [
    {
      id: 1,
      title: 'רלוונטיות מקצועית וקלינית',
      score: 9,
      text: 'העבודה מציגה הבנה מעמיקה של האתגרים בשטח ומתייחסת לתרחישי אמת בצורה מדויקת וראויה לשבח. ניכרת יכולת קישור גבוהה בין התיאוריה לפרקטיקה.',
      icon: <Activity className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 2,
      title: 'מבנה ומתודולוגיה',
      score: 8,
      text: 'המבנה הלוגי ברור והטיעונים מוצגים בסדר מופתי. עם זאת, ניתן היה להרחיב מעט יותר את סקירת הספרות המקצועית לביסוס חלק מהטענות המרכזיות.',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />
    },
    {
      id: 3,
      title: 'חדשנות ושימוש בכלים',
      score: 10,
      text: 'שימוש יוצא דופן ומרשים בכלים טכנולוגיים לשם ייעול התהליכים ושיפור הבטיחות. ניכרת חשיבה מחוץ לקופסה ושילוב חדשנות דיגיטלית במיטבה.',
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />
    },
    {
      id: 4,
      title: 'חשיבה ביקורתית ורפלקציה',
      score: 9,
      text: 'הניתוח משקף יכולת רפלקציה גבוהה והסקת מסקנות אופרטיבית שניתן ליישם באופן מיידי בקליניקה, תוך בחינת אלטרנטיבות שונות.',
      icon: <Target className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div 
      dir="rtl" 
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6"
      style={{ fontFamily: "'Heebo', sans-serif" }}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`w-full ${step === 3 ? 'max-w-4xl' : 'max-w-2xl'} bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 z-10 transition-all duration-700 hover:shadow-indigo-500/10`}>
        
        {step !== 3 && step !== 'analyzing' && (
          <div className="bg-gradient-to-l from-indigo-600 via-purple-600 to-indigo-800 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-8 h-8 text-indigo-200" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">FeedbackAI</h1>
            </div>
            <p className="text-indigo-100 text-lg opacity-90 font-light">עוזר ההערכה האקדמי שלך</p>
          </div>
        )}

        <div className="p-8 sm:p-10">
          {renderProgressBar()}

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-500">
                
                <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                    בחירת קורס להגשה
                  </h2>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      בחר את הקורס שאליו תרצה להגיש את העבודה: <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.courseName}
                      onChange={(e) => handleInputChange('courseName', e.target.value)}
                      className={`block w-full px-4 py-3 bg-slate-50 border ${errors.courseName ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm text-slate-700 font-medium`}
                    >
                      <option value="" disabled>-- לחץ לבחירת קורס מהרשימה --</option>
                      {COURSES.map((course, idx) => (
                        <option key={idx} value={course}>{course}</option>
                      ))}
                      <option value="other">קורס אחר (הזנה ידנית)</option>
                    </select>
                    {errors.courseName && <p className="mt-1.5 text-sm text-rose-500">{errors.courseName}</p>}
                  </div>
                  
                  {formData.courseName === 'other' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">שם הקורס:</label>
                      <input 
                        type="text" 
                        onChange={(e) => handleInputChange('customCourse', e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        placeholder="הקלד את שם הקורס..."
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <User className="w-6 h-6 text-indigo-500" />
                    פרטים אישיים
                  </h2>
                  
                  <div className="space-y-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        שם מלא <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <User className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className={`block w-full pr-11 pl-4 py-3 bg-slate-50 border ${errors.fullName ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                          placeholder="ישראל ישראלי"
                        />
                      </div>
                      {errors.fullName && <p className="mt-1.5 text-sm text-rose-500">{errors.fullName}</p>}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        מספר תעודת זהות <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <CreditCard className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={formData.idNumber}
                          onChange={(e) => handleInputChange('idNumber', e.target.value)}
                          className={`block w-full pr-11 pl-4 py-3 bg-slate-50 border ${errors.idNumber ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                          placeholder="123456789"
                        />
                      </div>
                      {errors.idNumber && <p className="mt-1.5 text-sm text-rose-500">{errors.idNumber}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                  >
                    המשך לשלב ההגשה
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-3 mb-6 bg-indigo-50 text-indigo-800 p-3 rounded-lg border border-indigo-100 font-medium text-sm">
                  <BookOpen className="w-5 h-5" />
                  הגשה עבור קורס: <span className="font-bold">{formData.courseName === 'other' ? formData.customCourse : formData.courseName}</span>
                </div>

                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-indigo-500" />
                  חומרי הפרויקט
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      צירוף קבצי עבודה (PDF/DOC) - עד 3 קבצים מקסימום
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${formData.files.length >= 3 ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer'}`}
                      onClick={() => formData.files.length < 3 && fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={formData.files.length >= 3}
                      />
                      <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-1">לחץ לבחירת מסמכים או גרור לכאן</p>
                      <p className="text-xs text-slate-400">({formData.files.length}/3 קבצים נבחרו)</p>
                    </div>
                    {errors.files && <p className="mt-2 text-sm text-rose-500">{errors.files}</p>}

                    {formData.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                              <span className="text-sm text-slate-700 truncate dir-ltr">{file.name}</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile(idx)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center"><span className="px-3 bg-white text-sm text-slate-400">וגם / או צירוף קישורים</span></div>
                  </div>

                  <div className="space-y-4">
                    {formData.urls.map((url, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {index === 0 ? <span>קישור ראשי {formData.files.length === 0 && <span className="text-rose-500">*</span>}</span> : <span>קישור נוסף {index} <span className="text-slate-400">(רשות)</span></span>}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <LinkIcon className={`w-5 h-5 ${index === 0 ? 'text-indigo-400' : 'text-slate-300'}`} />
                          </div>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                            className={`block w-full pr-11 pl-4 py-3 bg-white border ${index === 0 && errors.mainUrl ? 'border-rose-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500`}
                            placeholder="https://..."
                            dir="ltr"
                          />
                        </div>
                        {index === 0 && errors.mainUrl && <p className="mt-1.5 text-sm text-rose-500">{errors.mainUrl}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-slate-100 mt-6">
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 px-4 py-2 font-medium">
                    <ChevronRight className="w-5 h-5" />
                    חזור
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <><svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>מעבד נתונים...</>
                    ) : (
                      <>שלח להערכת FeedbackAI <Bot className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Analyzing Animation State */}
          {step === 'analyzing' && (
            <div className="py-16 text-center animate-in zoom-in-95 duration-500">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-2 bg-purple-500 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 bg-white rounded-full shadow-xl">
                  <Bot className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">FeedbackAI מנתח את ההגשה...</h2>
              <p className="text-slate-500 max-w-md mx-auto">המערכת בודקת את הרלוונטיות המקצועית, המבנה הלוגי, והשימוש בכלים הדיגיטליים עבור הקורס הנבחר.</p>
              
              <div className="mt-8 w-64 mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full animate-pulse" style={{width: '100%', animationDuration: '1.5s'}}></div>
              </div>
            </div>
          )}

          {/* Step 3: Output Format / Report */}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-700 relative">
              
              {/* Header / Success Banner */}
              <div className="text-center mb-10 pb-8 border-b border-slate-100 print:border-none print:mb-6 print:pb-0">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500 mb-6 shadow-inner relative">
                  <div className="absolute inset-0 rounded-full border-4 border-green-500/20"></div>
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 print:text-black">
                  🎉 פרויקט הגמר התקבל בהצלחה!
                </h1>
                <p className="text-lg text-slate-500">דוח משוב אוטומטי מבוסס AI הופק עבור ההגשה שלך.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Right Column: Receipt info */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm print:border-slate-300 print:bg-transparent">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      📄 אישור הגשה דיגיטלי
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">שם הסטודנט/ית</p>
                        <p className="font-semibold text-slate-800">{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">תעודת זהות</p>
                        <p className="font-semibold text-slate-800">{formData.idNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">שם הקורס</p>
                        <p className="font-semibold text-slate-800">
                          {formData.courseName === 'other' ? formData.customCourse : formData.courseName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">מועד הגשה</p>
                        <p className="font-semibold text-slate-800" dir="ltr" style={{textAlign: 'right'}}>
                          {timestamp?.toLocaleDateString('he-IL')} {timestamp?.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">קישורים/קבצים שנקלטו</p>
                        <ul className="space-y-2">
                          {formData.files.map((file, i) => (
                            <li key={`file-${i}`} className="flex items-start gap-2 text-sm text-slate-700">
                              <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span className="truncate dir-ltr" title={file.name}>{file.name}</span>
                            </li>
                          ))}
                          {formData.urls.filter(u => u.trim() !== '').map((url, i) => (
                            <li key={`url-${i}`} className="flex items-start gap-2 text-sm">
                              <LinkIcon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate dir-ltr" title={url}>
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Column: Evaluation Report */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-2xl border-2 border-indigo-50 p-8 shadow-md relative overflow-hidden print:shadow-none print:border-slate-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-10"></div>
                    
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <Bot className="w-7 h-7 text-indigo-500" />
                      📊 דוח משוב והערכה ראשוני <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-md ml-auto">Feedback Report</span>
                    </h2>

                    <div className="space-y-6">
                      {feedbackData.map((item, index) => (
                        <div key={item.id} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                              {index + 1}. {item.title}
                            </h3>
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                              <span className="text-sm font-medium text-slate-500">ציון:</span>
                              <span className={`font-bold text-lg ${item.score >= 9 ? 'text-green-600' : 'text-amber-600'}`}>{item.score}/10</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4 shadow-sm group-hover:shadow-md transition-shadow group-hover:border-indigo-100">
                            <div className="mt-0.5 bg-slate-50 p-2 rounded-lg">{item.icon}</div>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                      <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        🎯 שורה תחתונה ונקודות לשיפור:
                      </h3>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        פרויקט מצוין שמעיד על הבנה עמוקה של החומר. מומלץ להמשיך להעמיק במחקרים עדכניים כדי לחזק עוד יותר את הבסיס התיאורטי. עבודה יפה מאוד! המשך כך.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              <div className="mt-10 flex justify-center gap-4 print:hidden">
                <button
                  onClick={printReceipt}
                  className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 text-slate-700 px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow"
                >
                  <Printer className="w-5 h-5" />
                  הדפס או שמור כ-PDF
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({ courseName: '', fullName: '', idNumber: '', urls: ['', '', ''], files: [] });
                    setTimestamp(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 px-6 py-3.5 rounded-xl font-medium transition-colors hover:bg-slate-100"
                >
                  הגשה חדשה
                </button>
              </div>
              
              <div className="mt-8 text-center text-slate-400 text-sm pb-8">
                מופק על ידי מערכת FeedbackAI האוטומטית © {new Date().getFullYear()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalSubmission;
