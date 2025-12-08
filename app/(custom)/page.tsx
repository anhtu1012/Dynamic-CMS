"use client";

import Hyperspeed from "@/components/background/Hyperspeed";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Code,
  Database,
  FileText,
  Hash,
  Image,
  Layers,
  Mail,
  Menu,
  Search,
  Shield,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "./layout";

type SectionType = "hero" | "features" | "fieldTypes" | "howItWorks" | "cta";

// Custom Hyperspeed presets for each section with black/white theme
const sectionPresets = {
  one: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3,
    },
  },
  two: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "mountainDistortion",
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],

    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.05, 400 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff102a, 0xeb383e, 0xff102a],
      rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
      sticks: 0xdadafa,
    },
  },
  three: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "xyDistortion",
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 3,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 30,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.02, 0.05],
    lightStickHeight: [0.3, 0.7],
    movingAwaySpeed: [20, 50],
    movingCloserSpeed: [-150, -230],
    carLightsLength: [400 * 0.05, 400 * 0.2],
    carLightsRadius: [0.03, 0.08],
    carWidthPercentage: [0.1, 0.5],
    carShiftX: [-0.5, 0.5],
    carFloorSeparation: [0, 0.1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x7d0d1b, 0xa90519, 0xff102a],
      rightCars: [0xf1eece, 0xe6e2b1, 0xdfd98a],
      sticks: 0xf1eece,
    },
  },
  four: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "LongRaceDistortion",
    length: 400,
    roadWidth: 10,
    islandWidth: 5,
    lanesPerRoad: 2,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 70,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.05, 400 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff5f73, 0xe74d60, 0xff102a],
      rightCars: [0xa4e3e6, 0x80d1d4, 0x53c2c6],
      sticks: 0xa4e3e6,
    },
  },
  five: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.05, 400 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
      rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
      sticks: 0xc5e8eb,
    },
  },
  six: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "deepDistortion",
    length: 400,
    roadWidth: 18,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.05, 400 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff322f, 0xa33010, 0xa81508],
      rightCars: [0xfdfdf0, 0xf3dea0, 0xe2bb88],
      sticks: 0xfdfdf0,
    },
  },
};

