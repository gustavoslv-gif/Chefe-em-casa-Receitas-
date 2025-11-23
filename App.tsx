
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Book, ChefHat, Clock, Globe, Image as ImageIcon, Menu, Moon, Save, Search, Sun, Trash2, User, X, Volume2, VolumeX, Smartphone, Zap, Utensils, AlertTriangle, Scale, Thermometer, Plus } from 'lucide-react';
import { generateRecipes, generateRecipeImage } from './services/gemini';
import { ImageSize, Recipe, View, UserProfile, Language, SkillLevel, MeasurementSystem } from './types';

// --- Translations ---

const TRANSLATIONS = {
  en: {
    subtitle: "Cook with what you have 🍽️",
    myIngredients: "My Ingredients",
    placeholder: "e.g., chicken breast, rice, tomato, onion...",
    imageQuality: "Image Quality (Nano Banana Pro)",
    generate: "Generate Recipes",
    thinking: "Chef is thinking...",
    library: "Library",
    profile: "Profile",
    suggestions: "Suggestions",
    cookbook: "My Cookbook",
    noRecipes: "No recipes found here yet.",
    goCreate: "Go create some!",
    generateImg: "Generate Photo",
    generating: "Creating...",
    prepTime: "30m", // Default fallback
    remove: "Remove",
    step: "Step",
    ingredientsNeeded: "Ingredients Needed",
    back: "Back",
    next: "Next Step",
    finish: "Finish",
    
    // Search
    searchPlaceholder: "Search recipes...",
    searchSaved: "Search saved recipes...",
    
    // Exit Confirmation
    exitConfirmTitle: "Stop Cooking?",
    exitConfirmMessage: "You will lose your current progress. Are you sure you want to leave?",
    stay: "Stay Cooking",
    leave: "Leave",
    
    // Profile Sections
    secPersonal: "Personal Info",
    secKitchen: "My Kitchen",
    secHealth: "Diet & Health",
    secPrefs: "Tastes & Regions",
    secApp: "App Settings",
    
    labelName: "Your Name",
    labelSkill: "Cooking Skill",
    labelUnits: "Measurement System",
    labelAppliances: "Appliances I Have",
    labelAllergies: "Allergies (Avoid)",
    otherAllergy: "Other Allergy (Type & Add)",
    dietType: "Dietary Type",
    cuisines: "Favorite Cuisines",
    regions: "Brazil Regions",
    
    soundEffects: "Sound Effects",
    hapticFeedback: "Vibration / Haptics",
    savePref: "Save Profile",
    saveSuccess: "Recipe saved to Library!",
    errorGen: "Failed to generate recipes. Please try again.",
    errorImg: "Failed to generate image. Please ensure you selected a valid API Key.",
    
    select: {
      standard: "1K (Standard)",
      high: "2K (High Res)",
      ultra: "4K (Ultra HD)"
    },
    skills: {
      'Beginner': 'Beginner',
      'Intermediate': 'Intermediate',
      'Advanced': 'Advanced / Chef'
    },
    units: {
      'Metric': 'Metric (g, ml)',
      'Imperial': 'Imperial (oz, cups)'
    },
    diets: {
      'None': 'None',
      'Vegetarian': 'Vegetarian',
      'Vegan': 'Vegan',
      'Low Carb': 'Low Carb',
      'Gluten Free': 'Gluten Free',
      'Lactose Free': 'Lactose Free'
    },
    allergiesList: {
      'Peanuts': 'Peanuts',
      'Dairy': 'Dairy',
      'Eggs': 'Eggs',
      'Shellfish': 'Shellfish',
      'Soy': 'Soy',
      'Gluten': 'Gluten',
      'Tree Nuts': 'Tree Nuts'
    },
    appliancesList: {
      'Blender': 'Blender',
      'Air Fryer': 'Air Fryer',
      'Oven': 'Oven',
      'Microwave': 'Microwave',
      'Stove': 'Stove',
      'Mixer': 'Mixer',
      'Pressure Cooker': 'Pressure Cooker'
    },
    countries: {
      'Brazil': 'Brazil',
      'Italy': 'Italy',
      'Japan': 'Japan',
      'USA': 'USA',
      'France': 'France',
      'Mexico': 'Mexico',
      'India': 'India',
      'China': 'China'
    },
    brRegions: {
      'North': 'North',
      'Northeast': 'Northeast',
      'Center-West': 'Center-West',
      'Southeast': 'Southeast',
      'South': 'South'
    }
  },
  pt: {
    subtitle: "Cozinhe com o que você tem 🍽️",
    myIngredients: "Meus Ingredientes",
    placeholder: "Ex.: frango, arroz, tomate, cebola...",
    imageQuality: "Qualidade da Imagem (Nano Banana Pro)",
    generate: "Gerar Receitas",
    thinking: "Chef está pensando...",
    library: "Biblioteca",
    profile: "Perfil",
    suggestions: "Sugestões",
    cookbook: "Livro de Receitas",
    noRecipes: "Nenhuma receita encontrada aqui ainda.",
    goCreate: "Vá criar algumas!",
    generateImg: "Gerar Foto",
    generating: "Criando...",
    prepTime: "30m",
    remove: "Remover",
    step: "Passo",
    ingredientsNeeded: "Ingredientes Necessários",
    back: "Voltar",
    next: "Próximo Passo",
    finish: "Concluir",

    // Search
    searchPlaceholder: "Buscar receitas...",
    searchSaved: "Buscar receitas salvas...",

    // Exit Confirmation
    exitConfirmTitle: "Sair do Modo Cozinha?",
    exitConfirmMessage: "Você perderá seu progresso atual. Tem certeza que deseja sair?",
    stay: "Continuar",
    leave: "Sair",

    // Profile Sections
    secPersonal: "Informações Pessoais",
    secKitchen: "Minha Cozinha",
    secHealth: "Dieta e Saúde",
    secPrefs: "Gostos e Regiões",
    secApp: "Configurações do App",

    labelName: "Seu Nome",
    labelSkill: "Nível na Cozinha",
    labelUnits: "Sistema de Medidas",
    labelAppliances: "Eletrodomésticos",
    labelAllergies: "Alergias (Evitar)",
    otherAllergy: "Outra Alergia (Digite e adicione)",
    dietType: "Tipo de Dieta",
    cuisines: "Culinárias Favoritas",
    regions: "Regiões do Brasil",
    
    soundEffects: "Efeitos Sonoros",
    hapticFeedback: "Vibração",
    savePref: "Salvar Perfil",
    saveSuccess: "Receita salva na Biblioteca!",
    errorGen: "Falha ao gerar receitas. Tente novamente.",
    errorImg: "Falha ao gerar imagem. Verifique sua chave de API.",
    
    select: {
      standard: "1K (Padrão)",
      high: "2K (Alta Res)",
      ultra: "4K (Ultra HD)"
    },
    skills: {
      'Beginner': 'Iniciante',
      'Intermediate': 'Intermediário',
      'Advanced': 'Avançado / Chef'
    },
    units: {
      'Metric': 'Métrico (g, ml)',
      'Imperial': 'Imperial (oz, xíc)'
    },
    diets: {
      'None': 'Nenhuma',
      'Vegetarian': 'Vegetariana',
      'Vegan': 'Vegana',
      'Low Carb': 'Low Carb',
      'Gluten Free': 'Sem Glúten',
      'Lactose Free': 'Sem Lactose'
    },
    allergiesList: {
      'Peanuts': 'Amendoim',
      'Dairy': 'Laticínios',
      'Eggs': 'Ovos',
      'Shellfish': 'Crustáceos',
      'Soy': 'Soja',
      'Gluten': 'Glúten',
      'Tree Nuts': 'Nozes'
    },
    appliancesList: {
      'Blender': 'Liquidificador',
      'Air Fryer': 'Air Fryer',
      'Oven': 'Forno',
      'Microwave': 'Micro-ondas',
      'Stove': 'Fogão',
      'Mixer': 'Batedeira',
      'Pressure Cooker': 'Panela de Pressão'
    },
    countries: {
      'Brazil': 'Brasil',
      'Italy': 'Itália',
      'Japan': 'Japão',
      'USA': 'EUA',
      'France': 'França',
      'Mexico': 'México',
      'India': 'Índia',
      'China': 'China'
    },
    brRegions: {
      'North': 'Norte',
      'Northeast': 'Nordeste',
      'Center-West': 'Centro-Oeste',
      'Southeast': 'Sudeste',
      'South': 'Sul'
    }
  }
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  skillLevel: 'Beginner',
  measurementSystem: 'Metric',
  allergies: [],
  appliances: [],
  dietaryRestrictions: 'None',
  favoriteCuisines: [],
  favoriteRegions: [],
  soundEnabled: true,
  hapticEnabled: true
};

