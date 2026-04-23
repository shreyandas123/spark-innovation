export default function SectionHeader({ 
  badge, 
  title, 
  description, 
  align = "left",
  className = "" 
}) {
  const isCentered = align === "center";

  return (
    <div className={`mb-10 md:mb-16 ${isCentered ? "text-center mx-auto" : ""} ${className} animate-reveal`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 ${isCentered ? "justify-center" : ""}`}>
          <span className="w-6 md:w-10 h-[1px] bg-brand"></span>
          <span className="text-brand font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
            {badge}
          </span>
        </div>
      )}
      
      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-brand-blue leading-none uppercase tracking-tighter mb-4 md:mb-8">
        {title}
      </h2>
      
      {description && (
        <p className={`text-slate-600 font-medium text-[12px] sm:text-sm md:text-lg leading-relaxed max-w-xl ${isCentered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}