function Page() {
  const { currentSection, setCurrentSection } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    // Reset AOS when section changes
    AOS.refresh();
  }, [currentSection]);

  // Handle wheel/scroll to navigate sections
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      const sections: SectionType[] = [
        "hero",
        "features",
        "fieldTypes",
        "howItWorks",
        "cta",
      ];
      const currentIndex = sections.indexOf(currentSection);

      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // Scroll down - next section
        setIsScrolling(true);
        setCurrentSection(sections[currentIndex + 1]);
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up - previous section
        setIsScrolling(true);
        setCurrentSection(sections[currentIndex - 1]);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, isScrolling, setCurrentSection]);

  const navItems: { name: string; section: SectionType }[] = [
    { name: "Trang chủ", section: "hero" },
    { name: "Tính năng", section: "features" },
    { name: "Loại trường", section: "fieldTypes" },
    { name: "Cách hoạt động", section: "howItWorks" },
  ];

  const handleNavigate = (section: SectionType) => {
    setCurrentSection(section);
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: Database,
      title: "Tạo schema động",
      description: "Định nghĩa cấu trúc bảng qua API mà không cần code",
      delay: 0,
    },
    {
      icon: Layers,
      title: "18 loại field",
      description:
        "text, number, email, select, reference, richtext, image, file...",
      delay: 100,
    },
    {
      icon: Shield,
      title: "Validation động",
      description: "Tự động validate dữ liệu theo schema đã định nghĩa",
      delay: 200,
    },
    {
      icon: Zap,
      title: "Auto CRUD API",
      description: "Tự động sinh API endpoints cho collection",
      delay: 300,
    },
    {
      icon: Trash2,
      title: "Soft Delete",
      description: "Xóa mềm với khả năng khôi phục",
      delay: 400,
    },
    {
      icon: Search,
      title: "Search & Filter",
      description: "Tìm kiếm và lọc dữ liệu linh hoạt",
      delay: 500,
    },
  ];

  const fieldTypes = [
    { icon: FileText, name: "Text", color: "from-gray-400 to-gray-600" },
    { icon: Hash, name: "Number", color: "from-gray-500 to-gray-700" },
    { icon: Mail, name: "Email", color: "from-gray-600 to-gray-800" },
    { icon: Code, name: "Select", color: "from-gray-400 to-gray-600" },
    { icon: Database, name: "Reference", color: "from-gray-500 to-gray-700" },
    { icon: FileText, name: "RichText", color: "from-gray-600 to-gray-800" },
    { icon: Image, name: "Image", color: "from-gray-400 to-gray-600" },
    { icon: Calendar, name: "Date", color: "from-gray-500 to-gray-700" },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case "hero":
        return <HeroSection />;
      case "features":
        return <FeaturesSection features={features} />;
      case "fieldTypes":
        return <FieldTypesSection fieldTypes={fieldTypes} />;
      case "howItWorks":
        return <HowItWorksSection />;
      case "cta":
        return <CTASection />;
      default:
        return <HeroSection />;
    }
  };

  // Get current section preset
  const presetMap: Record<SectionType, keyof typeof sectionPresets> = {
    hero: "one",
    features: "two",
    fieldTypes: "three",
    howItWorks: "four",
    cta: "five",
  };

  const currentPreset = sectionPresets[presetMap[currentSection]] as any;
  const headerBgColor = "bg-black/10";
  const headerBorderColor = "border-white/20";

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Hyperspeed Background - INTERACTIVE - Click to speed up */}
      <div className="absolute inset-0 z-0" style={{ pointerEvents: "auto" }}>
        <Hyperspeed key={currentSection} effectOptions={currentPreset} />
      </div>

      {/* Fixed Header - Higher z-index with pointer-events */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${headerBgColor} backdrop-blur-md border-b ${headerBorderColor} transition-colors duration-700`}
        style={{ pointerEvents: "auto" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavigate("hero")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-white text-black w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-700">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2 transition-colors duration-700">
                  Dynamic CMS
                  <Sparkles className="w-4 h-4 text-gray-300 transition-colors duration-700" />
                </h1>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.section)}
                  className={`font-medium transition-all duration-700 ${
                    currentSection === item.section
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => router.push("/register")}
                className="text-gray-300 hover:text-white font-medium transition-all duration-700"
              >
                Đăng ký
              </button>
              <button
                onClick={() => router.push("/login")}
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold transition-all duration-700"
              >
                Đăng nhập
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white transition-colors duration-700"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 transition-colors duration-700">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.section)}
                    className={`font-medium transition-all duration-700 text-left ${
                      currentSection === item.section
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => router.push("/register")}
                    className="text-gray-300 hover:text-white font-medium transition-all duration-700 text-left"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold transition-all duration-700"
                  >
                    Đăng nhập
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Dots - Always white on dark background - Higher z-index */}
      <div
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
        style={{ pointerEvents: "auto" }}
      >
        {(
          [
            "hero",
            "features",
            "fieldTypes",
            "howItWorks",
            "cta",
          ] as SectionType[]
        ).map((section) => (
          <button
            key={section}
            onClick={() => setCurrentSection(section)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-700 ${
              currentSection === section
                ? "bg-white w-4 h-4"
                : "bg-gray-500 hover:bg-gray-300"
            }`}
            aria-label={`Go to ${section} section`}
          >
            <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              {section === "hero" && "Trang chủ"}
              {section === "features" && "Tính năng"}
              {section === "fieldTypes" && "Loại trường"}
              {section === "howItWorks" && "Cách hoạt động"}
              {section === "cta" && "Bắt đầu"}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content - pointer-events-none by default, auto on interactive elements */}
      <div
        className="relative h-full w-full transition-all duration-700 ease-in-out z-10"
        style={{ pointerEvents: "none" }}
      >
        {renderSection()}
      </div>

      {/* Scroll Hint */}
      {currentSection !== "cta" && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          style={{ pointerEvents: "none" }}
        >
          <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
            <span className="text-sm">Scroll hoặc Click + giữ để tăng tốc</span>
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </div>
      )}
    </div>
  );
}

