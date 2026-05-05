export default function SectionHeader({ 
  badge, 
  title, 
  description, 
  align = "left",
  className = "" 
}) {
  const isCentered = align === "center";

  return (
    <div className={`mb-12 md:mb-20 ${isCentered ? "text-center mx-auto" : ""} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 mb-4 ${isCentered ? "justify-center" : ""}`}>
          <div className="w-8 h-[1px] bg-brand/30" />
          <span className="text-brand font-bold uppercase tracking-[0.4em] text-[9px]">
            {badge}
          </span>
          <div className="w-8 h-[1px] bg-brand/30" />
        </div>
      )}
      
      <h2 className="text-3xl md:text-5xl font-bold text-brand-blue leading-tight tracking-tight mb-4">
        {title}
      </h2>
      
      {description && (
        <p className={`text-slate-400 font-medium text-sm md:text-lg leading-relaxed max-w-2xl ${isCentered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}