const App: React.FC = () => {
  // --- State ---
  const [language, setLanguage] = useState<Language>('pt');
  const [view, setView] = useState<View>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [ingredients, setIngredients] = useState("");
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize._1K);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [library, setLibrary] = useState<Recipe[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [searchQuery, setSearchQuery] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");
  
  // Cooking State
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const t = TRANSLATIONS[language];

  // --- Effects ---
  useEffect(() => {
    const savedLibrary = localStorage.getItem('chef_library');
    if (savedLibrary) setLibrary(JSON.parse(savedLibrary));
    
    const savedProfile = localStorage.getItem('chef_profile');
    if (savedProfile) {
      // Merge with default to ensure new fields exist if loading old data
      setProfile({...DEFAULT_PROFILE, ...JSON.parse(savedProfile)});
    }

    const savedTheme = localStorage.getItem('chef_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);

    const savedLang = localStorage.getItem('chef_lang');
    if (savedLang === 'en' || savedLang === 'pt') setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('chef_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('chef_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('chef_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('chef_lang', language);
  }, [language]);

  // --- Audio & Haptics System ---
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playClickSound = () => {
    if (!profile.soundEnabled) return;

    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft "Pop" sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  const triggerHaptic = () => {
    if (!profile.hapticEnabled) return;
    if (navigator.vibrate) {
      navigator.vibrate(15); // Short tick
    }
  };

  const triggerFeedback = () => {
    playClickSound();
    triggerHaptic();
  };

  // --- Navigation Wrapper ---
  const changeView = (newView: View) => {
    triggerFeedback();
    if (newView !== 'library') {
      setSearchQuery('');
    }
    setView(newView);
  };

  const attemptExitCooking = () => {
    triggerFeedback();
    setShowExitConfirm(true);
  };

  const confirmExitCooking = () => {
    triggerFeedback();
    setShowExitConfirm(false);
    // Return to where we came from, usually 'results' or 'library' depending on logic, 
    // but defaulting to 'results' if coming from generation, or 'library' if opened from there is tricky without nav stack.
    // For now, if it was in library, it goes back to home, if results, results. 
    // Simplified: Go back to 'results' if we have a list, else home.
    if (recipes.length > 0) {
      changeView('results');
    } else {
      changeView('library');
    }
  };

  // --- Handlers ---

  const handleGenerateRecipes = async () => {
    triggerFeedback();
    if (!ingredients.trim()) return;
    
    setIsLoading(true);
    try {
      const generated = await generateRecipes(ingredients, profile, language);
      setRecipes(generated);
      setView('results'); // Don't trigger feedback again for view change
    } catch (e) {
      console.error(e);
      alert(t.errorGen);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      triggerFeedback();
    }
    
    setGeneratingImageId(recipe.id);
    try {
      const imageUrl = await generateRecipeImage(recipe, imageSize);
      
      // Update in recipes list
      setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, thumbnailUrl: imageUrl } : r));
      
      // Update in currently selected if matches
      if (selectedRecipe && selectedRecipe.id === recipe.id) {
        setSelectedRecipe(prev => prev ? { ...prev, thumbnailUrl: imageUrl } : null);
      }

      // Update in library if exists
      setLibrary(prev => prev.map(r => r.id === recipe.id ? { ...r, thumbnailUrl: imageUrl } : r));

    } catch (err) {
      console.error(err);
      alert(t.errorImg);
    } finally {
      setGeneratingImageId(null);
    }
  };

  const handleSaveToLibrary = (recipe: Recipe) => {
    triggerFeedback();
    if (!library.find(r => r.id === recipe.id)) {
      setLibrary([...library, recipe]);
    }
    alert(t.saveSuccess);
  };

  const handleRemoveFromLibrary = (id: string) => {
    triggerFeedback();
    setLibrary(prev => prev.filter(r => r.id !== id));
  };

  const navigateToRecipe = (recipe: Recipe) => {
    triggerFeedback();
    setSelectedRecipe(recipe);
    setActiveStepIndex(0);
    setView('cooking');
  };

  const toggleLanguage = () => {
    triggerFeedback();
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const toggleTheme = () => {
    triggerFeedback();
    setIsDarkMode(!isDarkMode);
  };

  const handleAddCustomAllergy = () => {
    if (!customAllergy.trim()) return;
    triggerFeedback();
    
    // Normalize case nicely
    const newAllergy = customAllergy.trim();
    
    if (!profile.allergies.includes(newAllergy)) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy]
      }));
    }
    setCustomAllergy("");
  };

  // --- Views ---

  // Header with Marsala Theme
  const renderHeader = (title: string, leftIcon?: React.ReactNode) => (
    <div className="sticky top-0 z-50 bg-primary/95 dark:bg-black/90 backdrop-blur-md shadow-md p-4 flex items-center justify-between border-b border-primary/20 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-3 text-white">
        {leftIcon}
        <h1 className="text-xl font-bold tracking-wide">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-black/20 dark:bg-white/10 border border-white/20 text-xs font-bold text-white hover:bg-white/20 transition-colors flex items-center gap-1"
        >
          <Globe size={14} />
          {language.toUpperCase()}
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white z-50 fixed inset-0">
        <div className="animate-spin mb-4 text-secondary">
          <ChefHat size={64} />
        </div>
        <h2 className="text-2xl font-serif font-medium animate-pulse text-white">{t.thinking}</h2>
      </div>
    );
  }

  // --- HOME VIEW ---
  if (view === 'home') {
    return (
      <div className="min-h-screen transition-colors duration-300">
        {renderHeader("Chef em Casa", <ChefHat className="text-secondary" />)}
        
        <main className="p-6 max-w-md mx-auto space-y-8 mt-8">
          <div className="text-center space-y-2 bg-white/90 dark:bg-black/80 p-6 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
            <h2 className="text-4xl font-bold text-primary dark:text-white font-serif tracking-tight">Chef em Casa</h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">{t.subtitle}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                 <label className="block text-sm font-bold text-white uppercase tracking-wide drop-shadow-md">
                  {t.myIngredients}
                </label>
              </div>
              
              <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full h-32 p-5 rounded-2xl border-0 bg-white/95 dark:bg-black/85 text-black dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-transparent outline-none resize-none shadow-lg transition-all text-lg font-light backdrop-blur-sm"
                />
            </div>

            <div className="bg-white/95 dark:bg-black/85 p-4 rounded-2xl shadow-lg backdrop-blur-sm">
              <label className="flex items-center gap-2 text-sm font-bold text-primary dark:text-secondary mb-2 uppercase tracking-wide">
                 <ImageIcon size={16} /> {t.imageQuality}
              </label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value as ImageSize)}
                className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value={ImageSize._1K}>{t.select.standard}</option>
                <option value={ImageSize._2K}>{t.select.high}</option>
                <option value={ImageSize._4K}>{t.select.ultra}</option>
              </select>
            </div>

            {/* Quick Search Bar */}
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <input 
                  type="text"
                  placeholder={t.searchSaved}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      triggerFeedback();
                      changeView('library');
                    }
                  }}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/95 dark:bg-black/85 border-0 text-black dark:text-white shadow-lg placeholder-gray-400 focus:ring-2 focus:ring-primary/50 dark:focus:ring-secondary/50 outline-none backdrop-blur-sm transition-all"
                />
                 {searchQuery.trim() && (
                  <button 
                    onClick={() => { triggerFeedback(); changeView('library'); }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-secondary/20 hover:bg-secondary text-primary dark:text-secondary dark:hover:text-primary rounded-full transition-colors active:scale-95"
                  >
                    <ArrowRight size={18} />
                  </button>
                )}
             </div>

            <button
              onClick={handleGenerateRecipes}
              disabled={!ingredients.trim()}
              className="w-full bg-primary hover:bg-[#8B2630] text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xl border border-white/10 active:scale-95"
            >
              <span>{t.generate}</span>
              <span className="text-xl">✨</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => changeView('library')}
              className="flex flex-col items-center justify-center p-6 bg-white/95 dark:bg-black/85 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-black transition-all group backdrop-blur-sm active:scale-95"
            >
              <Book className="text-primary dark:text-secondary group-hover:scale-110 transition-transform mb-3" size={32} />
              <span className="font-bold text-black dark:text-white">{t.library}</span>
            </button>
            <button
              onClick={() => changeView('profile')}
              className="flex flex-col items-center justify-center p-6 bg-white/95 dark:bg-black/85 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-black transition-all group backdrop-blur-sm active:scale-95"
            >
              <User className="text-primary dark:text-secondary group-hover:scale-110 transition-transform mb-3" size={32} />
              <span className="font-bold text-black dark:text-white">{t.profile}</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --- RESULTS & LIBRARY VIEWS (Shared Card List) ---
  if (view === 'results' || view === 'library') {
    let list = view === 'results' ? recipes : library;

    // Search Filtering for Library
    if (view === 'library' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.ingredients.some(i => i.toLowerCase().includes(q)) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(q))
      );
    }

    return (
      <div className="min-h-screen transition-colors duration-300 pb-20">
        {renderHeader(
          view === 'results' ? t.suggestions : t.cookbook,
          <button onClick={() => changeView('home')} className="p-1 -ml-2 text-white hover:bg-white/10 rounded-full active:scale-95">
            <ArrowLeft />
          </button>
        )}

        {/* Search Bar (Only in Library) */}
        {view === 'library' && (
          <div className="px-4 mt-4 max-w-xl mx-auto">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary dark:group-focus-within:text-secondary transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/90 dark:bg-black/80 border border-transparent focus:border-primary/50 dark:focus:border-secondary/50 text-black dark:text-white outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 shadow-lg backdrop-blur-sm transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => { triggerFeedback(); setSearchQuery(''); }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
             </div>
          </div>
        )}

        <main className="p-4 space-y-6 max-w-xl mx-auto mt-2">
          {list.length === 0 && (
            <div className="text-center text-white mt-20 p-8 bg-black/40 rounded-3xl backdrop-blur-md">
              <div className="mb-4 flex justify-center opacity-80">
                <ChefHat size={64} className="text-secondary" />
              </div>
              <p className="text-xl font-medium">
                {searchQuery ? t.noRecipes : (view === 'library' ? t.noRecipes : t.noRecipes)}
              </p>
              {view === 'library' && !searchQuery && (
                <button onClick={() => changeView('home')} className="mt-4 text-secondary font-bold hover:underline active:scale-95 transition-transform">{t.goCreate}</button>
              )}
            </div>
          )}

          {list.map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => navigateToRecipe(recipe)}
              className="bg-white/95 dark:bg-black/85 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 group backdrop-blur-sm"
            >
              <div className="relative h-60 bg-gray-200 dark:bg-gray-800 w-full overflow-hidden">
                {recipe.thumbnailUrl ? (
                  <img src={recipe.thumbnailUrl} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-400">
                    <ChefHat size={48} className="mb-2 opacity-30" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Image</span>
                  </div>
                )}
                
                {/* Generate Image Button Overlay */}
                {!recipe.thumbnailUrl && (
                   <button
                    onClick={(e) => handleGenerateImage(recipe, e)}
                    disabled={generatingImageId === recipe.id}
                    className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur flex items-center gap-2 transition-all border border-white/20 active:scale-95"
                  >
                    {generatingImageId === recipe.id ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <ImageIcon size={14} />
                    )}
                    {generatingImageId === recipe.id ? t.generating : `${t.generateImg}`}
                  </button>
                )}

                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10 shadow-lg">
                  <Clock size={12} className="text-secondary" />
                  {recipe.prepTime || t.prepTime}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-2xl text-primary dark:text-white mb-2 font-serif leading-tight">{recipe.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 font-bold uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  {recipe.cuisine || 'International'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.ingredients.slice(0, 3).map((ing, i) => (
                    <span key={i} className="text-xs font-semibold bg-gray-100 dark:bg-white/10 text-black dark:text-white px-3 py-1.5 rounded-md">
                      {ing}
                    </span>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-medium">+{recipe.ingredients.length - 3}</span>
                  )}
                </div>

                {view === 'library' && (
                   <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
                     <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromLibrary(recipe.id); }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95"
                     >
                       <Trash2 size={16} /> {t.remove}
                     </button>
                   </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // --- COOKING MODE VIEW ---
  if (view === 'cooking' && selectedRecipe) {
    const currentStep = selectedRecipe.steps[activeStepIndex];
    const progress = ((activeStepIndex + 1) / selectedRecipe.steps.length) * 100;

    return (
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        
        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-black border border-primary/20 dark:border-gray-800 rounded-3xl p-8 shadow-2xl max-w-xs w-full text-center relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
               
               <h3 className="text-xl font-bold text-primary dark:text-white mb-2 font-serif">{t.exitConfirmTitle}</h3>
               <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{t.exitConfirmMessage}</p>
               
               <div className="flex flex-col gap-3">
                 <button 
                    onClick={() => { triggerFeedback(); setShowExitConfirm(false); }}
                    className="w-full bg-secondary hover:bg-[#C9A675] text-primary dark:text-black font-bold py-3 rounded-xl transition-transform active:scale-95"
                 >
                   {t.stay}
                 </button>
                 <button 
                    onClick={confirmExitCooking}
                    className="w-full bg-transparent border-2 border-red-500/20 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
                 >
                   {t.leave}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Step Header */}
        <div className="sticky top-0 z-50 bg-primary/95 dark:bg-black/95 backdrop-blur shadow-md border-b border-primary/20 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={attemptExitCooking} className="p-2 hover:bg-white/10 rounded-full text-white active:scale-95">
              <ArrowLeft />
            </button>
            <div className="flex gap-3">
               {!selectedRecipe.thumbnailUrl && (
                  <button 
                    onClick={() => handleGenerateImage(selectedRecipe)}
                    disabled={generatingImageId === selectedRecipe.id}
                    className="p-2 hover:bg-white/10 rounded-full text-white active:scale-95"
                    title={t.generateImg}
                  >
                    {generatingImageId === selectedRecipe.id ? <span className="animate-spin">⌛</span> : <ImageIcon size={22} />}
                  </button>
               )}
              <button 
                onClick={() => handleSaveToLibrary(selectedRecipe)}
                className="p-2 hover:bg-white/10 rounded-full text-white active:scale-95"
              >
                <Save size={22} />
              </button>
            </div>
          </div>
          <div className="h-2 w-full bg-black/20 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(212,180,131,0.5)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-32 max-w-lg mx-auto w-full mt-4">
          
          {selectedRecipe.thumbnailUrl && activeStepIndex === 0 && (
             <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform rotate-1">
               <img src={selectedRecipe.thumbnailUrl} alt={selectedRecipe.title} className="w-full h-auto" />
             </div>
          )}

          <div className="mb-8 bg-white/95 dark:bg-black/85 p-6 rounded-3xl shadow-lg backdrop-blur-sm">
            <span className="text-primary dark:text-secondary font-bold tracking-widest text-xs uppercase mb-3 block">
              {t.step} {activeStepIndex + 1} / {selectedRecipe.steps.length}
            </span>
            <h2 className="text-2xl font-bold text-black dark:text-white leading-relaxed font-serif">
              {currentStep.instruction}
            </h2>
          </div>

          {activeStepIndex === 0 && (
            <div className="bg-white/95 dark:bg-black/85 p-6 rounded-3xl shadow-lg backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ChefHat size={100} className="text-black dark:text-white" />
              </div>
              <h3 className="font-bold text-primary dark:text-secondary mb-6 flex items-center gap-2 text-xl border-b border-gray-100 dark:border-gray-800 pb-3">
                <Menu size={24} /> {t.ingredientsNeeded}
              </h3>
              <ul className="space-y-4 relative z-10">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-4 text-black dark:text-white">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary dark:bg-secondary flex-shrink-0 shadow-sm" />
                    <span className="font-medium text-lg leading-snug">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        {/* Bottom Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/90 border-t border-gray-200 dark:border-gray-800 p-6 px-8 flex items-center justify-between backdrop-blur-lg z-40">
          <button
            onClick={() => { triggerFeedback(); setActiveStepIndex(Math.max(0, activeStepIndex - 1)); }}
            disabled={activeStepIndex === 0}
            className="text-gray-500 dark:text-gray-400 font-bold disabled:opacity-30 hover:text-primary dark:hover:text-white transition-colors uppercase text-sm tracking-wide active:scale-95"
          >
            {t.back}
          </button>
          
          {activeStepIndex < selectedRecipe.steps.length - 1 ? (
            <button
              onClick={() => { triggerFeedback(); setActiveStepIndex(activeStepIndex + 1); }}
              className="bg-primary hover:bg-[#59161D] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all active:scale-95"
            >
              {t.next}
            </button>
          ) : (
             <button
              onClick={() => {
                handleSaveToLibrary(selectedRecipe);
                changeView('library');
              }}
              className="bg-secondary hover:bg-[#C9A675] text-primary dark:text-black px-8 py-3.5 rounded-xl font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>{t.finish}</span>
              <span className="text-xl">🎉</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- PROFILE VIEW ---
  if (view === 'profile') {
    return (
      <div className="min-h-screen transition-colors duration-300">
        {renderHeader(t.profile, 
          <button onClick={() => changeView('home')} className="p-1 -ml-2 text-white hover:bg-white/10 rounded-full active:scale-95">
            <ArrowLeft />
          </button>
        )}
        <main className="p-6 max-w-md mx-auto space-y-6 mt-8 pb-32">
          
          {/* SECTION 1: Personal Info */}
          <div className="bg-white/95 dark:bg-black/85 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
             <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary font-serif flex items-center gap-2">
                <User size={20} /> {t.secPersonal}
             </h3>
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1 block">{t.labelName}</label>
                   <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => { setProfile({...profile, name: e.target.value}); }}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-primary text-black dark:text-white"
                   />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1 block">{t.labelSkill}</label>
                   <div className="flex flex-col gap-2">
                      {Object.keys(t.skills).map((skill) => {
                         const s = skill as SkillLevel;
                         return (
                            <button
                               key={s}
                               onClick={() => { triggerFeedback(); setProfile({...profile, skillLevel: s}); }}
                               className={`p-3 rounded-xl text-left border transition-all ${profile.skillLevel === s 
                                  ? 'bg-primary/10 border-primary text-primary dark:text-white' 
                                  : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
                            >
                               <div className="font-bold text-sm">{t.skills[s]}</div>
                            </button>
                         );
                      })}
                   </div>
                </div>
             </div>
          </div>

          {/* SECTION 2: Kitchen */}
          <div className="bg-white/95 dark:bg-black/85 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
             <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary font-serif flex items-center gap-2">
                <Utensils size={20} /> {t.secKitchen}
             </h3>
             
             <div className="mb-4">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.labelUnits}</label>
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                   {Object.keys(t.units).map(unit => {
                      const u = unit as MeasurementSystem;
                      return (
                         <button 
                            key={u}
                            onClick={() => { triggerFeedback(); setProfile({...profile, measurementSystem: u}); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${profile.measurementSystem === u 
                               ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' 
                               : 'text-gray-400'}`}
                         >
                            {t.units[u]}
                         </button>
                      );
                   })}
                </div>
             </div>

             <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.labelAppliances}</label>
                <div className="flex flex-wrap gap-2">
                   {Object.keys(t.appliancesList).map(app => {
                      const isSelected = profile.appliances.includes(app);
                      return (
                         <button
                            key={app}
                            onClick={() => {
                               triggerFeedback();
                               const newApps = isSelected 
                                  ? profile.appliances.filter(a => a !== app)
                                  : [...profile.appliances, app];
                               setProfile({...profile, appliances: newApps});
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected 
                               ? 'bg-secondary text-primary border-secondary' 
                               : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
                         >
                            {t.appliancesList[app as keyof typeof t.appliancesList]}
                         </button>
                      );
                   })}
                </div>
             </div>
          </div>

          {/* SECTION 3: Diet & Health */}
          <div className="bg-white/95 dark:bg-black/85 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
             <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary font-serif flex items-center gap-2">
                <AlertTriangle size={20} /> {t.secHealth}
             </h3>

             <div className="mb-4">
               <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.dietType}</label>
               <select 
                 value={profile.dietaryRestrictions}
                 onChange={(e) => { triggerFeedback(); setProfile({...profile, dietaryRestrictions: e.target.value}); }}
                 className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none text-black dark:text-white focus:ring-1 focus:ring-primary"
               >
                 {Object.keys(t.diets).map(key => (
                   <option key={key} value={key}>{t.diets[key as keyof typeof t.diets]}</option>
                 ))}
               </select>
             </div>

             <div>
                <label className="text-xs font-bold uppercase text-red-500 mb-2 block">{t.labelAllergies}</label>
                <div className="flex flex-wrap gap-2 mb-3">
                   {Object.keys(t.allergiesList).map(allergy => {
                      const isSelected = profile.allergies.includes(allergy);
                      return (
                         <button
                            key={allergy}
                            onClick={() => {
                               triggerFeedback();
                               const newAll = isSelected 
                                  ? profile.allergies.filter(a => a !== allergy)
                                  : [...profile.allergies, allergy];
                               setProfile({...profile, allergies: newAll});
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected 
                               ? 'bg-red-500 text-white border-red-500' 
                               : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
                         >
                            {t.allergiesList[allergy as keyof typeof t.allergiesList]}
                         </button>
                      );
                   })}
                </div>
                
                <div className="mt-3">
                  <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={customAllergy}
                        onChange={(e) => setCustomAllergy(e.target.value)}
                        placeholder={t.otherAllergy}
                        className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-black dark:text-white outline-none focus:ring-1 focus:ring-red-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddCustomAllergy();
                        }}
                     />
                     <button 
                        onClick={handleAddCustomAllergy}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors active:scale-95"
                     >
                        <Plus size={16} />
                     </button>
                  </div>
                  
                  {/* Display Custom Allergies */}
                  <div className="flex flex-wrap gap-2 mt-2">
                     {profile.allergies
                        .filter(a => !Object.keys(t.allergiesList).includes(a))
                        .map(a => (
                           <button
                              key={a}
                              onClick={() => {
                                 triggerFeedback();
                                 setProfile(prev => ({...prev, allergies: prev.allergies.filter(item => item !== a)}));
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-1 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                           >
                              {a} <X size={12} />
                           </button>
                        ))
                     }
                  </div>
                </div>
             </div>
          </div>

          {/* SECTION 4: Tastes (Existing Logic) */}
          <div className="bg-white/95 dark:bg-black/85 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
            <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary font-serif flex items-center gap-2">
               <Globe size={20} /> {t.secPrefs}
            </h3>
            
            <div className="mb-4">
               <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.cuisines}</label>
               <div className="flex flex-wrap gap-2">
                 {Object.keys(t.countries).map(key => {
                   const countryKey = key as keyof typeof t.countries;
                   const isSelected = profile.favoriteCuisines.includes(countryKey);
                   return (
                     <button
                       key={countryKey}
                       onClick={() => {
                         triggerFeedback();
                         const newFavs = isSelected 
                           ? profile.favoriteCuisines.filter(c => c !== countryKey)
                           : [...profile.favoriteCuisines, countryKey];
                         setProfile({...profile, favoriteCuisines: newFavs});
                       }}
                       className={`px-4 py-2 rounded-full text-xs font-bold transition-all border active:scale-95 ${
                         isSelected 
                           ? 'bg-primary text-white border-primary shadow-md' 
                           : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-secondary'
                       }`}
                     >
                       {t.countries[countryKey]}
                     </button>
                   );
                 })}
               </div>
            </div>

            <div>
               <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.regions}</label>
               <div className="flex flex-wrap gap-2">
                {Object.keys(t.brRegions).map(key => {
                  const regionKey = key as keyof typeof t.brRegions;
                  const isSelected = profile.favoriteRegions.includes(regionKey);
                  return (
                    <button
                      key={regionKey}
                      onClick={() => {
                        triggerFeedback();
                        const newRegs = isSelected 
                          ? profile.favoriteRegions.filter(r => r !== regionKey)
                          : [...profile.favoriteRegions, regionKey];
                        setProfile({...profile, favoriteRegions: newRegs});
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border active:scale-95 ${
                        isSelected 
                          ? 'bg-secondary text-primary border-secondary shadow-md' 
                          : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-secondary'
                      }`}
                    >
                      {t.brRegions[regionKey]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* SECTION 5: App Settings */}
          <div className="bg-white/95 dark:bg-black/85 p-6 rounded-2xl shadow-lg backdrop-blur-sm border-l-4 border-secondary">
             <h3 className="font-bold text-lg mb-4 text-primary dark:text-secondary font-serif flex items-center gap-2">
                <Zap size={20} /> {t.secApp}
             </h3>
             <div className="space-y-4">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-black dark:text-white font-medium">
                      {profile.soundEnabled ? <Volume2 size={20} className="text-primary dark:text-secondary" /> : <VolumeX size={20} className="text-gray-400" />}
                      <span>{t.soundEffects}</span>
                   </div>
                   <button 
                      onClick={() => {
                         triggerFeedback();
                         setProfile(prev => ({...prev, soundEnabled: !prev.soundEnabled}));
                      }}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${profile.soundEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${profile.soundEnabled ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>

                 {/* Haptic Toggle */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-black dark:text-white font-medium">
                      <Smartphone size={20} className={profile.hapticEnabled ? "text-primary dark:text-secondary" : "text-gray-400"} />
                      <span>{t.hapticFeedback}</span>
                   </div>
                   <button 
                      onClick={() => {
                         triggerFeedback();
                         setProfile(prev => ({...prev, hapticEnabled: !prev.hapticEnabled}));
                      }}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${profile.hapticEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${profile.hapticEnabled ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
             </div>
          </div>

          <button 
            onClick={() => changeView('home')}
            className="w-full bg-primary hover:bg-[#59161D] text-white py-4 rounded-xl font-bold shadow-xl transition-transform hover:-translate-y-0.5 border border-white/10 active:scale-95"
          >
            {t.savePref}
          </button>

        </main>
      </div>
    );
  }

  return <div>Unknown View</div>;
};

export default App;
