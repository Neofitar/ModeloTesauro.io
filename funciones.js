document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const thesaurus = document.getElementById("thesaurus");
    const categoryFilters = document.getElementById("categoryFilters");
    
    let thesaurusData = [];
    let selectedCategory = "";

    // Cargar datos desde el JSON
    fetch("tesauro.json")
        .then(response => response.json())
        .then(data => {
            thesaurusData = data;
            generateCategoryFilters();
            search(""); // Mostrar todos los términos al inicio
        })
        .catch(error => console.error("Error al cargar el JSON:", error));

    // Generar botones de categorías dinámicamente
    function generateCategoryFilters() {
        const categories = [...new Set(thesaurusData.map(item => item.tematica))];
        categoryFilters.innerHTML = "";

        categories.forEach(category => createCategoryButton(category));
        createCategoryButton("Mostrar todo", true);
    }

    function createCategoryButton(category, isAll = false) {
        const button = document.createElement("button");
        button.classList.add("category-button");
        button.textContent = category;
        button.addEventListener("click", () => {
            selectedCategory = isAll ? "" : category;
            search(searchInput.value.toLowerCase());
        });
        categoryFilters.appendChild(button);
    }

    // Función de búsqueda
    function search(term) {
        thesaurus.innerHTML = "";

        const filteredTerms = thesaurusData.filter(item =>
            item.descriptor.toLowerCase().includes(term) &&
            (selectedCategory === "" || item.tematica === selectedCategory)
        );

        if (filteredTerms.length === 0) {
            thesaurus.innerHTML = "<p>No se encontraron resultados.</p>";
            return;
        }

        filteredTerms.forEach(item => {
            thesaurus.innerHTML += `
                <div class="term">
                    <h3>${item.descriptor}</h3>
                    <div class="meta-container">
                        <p class="meta">Temática: ${item.tematica} | ${item.codigo}</p>
                        <p class="meta">Categoría: ${item.categoria}</p>
                    </div>
                </div>`;
        });
    }

    // Ejecutar búsqueda con el botón o el input
    function executeSearch() {
        search(searchInput.value.toLowerCase());
    }

    searchInput.addEventListener("input", executeSearch);
    searchInput.addEventListener("keypress", event => {
        if (event.key === "Enter") executeSearch();
    });
    searchButton.addEventListener("click", executeSearch);
});