// Hero Section Component
function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative h-full overflow-hidden text-white flex items-center">
      <div
        className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center"
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center max-w-4xl mx-auto" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Dynamic CMS System</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Hệ thống CMS động
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Cho phép tạo bảng, trường và API tại runtime
          </p>

          <div
            className="flex flex-wrap justify-center gap-4"
            style={{ pointerEvents: "auto" }}
          >
            <button
              onClick={() => router.push("/login")}
              className="group bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
            >
              Bắt đầu ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
              Xem tài liệu
            </button>
          </div>
        </div>

        {/* Floating Cards Animation */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Database, text: "Schema động", delay: 100 },
            { icon: Zap, text: "Auto API", delay: 200 },
            { icon: Shield, text: "Validation", delay: 300 },
          ].map((item, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={item.delay}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
            >
              <item.icon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">{item.text}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section Component - Dark theme
function FeaturesSection({ features }: { features: any[] }) {
  return (
    <section
      className="h-full flex items-center overflow-y-auto"
      style={{ pointerEvents: "none" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            ⭐ Tính năng chính
          </h2>
          <p className="text-xl text-gray-300">
            Các tính năng mạnh mẽ giúp bạn xây dựng CMS linh hoạt
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          style={{ pointerEvents: "auto" }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={feature.delay}
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 hover:border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="bg-white text-black w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Tìm hiểu thêm
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Field Types Section Component
function FieldTypesSection({ fieldTypes }: { fieldTypes: any[] }) {
  return (
    <section
      className="h-full text-white flex items-center overflow-y-auto"
      style={{ pointerEvents: "none" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            18 loại trường dữ liệu
          </h2>
          <p className="text-xl text-gray-400">
            Đa dạng kiểu dữ liệu cho mọi nhu cầu
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          style={{ pointerEvents: "auto" }}
        >
          {fieldTypes.map((field, idx) => (
            <div
              key={idx}
              data-aos="zoom-in"
              data-aos-delay={idx * 50}
              className={`group bg-gradient-to-br ${field.color} rounded-2xl p-6 hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-2xl`}
            >
              <field.icon className="w-8 h-8 mb-3 group-hover:rotate-12 transition-transform" />
              <h4 className="font-bold text-lg">{field.name}</h4>
            </div>
          ))}
        </div>

        <div
          className="mt-12 text-center"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <p className="text-gray-400">...và nhiều loại khác</p>
        </div>
      </div>
    </section>
  );
}

// How It Works Section Component - Dark theme
function HowItWorksSection() {
  return (
    <section
      className="h-full flex items-center overflow-y-auto"
      style={{ pointerEvents: "none" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Cách thức hoạt động
          </h2>
          <p className="text-xl text-gray-300">Đơn giản và mạnh mẽ</p>
        </div>

        <div
          className="max-w-4xl mx-auto space-y-8"
          style={{ pointerEvents: "auto" }}
        >
          {[
            {
              step: "01",
              title: "Định nghĩa Schema",
              description: "Tạo cấu trúc bảng qua API với các trường tùy chỉnh",
              icon: Database,
            },
            {
              step: "02",
              title: "Tự động tạo API",
              description:
                "Hệ thống tự động sinh CRUD endpoints cho collection",
              icon: Code,
            },
            {
              step: "03",
              title: "Sử dụng ngay",
              description: "Bắt đầu quản lý dữ liệu với validation và tìm kiếm",
              icon: CheckCircle2,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              data-aos="fade-right"
              data-aos-delay={idx * 100}
              className="flex gap-8 items-start group"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white text-black rounded-2xl flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 group-hover:border-white transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <item.icon className="w-6 h-6 text-white" />
                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  const router = useRouter();

  return (
    <section className="h-full text-white relative overflow-hidden flex items-center">
      <div
        className="container mx-auto px-4 relative z-10"
        style={{ pointerEvents: "none" }}
      >
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Tạo CMS động của bạn ngay hôm nay
          </p>
          <div
            className="flex flex-wrap justify-center gap-4"
            style={{ pointerEvents: "auto" }}
          >
            <button
              onClick={() => router.push("/login")}
              className="group bg-white text-black px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
            >
              Dùng thử miễn phí
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
