import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const WORLD_MAP_PIXELS = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
  [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1],
  [1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
];

const USERS = [
  { name: "Максим К.", city: "Москва", pixels: 247, km: 1840 },
  { name: "Анна С.", city: "СПб", pixels: 189, km: 1320 },
  { name: "Дмитрий Л.", city: "Казань", pixels: 134, km: 980 },
  { name: "Ольга М.", city: "Екб", pixels: 98, km: 720 },
  { name: "Иван П.", city: "Новосиб", pixels: 76, km: 540 },
];

export default function PixelMap() {
  const container = useRef<HTMLDivElement>(null);
  const [hoveredPixel, setHoveredPixel] = useState<{ row: number; col: number } | null>(null);
  const [conqueredPixels, setConqueredPixels] = useState<Set<string>>(new Set());

  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  useEffect(() => {
    const initial = new Set<string>();
    const positions = [
      "4-15","4-16","5-14","5-15","5-16","5-17","6-15","6-16","6-17","6-18",
      "7-15","7-16","8-13","8-14","9-12","9-13","10-13",
      "6-26","6-27","6-28","7-26","7-27","7-28","7-29","8-27","8-28"
    ];
    positions.forEach(p => initial.add(p));
    setConqueredPixels(initial);
  }, []);

  const handlePixelClick = (row: number, col: number) => {
    if (WORLD_MAP_PIXELS[row][col] !== 1) return;
    const key = `${row}-${col}`;
    setConqueredPixels(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div ref={container} className="bg-neutral-950 py-24 px-6">
      <motion.div style={{ opacity, y }} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            КАРТА МИРА
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Каждый пиксель — это территория. Покоряй кварталы, районы, города.
            Кто пробежит больше всех?
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-12 items-start">
          <div className="flex-1">
            <div
              className="w-full overflow-x-auto"
              style={{ imageRendering: "pixelated" }}
            >
              <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `repeat(40, minmax(0, 1fr))` }}>
                {WORLD_MAP_PIXELS.map((row, ri) =>
                  row.map((cell, ci) => {
                    const key = `${ri}-${ci}`;
                    const isConquered = conqueredPixels.has(key);
                    const isHovered = hoveredPixel?.row === ri && hoveredPixel?.col === ci;
                    const isLand = cell === 1;

                    return (
                      <div
                        key={key}
                        onClick={() => handlePixelClick(ri, ci)}
                        onMouseEnter={() => isLand && setHoveredPixel({ row: ri, col: ci })}
                        onMouseLeave={() => setHoveredPixel(null)}
                        className="transition-all duration-150"
                        style={{
                          width: 14,
                          height: 14,
                          backgroundColor: isLand
                            ? isConquered
                              ? isHovered ? "#fb923c" : "#f97316"
                              : isHovered ? "#525252" : "#404040"
                            : "#0a0a0a",
                          cursor: isLand ? "pointer" : "default",
                          boxShadow: isConquered && isHovered ? "0 0 8px #f97316" : "none",
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <div className="flex gap-6 mt-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neutral-600"></div>
                <span>Территория</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500"></div>
                <span>Покорено</span>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-80">
            <h3 className="text-white text-xs uppercase tracking-widest mb-6 text-neutral-400">
              Топ бегунов по территории
            </h3>
            <div className="flex flex-col gap-3">
              {USERS.map((user, i) => (
                <div
                  key={user.name}
                  className="flex items-center gap-4 p-4 border border-neutral-800 hover:border-orange-500 transition-colors duration-300"
                >
                  <div className="text-orange-500 font-bold text-lg w-6 text-center">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">{user.name}</div>
                    <div className="text-neutral-500 text-xs">{user.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-sm">{user.pixels} px</div>
                    <div className="text-neutral-600 text-xs">{user.km} км</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border border-orange-500 border-dashed text-center">
              <p className="text-neutral-400 text-xs mb-1">Твоё место</p>
              <p className="text-white text-sm font-bold">— / 0 пикселей</p>
              <p className="text-orange-500 text-xs mt-1">Зарегистрируйся, чтобы начать</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
