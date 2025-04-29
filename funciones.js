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
            thesaurusData = data.map(item => ({
                ...item,
                descriptorLower: item.descriptor.toLowerCase()
            }));
            generateCategoryFilters();
            search(""); // Mostrar todos los términos al inicio
        })
        .catch(error => console.error("Error al cargar el JSON:", error));

    // Generar botones de categorías dinámicamente (sin "Mostrar todo")
    function generateCategoryFilters() {
        const categories = [...new Set(thesaurusData.map(item => item.tematica))];
        categoryFilters.innerHTML = "";

        categories.forEach(category => createCategoryButton(category));
    }

    function createCategoryButton(category) {
        const button = document.createElement("button");
        button.classList.add("category-button");
        button.textContent = category;
        button.addEventListener("click", () => {
            selectedCategory = category;
            search(searchInput.value.toLowerCase());
        });
        categoryFilters.appendChild(button);
    }

    // Función de búsqueda optimizada
    function search(term) {
        thesaurus.innerHTML = "";

        const filteredTerms = thesaurusData.filter(item =>
            item.descriptorLower.includes(term) &&
            (selectedCategory === "" || item.tematica === selectedCategory)
        );

        if (filteredTerms.length === 0) {
            const noResult = document.createElement("p");
            noResult.textContent = "No se encontraron resultados.";
            thesaurus.appendChild(noResult);
            return;
        }

        const fragment = document.createDocumentFragment();
        filteredTerms.forEach(item => {
            const termDiv = document.createElement("div");
            termDiv.classList.add("term");

            const title = document.createElement("h3");
            title.textContent = item.descriptor;

            const metaContainer = document.createElement("div");
            metaContainer.classList.add("meta-container");

            const meta = document.createElement("p");
            meta.classList.add("meta");
            meta.innerHTML = `<strong>Temática:</strong> ${item.tematica} | ${item.codigo}`;

            const origen = document.createElement("p");
            origen.classList.add("origen");
            origen.innerHTML = `<strong>Origen:</strong> ${item.origen}`;

            metaContainer.appendChild(meta);
            metaContainer.appendChild(origen);

            termDiv.appendChild(title);
            termDiv.appendChild(metaContainer);
            fragment.appendChild(termDiv);
        });

        thesaurus.appendChild(fragment);
    }

    // Ejecutar búsqueda con el input o botón
    function executeSearch() {
        // Reiniciar categoría seleccionada al buscar manualmente
        selectedCategory = "";
        search(searchInput.value.toLowerCase());
    }

    searchInput.addEventListener("input", executeSearch);
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") executeSearch();
    });
    searchButton.addEventListener("click", executeSearch);
});
