export type Lang = 'es' | 'en' | 'fr' | 'ko' | 'zh' | 'th';

export const translations: Record<Lang, Record<string, string>> = {
  es: {
    // Nav
    'nav.home': 'Inicio',
    'nav.directory': 'Directorio',
    'nav.library': 'Mi Biblioteca',
    'nav.donate': 'Donar',
    'nav.profile': 'Mi Perfil',
    'nav.admin': 'Estudio Café',

    // Home / Search
    'home.title': 'TU MANGAX',
    'home.subtitle': 'Lee manga, manhwa y webtoons con la mejor calidad',
    'home.searchPlaceholder': 'Buscar obras por título, género, autor o artista...',
    'home.popular': '🔥 Obras Populares',
    'home.recent': '✨ Últimas Actualizaciones',
    'home.carouselTitle': '¡Recomendado de hoy!',
    'home.emptySearch': 'No se encontraron obras con ese término.',

    // Directory
    'dir.title': 'Directorio de Obras',
    'dir.filters': 'Filtros de Búsqueda',
    'dir.type': 'Tipo',
    'dir.all': 'Todos',
    'dir.genres': 'Géneros Populares',
    'dir.status': 'Estado',
    'dir.active': 'En emisión',
    'dir.completed': 'Finalizados',
    'dir.soon': 'Próximamente',
    'dir.sort': 'Ordenar por',
    'dir.recent': 'Más Recientes',
    'dir.popular': 'Más Populares',
    'dir.alphabetical': 'Alfabético',

    // Comic Detail
    'detail.synopsis': 'Sinopsis',
    'detail.chapters': 'Lista de Capítulos',
    'detail.pages': 'páginas',
    'detail.artist': 'Artista',
    'detail.writer': 'Escritor',
    'detail.added': 'Agregado',
    'detail.status': 'Estado',
    'detail.readButton': 'Comenzar a leer',
    'detail.addToLibrary': 'Suscrito',
    'detail.addLibraryAction': 'Añadir a Biblioteca',
    'detail.removeLibraryAction': 'Quitar de Biblioteca',
    'detail.comments': 'Comentarios de la Comunidad',
    'detail.loginComment': 'Inicia sesión para poder comentar.',

    // Reading
    'read.prev': 'Anterior',
    'read.next': 'Siguiente',
    'read.allChapters': 'Capítulos',

    // Profile
    'profile.title': 'Mi Perfil',
    'profile.rol': 'Rol de Usuario',
    'profile.joined': 'Miembro desde',
    'profile.vip': '⭐ VIP DONADOR',
    'profile.donor': '💖 DONADOR',
    'profile.roleAdmin': 'ADMINISTRADOR',
    'profile.roleLector': 'LECTOR DE NEXUS',
    'profile.notifications': 'Notificaciones Push',
    'profile.sub': '¡Excelente! Estás suscrito. Recibirás una alerta inmediata cada vez que se suba un nuevo capítulo.',
    'profile.unsub': 'Activa las alertas del sistema para que te avisemos al instante cada vez que un manga reciba nuevos capítulos.',
    'profile.subButton': '🔔 Activar Alertas',
    'profile.logout': 'Salir de Nexus',
    'profile.loginPrompt': 'Inicia sesión para guardar favoritos, dejar likes y ser parte de la comunidad.',
    'profile.loginButton': '¡INGRESAR A Nexus Manga!',

    // Settings Modal (Gear)
    'settings.title': 'Ajustes del Sistema',
    'settings.language': 'Idioma de la App',
    'settings.theme': 'Tema Visual',
    'settings.themeLight': 'Modo Claro',
    'settings.themeDark': 'Modo Oscuro',
    'settings.close': 'Listo',

    // Admin / Studio
    'admin.headline': 'Estudio de creadores',
    'admin.addWork': 'Añadir nueva obra',
    'admin.allWorks': 'Todas las obras publicadas',
    'admin.tags': 'Etiquetas de búsqueda',
    'admin.tagsSearch': 'Buscar etiquetas...',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.directory': 'Directory',
    'nav.library': 'My Library',
    'nav.donate': 'Donate',
    'nav.profile': 'Profile',
    'nav.admin': 'Studio Cafe',

    // Home / Search
    'home.title': 'TU MANGAX',
    'home.subtitle': 'Read manga, manhwa, and webtoons in elite quality',
    'home.searchPlaceholder': 'Search by title, genre, author, or publisher...',
    'home.popular': '🔥 Hot Series',
    'home.recent': '✨ Latest Releases',
    'home.carouselTitle': 'Daily Spotlight!',
    'home.emptySearch': 'No titles matched your search.',

    // Directory
    'dir.title': 'Explore Directory',
    'dir.filters': 'Search Filter Tools',
    'dir.type': 'Classification',
    'dir.all': 'All Titles',
    'dir.genres': 'Popular Genres',
    'dir.status': 'Publication Status',
    'dir.active': 'On-going',
    'dir.completed': 'Completed',
    'dir.soon': 'Coming Soon',
    'dir.sort': 'Sort & Filter By',
    'dir.recent': 'New Additions',
    'dir.popular': 'Most Popular',
    'dir.alphabetical': 'A-Z Order',

    // Comic Detail
    'detail.synopsis': 'Story Summary',
    'detail.chapters': 'Chapter List',
    'detail.pages': 'pages',
    'detail.artist': 'Art Director',
    'detail.writer': 'Author',
    'detail.added': 'Release Date',
    'detail.status': 'Status',
    'detail.readButton': 'Start reading now',
    'detail.addToLibrary': 'Subscribed',
    'detail.addLibraryAction': 'Add to Library',
    'detail.removeLibraryAction': 'Remove from Library',
    'detail.comments': 'Member Feedback',
    'detail.loginComment': 'Sign in to publish comments.',

    // Reading
    'read.prev': 'Previous',
    'read.next': 'Next Chapter',
    'read.allChapters': 'All Chapters',

    // Profile
    'profile.title': 'User Profile',
    'profile.rol': 'Account Privilege',
    'profile.joined': 'Member since',
    'profile.vip': '⭐ VIP DONOR',
    'profile.donor': '💖 DONOR',
    'profile.roleAdmin': 'ADMIN',
    'profile.roleLector': 'NEXUS MEMBER',
    'profile.notifications': 'Live notifications',
    'profile.sub': 'Awesome! Subscribed. Receive alerts instantly for library updates.',
    'profile.unsub': 'Toggle alerts to receive custom badges on recent updates.',
    'profile.subButton': '🔔 Subscribe Alerts',
    'profile.logout': 'Sign Out',
    'profile.loginPrompt': 'Log in to manage and build lists with millions of community creators.',
    'profile.loginButton': 'Enter Nexus Manga Studio',

    // Settings Modal (Gear)
    'settings.title': 'System Settings',
    'settings.language': 'Application Language',
    'settings.theme': 'Aesthetic Preference',
    'settings.themeLight': 'Light Theme',
    'settings.themeDark': 'Dark Theme',
    'settings.close': 'Save Changes',

    // Admin / Studio
    'admin.headline': 'Creators Studio',
    'admin.addWork': 'Create new project',
    'admin.allWorks': 'All published works',
    'admin.tags': 'Filter Tags',
    'admin.tagsSearch': 'Filter tags search...',
  },
  fr: {
    // Nav
    'nav.home': 'Accueil',
    'nav.directory': 'Annuaire',
    'nav.library': 'Ma Bibliothèque',
    'nav.donate': 'Faire un don',
    'nav.profile': 'Mon Profil',
    'nav.admin': 'Studio Café',

    // Home / Search
    'home.title': 'TU MANGAX',
    'home.subtitle': 'Lisez des mangas, manhwas et webtoons en haute qualité',
    'home.searchPlaceholder': 'Rechercher par titre, genre, auteur ou artiste...',
    'home.popular': '🔥 Oeuvres Populaires',
    'home.recent': '✨ Dernières Mises à Jour',
    'home.carouselTitle': 'Recommandation du jour !',
    'home.emptySearch': 'Aucune oeuvre ne correspond à votre recherche.',

    // Directory
    'dir.title': 'Annuaire des Oeuvres',
    'dir.filters': 'Filtres de Recherche',
    'dir.type': 'Type',
    'dir.all': 'Tous',
    'dir.genres': 'Genres Populaires',
    'dir.status': 'Statut',
    'dir.active': 'En cours',
    'dir.completed': 'Terminé',
    'dir.soon': 'Prochainement',
    'dir.sort': 'Trier par',
    'dir.recent': 'Plus récents',
    'dir.popular': 'Plus populaires',
    'dir.alphabetical': 'Alphabétique',

    // Comic Detail
    'detail.synopsis': 'Synopsis',
    'detail.chapters': 'Liste des Chapitres',
    'detail.pages': 'pages',
    'detail.artist': 'Artiste',
    'detail.writer': 'Écrivain',
    'detail.added': 'Ajouté le',
    'detail.status': 'Statut',
    'detail.readButton': 'Commencer la lecture',
    'detail.addToLibrary': 'Abonné',
    'detail.addLibraryAction': 'Ajouter à la bibliothèque',
    'detail.removeLibraryAction': 'Retirer de la bibliothèque',
    'detail.comments': 'Commentaires de la communauté',
    'detail.loginComment': 'Connectez-vous pour laisser un commentaire.',

    // Reading
    'read.prev': 'Précédent',
    'read.next': 'Suivant',
    'read.allChapters': 'Chapitres',

    // Profile
    'profile.title': 'Mon Profil',
    'profile.rol': 'Rôle de l\'utilisateur',
    'profile.joined': 'Membre depuis',
    'profile.vip': '⭐ VIP DONATEUR',
    'profile.donor': '💖 DONATEUR',
    'profile.roleAdmin': 'ADMINISTRATEUR',
    'profile.roleLector': 'LECTEUR NEXUS',
    'profile.notifications': 'Notifications Push',
    'profile.sub': 'Génial ! Vous êtes abonné. Vous recevrez des alertes en temps réel.',
    'profile.unsub': 'Activez les alertes systèmes pour savoir quand un nouveau chapitre sort.',
    'profile.subButton': '🔔 Activer les Alertes',
    'profile.logout': 'Se déconnecter',
    'profile.loginPrompt': 'Connectez-vous pour ajouter des favoris, commenter et rejoindre la communauté.',
    'profile.loginButton': 'Rejoindre Nexus Manga !',

    // Settings Modal (Gear)
    'settings.title': 'Paramètres Système',
    'settings.language': 'Langue de l\'application',
    'settings.theme': 'Thème Visuel',
    'settings.themeLight': 'Mode Clair',
    'settings.themeDark': 'Mode Sombre',
    'settings.close': 'Appliquer',

    // Admin / Studio
    'admin.headline': 'Studio de Création',
    'admin.addWork': 'Créer un nouveau projet',
    'admin.allWorks': 'Toutes les oeuvres publiées',
    'admin.tags': 'Étiquettes de recherche',
    'admin.tagsSearch': 'Rechercher des étiquettes...',
  },
  ko: {
    // Nav
    'nav.home': '홈',
    'nav.directory': '카탈로그',
    'nav.library': '내 서재',
    'nav.donate': '후원하기',
    'nav.profile': '내 프로필',
    'nav.admin': '스튜디오 카페',

    // Home / Search
    'home.title': '투망가X',
    'home.subtitle': '최고 화질의 만화, 만화, 웹툰 감상',
    'home.searchPlaceholder': '제목, 장르, 작가, 아티스트 검색...',
    'home.popular': '🔥 인기 작품 목록',
    'home.recent': '✨ 최신 업데이트 된 작품',
    'home.carouselTitle': '오늘의 추천 만화!',
    'home.emptySearch': '검색 결과가 없습니다.',

    // Directory
    'dir.title': '작품 찾기 디렉토리',
    'dir.filters': '검색 상세 필터',
    'dir.type': '유형',
    'dir.all': '전체 보기',
    'dir.genres': '인기 장르 선택',
    'dir.status': '연재 상태',
    'dir.active': '연재중',
    'dir.completed': '완결',
    'dir.soon': '공개 예정',
    'dir.sort': '정렬 기준',
    'dir.recent': '최신순',
    'dir.popular': '인기순',
    'dir.alphabetical': '가나다순',

    // Comic Detail
    'detail.synopsis': '줄거리 개요',
    'detail.chapters': '회차 목록',
    'detail.pages': '페이지',
    'detail.artist': '그림 작가',
    'detail.writer': '글 작가',
    'detail.added': '등록된 일자',
    'detail.status': '상태',
    'detail.readButton': '첫 회 보기',
    'detail.addToLibrary': '구독중',
    'detail.addLibraryAction': '내 서재에 추가',
    'detail.removeLibraryAction': '서재에서 삭제',
    'detail.comments': '커뮤니티 한줄평',
    'detail.loginComment': '댓글 작성을 위해 로그인 해주세요.',

    // Reading
    'read.prev': '이전화',
    'read.next': '다음화',
    'read.allChapters': '회차 선택',

    // Profile
    'profile.title': '내 프로필 정보',
    'profile.rol': '계정 분류',
    'profile.joined': '가입 기간',
    'profile.vip': '⭐ VIP 후원자',
    'profile.donor': '💖 일반 후원자',
    'profile.roleAdmin': '총괄 관리자',
    'profile.roleLector': '넥서스 독자',
    'profile.notifications': '실시간 푸시 알림 설정',
    'profile.sub': '알림 수신 동의가 완료되었습니다! 신규 회차가 등록되면 알려드립니다.',
    'profile.unsub': '독점 및 선공개 회차 알림을 시스템으로 전송해 드릴 수 있습니다.',
    'profile.subButton': '🔔 실시간 알림 켜기',
    'profile.logout': '서비스 로그아웃',
    'profile.loginPrompt': '로그인하시면 나만의 추천 도서 편성, 댓글 소통을 하실 수 있습니다.',
    'profile.loginButton': '넥서스 만화 플랫폼 로그인',

    // Settings Modal (Gear)
    'settings.title': '전체 플랫폼 설정',
    'settings.language': '애플리케이션 언어',
    'settings.theme': '화면 테마 변경',
    'settings.themeLight': '라이트 모드',
    'settings.themeDark': '다크 모드',
    'settings.close': '설정 완료',

    // Admin / Studio
    'admin.headline': '크리에이터 전용 스튜디오',
    'admin.addWork': '새 창작 기획 등록',
    'admin.allWorks': '최종 업로드 완료된 작품',
    'admin.tags': '키워드 태그 설정',
    'admin.tagsSearch': '키워드 빠른 검색...',
  },
  zh: {
    // Nav
    'nav.home': '首页',
    'nav.directory': '目录',
    'nav.library': '我的书架',
    'nav.donate': '赞助支持',
    'nav.profile': '个人主页',
    'nav.admin': '创作者工作室',

    // Home / Search
    'home.title': 'TU MANGAX',
    'home.subtitle': '精选优质漫画、韩漫与网络漫画免费在线阅读',
    'home.searchPlaceholder': '输入作品名称、类型、作者或绘师进行搜索...',
    'home.popular': '🔥 热门连载推荐',
    'home.recent': '✨ 精彩最近更新',
    'home.carouselTitle': '今日佳作推荐！',
    'home.emptySearch': '未搜索到符合条件的相关漫画作品。',

    // Directory
    'dir.title': '作品分类索引',
    'dir.filters': '多维度条件筛选',
    'dir.type': '类型',
    'dir.all': '全部作品',
    'dir.genres': '热门分类标签',
    'dir.status': '连载状态',
    'dir.active': '连载中',
    'dir.completed': '已完结',
    'dir.soon': '敬请期待',
    'dir.sort': '排序准则',
    'dir.recent': '最新发布',
    'dir.popular': '人气最高',
    'dir.alphabetical': '拼音首字母',

    // Comic Detail
    'detail.synopsis': '剧情梗概',
    'detail.chapters': '章节与回数列表',
    'detail.pages': '页数',
    'detail.artist': '作画监督',
    'detail.writer': '原著编剧',
    'detail.added': '上架日期',
    'detail.status': '出版进度',
    'detail.readButton': '立即开始阅读',
    'detail.addToLibrary': '已加书架',
    'detail.addLibraryAction': '加入我的书架',
    'detail.removeLibraryAction': '移出我的书架',
    'detail.comments': '社区漫友吐槽空间',
    'detail.loginComment': '请在登录账号后提交您的评论发言。',

    // Reading
    'read.prev': '上一章节',
    'read.next': '下一章节',
    'read.allChapters': '章节列表',

    // Profile
    'profile.title': '个人信息页',
    'profile.rol': '账号等级权限',
    'profile.joined': '注册加入时刻',
    'profile.vip': '⭐ VIP 黄金赞助商',
    'profile.donor': '💖 温暖赞助者',
    'profile.roleAdmin': '首席运营管理员',
    'profile.roleLector': '新秀漫迷读者',
    'profile.notifications': '精准推送通知服务',
    'profile.sub': '太棒了！已成功开启系统推送，更新动态将第一时间送达您的设备。',
    'profile.unsub': '点按下方按钮开启通知总开关，掌握漫画作品连载情况。',
    'profile.subButton': '🔔 激活消息警报',
    'profile.logout': '安全退出账号',
    'profile.loginPrompt': '即刻登录即可解锁追更、收藏、评论及互动吐槽等专属高级功能。',
    'profile.loginButton': '极速登录 Nexus 漫画世界',

    // Settings Modal (Gear)
    'settings.title': '个性化系统设置',
    'settings.language': '多国语言语言切换',
    'settings.theme': '全局视觉主题切换',
    'settings.themeLight': '清新明亮模式',
    'settings.themeDark': '护眼暗黑夜色',
    'settings.close': '确认并保存',

    // Admin / Studio
    'admin.headline': '内容创作者工作室',
    'admin.addWork': '新建漫画专案',
    'admin.allWorks': '全部在线版权漫画',
    'admin.tags': '筛选关键词标签',
    'admin.tagsSearch': '搜索或过滤关联词...',
  },
  th: {
    // Nav
    'nav.home': 'หน้าแรก',
    'nav.directory': 'สารบัญการ์ตูน',
    'nav.library': 'ห้องสมุดฉัน',
    'nav.donate': 'สนับสนุนผู้พัฒนา',
    'nav.profile': 'โปรไฟล์สมาชิก',
    'nav.admin': 'สตูดิโอผู้พัฒนา',

    // Home / Search
    'home.title': 'TU MANGAX',
    'home.subtitle': 'อ่านมังงะ มังฮวา และเว็บตูน คมชัดที่สุดเต็มอรรถรส',
    'home.searchPlaceholder': 'ค้นหาการ์ตูนด้วยชื่อ, ประเภท, นักวาด หรือผู้เขียน...',
    'home.popular': '🔥 เรื่องฮิตแนะนำ',
    'home.recent': '✨ ตอนล่าสุดที่อัปเดตวันนี้',
    'home.carouselTitle': 'แนะนำภาพดีของวันนี้!',
    'home.emptySearch': 'ไม่พบภาพหรือมังงะที่สอดคล้องกับคำค้นหาของคุณ',

    // Directory
    'dir.title': 'คอลเลกชันมังงะ',
    'dir.filters': 'เครื่องมือคัดกรองค้นหา',
    'dir.type': 'ประเภทหลัก',
    'dir.all': 'เรื่องทั้งหมด',
    'dir.genres': 'หมวดหมู่ยอดนิยม',
    'dir.status': 'สถานะการอัปโหลด',
    'dir.active': 'กำลังดำเนินการ',
    'dir.completed': 'จบบริบูรณ์',
    'dir.soon': 'พบกันเร็วๆ นี้',
    'dir.sort': 'เรียงลำดับการดู',
    'dir.recent': 'เข้าร่วมใหม่ล่าสุด',
    'dir.popular': 'เป็นที่นิยมสูงสุด',
    'dir.alphabetical': 'เรียงตาม ก-ฮ',

    // Comic Detail
    'detail.synopsis': 'เรื่องย่ออย่างเป็นทางการ',
    'detail.chapters': 'รายการตอนและตอนมังฮวา',
    'detail.pages': 'หน้า',
    'detail.artist': 'ศิลปินผู้วาด',
    'detail.writer': 'นักเขียนเรื่อง',
    'detail.added': 'วันที่เพิ่มเข้ามา',
    'detail.status': 'ความคึกคัก',
    'detail.readButton': 'เริ่มอ่านตอนเริ่มต้น',
    'detail.addToLibrary': 'ติดตามอยู่',
    'detail.addLibraryAction': 'เพิ่มเข้ารายชื่อเรื่องโปรด',
    'detail.removeLibraryAction': 'ลบออกจากรายชื่อเรื่องโปรด',
    'detail.comments': 'รวมความคิดเห็นจากแฟนมังงะ',
    'detail.loginComment': 'กรุณาเข้าสู่ระบบก่อนเพื่อความปลอดภัยในการพิมพ์คอมเมนต์',

    // Reading
    'read.prev': 'ตอนที่แล้ว',
    'read.next': 'ตอนถัดไป',
    'read.allChapters': 'หน้าต่างตอนทั้งหมด',

    // Profile
    'profile.title': 'หน้าจอโปรไฟล์ภาพรวม',
    'profile.rol': 'สิทธิ์ของรหัสผู้ใช้',
    'profile.joined': 'เข้าร่วมเป็นพวกเราเมื่อ',
    'profile.vip': '⭐ แฟนคลับสปอนเซอร์ VIP',
    'profile.donor': '💖 ผู้บริจาคเพื่อโลกมังงะ',
    'profile.roleAdmin': 'ผู้ดูแลระบบสูงสุด',
    'profile.roleLector': 'ผู้อ่านเน็กซัสระดับเริ่มต้น',
    'profile.notifications': 'การแจ้งเตือนทันใจแบบเรียลไทม์',
    'profile.sub': 'ยินดีด้วย! คุณเปิดการแจ้งเตือนแล้ว และระบบจะแชร์ข่าวสารความคืบหน้าให้คุณทราบก่อนใคร',
    'profile.unsub': 'ติ๊กรับแจ้งเตือนเพื่อไม่พลาดความเคลื่อนไหวตอนใหม่ล่าสุดสำหรับการ์ตูนบนชั้นวางของคุณ',
    'profile.subButton': '🔔 เปิดกระดิ่งระบบแจ้งเตือน',
    'profile.logout': 'ล็อคเอาท์บัญชีผู้ใช้นี้',
    'profile.loginPrompt': 'สมัครสมาชิกเพื่อให้คุณเซฟมังงะในชั้น พิมพ์ความคิดเห็น และเก็บสิทธิพิเศษอื่นๆ ได้จริง',
    'profile.loginButton': 'เชื่อมต่อบัญชีเข้าสู่โลกการ์ตูน Nexus',

    // Settings Modal (Gear)
    'settings.title': 'การปรับแต่งค่าหลัก',
    'settings.language': 'ภาษาแสดงในแอปพลิเคชัน',
    'settings.theme': 'ความสว่างหน้าจอแสดงผล',
    'settings.themeLight': 'โหมดไฟกลางวันสว่าง',
    'settings.themeDark': 'โหมดถนอมสายตาค่ำคืน',
    'settings.close': 'ตรวจสอบข้อมูลเสร็จสิ้น',

    // Admin / Studio
    'admin.headline': 'ระบบหลังบ้านนักสร้างสรรค์การ์ตูน',
    'admin.addWork': 'สร้างหัวข้อการ์ตูนเรื่องใหม่',
    'admin.allWorks': 'รายการการ์ตูนที่แชร์ทั้งหมด',
    'admin.tags': 'แท็กค้นหาที่พบบ่อย',
    'admin.tagsSearch': 'ค้นหาตัวช่วยแท็กเร่งด่วน...',
  }
};
