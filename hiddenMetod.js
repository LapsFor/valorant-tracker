function showPage(targetId) {
    // 1. Собираем все секции, у которых есть класс "page"
    const allPages = document.querySelectorAll('.page');

    // 2. Проходимся по каждой секции и прячем её (добавляем класс hidden)
    allPages.forEach(page => {
        page.classList.add('hidden');
    });

    // 3. Находим нужную нам секцию по переданному ID
    const targetPage = document.getElementById(targetId);

    // 4. Показываем её (убираем класс hidden)
    targetPage.classList.remove('hidden');
}