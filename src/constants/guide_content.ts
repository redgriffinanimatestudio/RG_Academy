export interface GuideStep {
  title: string;
  desc: string;
  icon: string;
}

export const ACADEMY_GUIDE_STEPS: Record<string, GuideStep[]> = {
  eng: [
    {
      title: "Initialize Specialist Node",
      desc: "Connect your digital identity to the Grid to start tracking your evolution and masteries.",
      icon: "UserPlus"
    },
    {
      title: "Select Trajectory Path",
      desc: "Browse through specialized categories: VFX, 3D Modeling, Animation, or Engineering.",
      icon: "Compass"
    },
    {
      title: "Synchronize Skillsets",
      desc: "Join professional workshops led by industry veterans. All progress is saved to your Node.",
      icon: "Zap"
    },
    {
      title: "Claim Mastery Level",
      desc: "Complete the trajectory to receive unique certificates and unlock premium studio contracts.",
      icon: "Award"
    }
  ],
  rus: [
    {
      title: "Инициализация узла специалиста",
      desc: "Подключите свою цифровую личность к Сети, чтобы начать отслеживать свою эволюцию и достижения.",
      icon: "UserPlus"
    },
    {
      title: "Выбор траектории пути",
      desc: "Просматривайте специализированные категории: VFX, 3D-моделирование, анимация или инженерия.",
      icon: "Compass"
    },
    {
      title: "Синхронизация навыков",
      desc: "Присоединяйтесь к профессиональным воркшопам от ветеранов индустрии. Весь прогресс сохраняется в вашем узле.",
      icon: "Zap"
    },
    {
      title: "Получение уровня мастерства",
      desc: "Завершите траекторию, чтобы получить уникальные сертификаты и открыть доступ к премиальным студийным контрактам.",
      icon: "Award"
    }
  ]
};

export const STUDIO_GUIDE_STEPS: Record<string, GuideStep[]> = {
  eng: [
    {
      title: "Secure Project Access",
      desc: "Establish a Client Node to manage high-end CGI productions and specialized talent.",
      icon: "Shield"
    },
    {
      title: "Deploy Production Brief",
      desc: "Define your technical objectives, timelines, and budget nodes for the ecosystem.",
      icon: "FileText"
    },
    {
      title: "Synchronize Specialists",
      desc: "Algorithmically match or manually select top-tier talent from the Academy's elite graduates.",
      icon: "Users"
    },
    {
      title: "Finalize Pipeline Sync",
      desc: "Monitor milestones via the Command Center and execute secure payments upon sync completion.",
      icon: "CheckCircle"
    }
  ],
  rus: [
    {
      title: "Доступ к проектному узлу",
      desc: "Создайте клиентский узел для управления высокотехнологичными CGI-проектами и талантами.",
      icon: "Shield"
    },
    {
      title: "Развертывание брифа",
      desc: "Определите свои технические цели, сроки и бюджетные узлы для экосистемы.",
      icon: "FileText"
    },
    {
      title: "Синхронизация специалистов",
      desc: "Автоматически подбирайте или вручную выбирайте лучших талантов среди выпускников Академии.",
      icon: "Users"
    },
    {
      title: "Завершение синхронизации",
      desc: "Отслеживайте этапы через Командный Центр и проводите безопасные платежи по завершении.",
      icon: "CheckCircle"
    }
  ]
};
