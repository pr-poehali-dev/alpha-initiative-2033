export default function Featured() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="/images/mountain-landscape.jpg"
          alt="Бегун на маршруте"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1" id="features">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Твой личный трекер маршрутов</h3>
        <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
          Рисуй маршруты прямо на карте, сохраняй избранные пробежки и смотри, как растёт покрытая тобой территория.
          Каждый шаг — точка на твоей карте побед.
        </p>
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-lg">🗺️</span>
            <div>
              <p className="font-semibold text-neutral-900">Интерактивная карта</p>
              <p className="text-neutral-600 text-sm">Отмечай маршрут во время пробежки или после неё</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📊</span>
            <div>
              <p className="font-semibold text-neutral-900">Статистика и прогресс</p>
              <p className="text-neutral-600 text-sm">Дистанция, темп, калории — всё в одном месте</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🏆</span>
            <div>
              <p className="font-semibold text-neutral-900">Личные достижения</p>
              <p className="text-neutral-600 text-sm">Открывай новые районы и бей собственные рекорды</p>
            </div>
          </div>
        </div>
        <button className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
          Попробовать
        </button>
      </div>
    </div>
  );
}