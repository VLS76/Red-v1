document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS INICIALES ---
    const initialPeopleData = [
        { id: "Ana García", Especie: ["Ovina", "Caprina"], Tecnología: ["Identificación y monitorización", "Biosensores"], Lineas: ["Salud animal"], Rol: "IP", Institución: "IRTA" },
        { id: "Beatriz Soler", Especie: ["Ovina"], Tecnología: ["Analisis de imágenes"], Lineas: ["Reproducción y mejora genética"], Rol: "Postdoc", Institución: "IRTA" },
        { id: "Carlos Ruiz", Especie: ["Caprina"], Tecnología: ["Ciencia de datos", "Biosensores"], Lineas: ["Salud animal", "Comportamiento animal"], Rol: "Predoc", Institución: "IRTA" },
        { id: "David Jiménez", Especie: ["Vacuna"], Tecnología: ["Automatización y robots", "Posicionamiento y navegación"], Lineas: ["Optimización de recursos"], Rol: "IP", Institución: "UdL/Agrotecnio" },
        { id: "Elena Navarro", Especie: ["Vacuna", "Porcina"], Tecnología: ["Detección y medición"], Lineas: ["Monitoreo de emisiones"], Rol: "Técnico", Institución: "UdL/Agrotecnio" },
        { id: "Fernando Moreno", Especie: ["Porcina"], Tecnología: ["Analisis de imágenes", "Ciencia de datos"], Lineas: ["Comportamiento animal"], Rol: "IP", Institución: "CSIC/INIA" },
        { id: "Gloria Vidal", Especie: ["Avícola"], Tecnología: ["Identificación y monitorización"], Lineas: ["Salud animal"], Rol: "Postdoc", Institución: "NEIKER" },
        { id: "Héctor Alonso", Especie: ["Cunícula"], Tecnología: ["Biosensores"], Lineas: ["Reproducción y mejora genética"], Rol: "Asesor científico", Institución: "UPV" },
        { id: "Irene Sánchez", Especie: ["Vacuna"], Tecnología: ["Posicionamiento y navegación"], Lineas: ["Comportamiento animal"], Rol: "Predoc", Institución: "UCO" },
        { id: "Javier Romero", Especie: ["Ovina", "Porcina"], Tecnología: ["Ciencia de datos"], Lineas: ["Optimización de recursos"], Rol: "IP", Institución: "CICYTEX" },
        { id: "Laura Martín", Especie: ["Porcina", "Avícola"], Tecnología: ["Automatización y robots"], Lineas: ["Monitoreo de emisiones"], Rol: "Postdoc", Institución: "CICYTEX" },
        { id: "Miguel Castillo", Especie: ["Caprina"], Tecnología: ["Analisis de imágenes"], Lineas: ["Salud animal"], Rol: "Técnico", Institución: "USAL" },
        { id: "Nuria Pascual", Especie: ["Vacuna"], Tecnología: ["Identificación y monitorización", "Detección y medición"], Lineas: ["Optimización de recursos"], Rol: "IP", Institución: "UCO" },
        { id: "Óscar Flores", Especie: ["Avícola"], Tecnología: ["Posicionamiento y navegación"], Lineas: ["Comportamiento animal"], Rol: "Predoc", Institución: "UAB" },
        { id: "Pilar Ibáñez", Especie: ["Ovina"], Tecnología: ["Ciencia de datos"], Lineas: ["Reproducción y mejora genética"], Rol: "Postdoc", Institución: "CSIC/INIA" }
    ];

    const filterConfig = {
        Especie: { indicators: ["Ovina", "Caprina", "Vacuna", "Porcina", "Avícola", "Cunícula"], color: "#ef4444" },
        Tecnología: { indicators: ["Identificación y monitorización", "Detección y medición", "Biosensores", "Posicionamiento y navegación", "Automatización y robots", "Analisis de imágenes", "Ciencia de datos"], color: "#3b82f6" },
        Lineas: { indicators: ["Salud animal", "Optimización de recursos", "Comportamiento animal", "Monitoreo de emisiones", "Reproducción y mejora genética"], color: "#10b981" },
        Rol: { indicators: ["IP", "Postdoc", "Predoc", "Técnico", "Asesor científico"], color: "#f97316" },
        Institución: { indicators: ["CICYTEX", "CSIC/INIA", "IRTA", "IUCA", "NEIKER", "UAB", "UCO", "UdL/Agrotecnio", "UM", "USAL", "USC/Campus Terra", "UPV"], color: "#8b5cf6" }
    };

    let peopleData = [];

    // --- GESTIÓN DE DATOS (localStorage) ---
    function saveData() {
        localStorage.setItem('peopleNetworkData', JSON.stringify(peopleData));
    }

    function loadData() {
        const savedData = localStorage.getItem('peopleNetworkData');
        if (savedData) {
            peopleData = JSON.parse(savedData);
        } else {
            peopleData = initialPeopleData;
            saveData();
        }
    }

    // --- RENDERIZADO DE LA UI ---
    const filtersContainer = document.getElementById('filters-container');
    const formFieldsContainer = document.getElementById('form-fields-container');

    function renderFiltersAndForm() {
        filtersContainer.innerHTML = '';
        formFieldsContainer.innerHTML = '';

        for (const category in filterConfig) {
            const options = filterConfig[category];
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza el nombre de la categoría

            // Crear filtros en panel izquierdo
            const filterGroup = document.createElement('details');
            filterGroup.className = 'filter-group';
            filterGroup.setAttribute('data-category', category);
            filterGroup.innerHTML = `<summary>${category}</summary><div class="filter-options"></div>`;
            const optionsContainer = filterGroup.querySelector('.filter-options');
            options.forEach(option => {
                optionsContainer.innerHTML += `
                    <label>
                        <input type="checkbox" class="filter-checkbox" data-category="${key}" value="${option}">
                        ${option}
                    </label>
                `;
            });
            filtersContainer.appendChild(filterGroup);

            // Crear campos de selección en el formulario CRUD
            /*
            const formFieldGroup = document.createElement('div');
            let selectHTML = `<label for="form-${key}">${category}:</label><select id="form-${key}" multiple>`;
            options.forEach(option => {
                selectHTML += `<option value="${option}">${option}</option>`;
            });
            selectHTML += `</select>`;
            formFieldGroup.innerHTML = selectHTML;
            formFieldsContainer.appendChild(formFieldGroup);
        }
    }
    */

    // --- LÓGICA DE VISUALIZACIÓN DE RED ---
    const networkContainer = document.getElementById('network');
    let network = null;

    function initializeNetwork() {
        const options = {
            nodes: {
                shape: 'dot',
                font: {
                    size: 14,
                    color: '#333'
                },
                borderWidth: 2
            },
            edges: {
                width: 1,
                color: {
                    color: '#848484',
                    highlight: '#0056b3',
                    hover: '#0056b3'
                },
                arrows: {
                    to: { enabled: false }
                },
                smooth: {
                    enabled: true,
                    type: "dynamic"
                }
            },
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springConstant: 0.08,
                    springLength: 100,
                    damping: 0.4,
                    avoidOverlap: 0.5
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200
            }
        };
        network = new vis.Network(networkContainer, { nodes: [], edges: [] }, options);

        network.on("click", (params) => {
            if (params.nodes.length > 0) {
                const personId = params.nodes[0];
                showPersonInfo(personId);
                loadPersonInForm(personId);
            } else {
                hidePersonInfo();
            }
        });
    }

    function updateVisualization() {
        const selectedFilters = getSelectedFilters();
        const filteredPeople = filterPeople(selectedFilters);

        const { nodes, edges } = createNetworkData(filteredPeople);

        network.setData({ nodes, edges });
    }

    function getSelectedFilters() {
        const selected = {};
        document.querySelectorAll('.filter-checkbox:checked').forEach(checkbox => {
            const category = checkbox.dataset.category;
            if (!selected[category]) {
                selected[category] = [];
            }
            selected[category].push(checkbox.value);
        });
        return selected;
    }
    
    function filterPeople(filters) {
        if (Object.keys(filters).length === 0) {
            return peopleData; // Mostrar todos si no hay filtros
        }

        return peopleData.filter(person => {
            return Object.entries(filters).some(([category, values]) => {
                 const personValue = person[category];
                 if (!personValue) return false;

                 if (Array.isArray(personValue)) {
                     return personValue.some(item => values.includes(item));
                 } else {
                     return values.includes(personValue);
                 }
            });
        });
    }

    function createNetworkData(filteredPeople) {
        const nodes = [];
        const edges = new Set();
        
        const peopleMap = new Map(filteredPeople.map(p => [p.id, p]));
        
        // Lógica de jerarquía IP/Satélite
        const institutionGroups = {};
        filteredPeople.forEach(p => {
            if (!institutionGroups[p.Institución]) {
                institutionGroups[p.Institución] = { ip: [], others: [] };
            }
            if (p.Rol === 'IP') {
                institutionGroups[p.Institución].ip.push(p);
            } else {
                institutionGroups[p.Institución].others.push(p);
            }
        });

        filteredPeople.forEach(person => {
            let isSatellite = false;
            const group = institutionGroups[person.Institución];
            if (group && group.ip.length > 0 && person.Rol !== 'IP') {
                isSatellite = true;
            }

            nodes.push({
                id: person.id,
                label: person.nombre,
                title: `${person.nombre} (${person.Rol} en ${person.Institución})`,
                value: person.Rol === 'IP' ? 30 : 15, // Tamaño del nodo
                mass: person.Rol === 'IP' ? 5 : 1, // 'Peso' para la física
                color: isSatellite ? '#f4a261' : (person.Rol === 'IP' ? '#e76f51' : '#2a9d8f')
            });
        });

        // Crear conexiones (edges)
        for (let i = 0; i < filteredPeople.length; i++) {
            for (let j = i + 1; j < filteredPeople.length; j++) {
                const personA = filteredPeople[i];
                const personB = filteredPeople[j];
                const commonality = findCommonality(personA, personB);
                if (commonality.length > 0) {
                    const edgeId = [personA.id, personB.id].sort().join('-');
                    edges.add({
                        id: edgeId,
                        from: personA.id,
                        to: personB.id,
                        title: `En común: ${commonality.join(', ')}`
                    });
                }
            }
        }
        
        return { nodes, edges: Array.from(edges) };
    }

    function findCommonality(p1, p2) {
        const common = [];
        if (p1.Institución === p2.Institución) common.push(p1.Institución);
        
        Object.keys(filterConfig).forEach(cat => {
            const key = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const val1 = p1[key] || [];
            const val2 = p2[key] || [];
            if (Array.isArray(val1) && Array.isArray(val2)) {
                const shared = val1.filter(v => val2.includes(v));
                if (shared.length > 0) common.push(...shared);
            }
        });

        return [...new Set(common)]; // Devolver únicos
    }

    // --- LÓGICA DE LA TARJETA DE INFORMACIÓN ---
    const infoCard = document.getElementById('person-info-card');
    const infoName = document.getElementById('info-name');
    const infoDetails = document.getElementById('info-details');
    
    function showPersonInfo(personId) {
        const person = peopleData.find(p => p.id === personId);
        if (!person) return;

        infoName.textContent = person.nombre;
        let detailsHtml = `<p><strong>ID:</strong> ${person.id}</p>`;
        for (const category in filterConfig) {
             const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
             const value = person[key];
             if(value && (!Array.isArray(value) || value.length > 0)) {
                detailsHtml += `<p><strong>${category}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</p>`;
             }
        }
        infoDetails.innerHTML = detailsHtml;
        infoCard.style.display = 'block';
    }

    function hidePersonInfo() {
        infoCard.style.display = 'none';
    }

    /*
    // --- LÓGICA DEL FORMULARIO CRUD ---
    const form = document.getElementById('person-form');
    const personIdInput = document.getElementById('person-id');
    const personNameInput = document.getElementById('person-name');

    function loadPersonInForm(personId) {
        const person = peopleData.find(p => p.id === personId);
        if (!person) return;

        clearForm();
        personIdInput.value = person.id;
        personNameInput.value = person.nombre;
        
        for (const category in filterConfig) {
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const select = document.getElementById(`form-${key}`);
            const personValue = person[key] || [];
            const valuesToSelect = Array.isArray(personValue) ? personValue : [personValue];
            
            for (const option of select.options) {
                option.selected = valuesToSelect.includes(option.value);
            }
        }
    }

    function clearForm() {
        form.reset();
        personIdInput.value = '';
        document.querySelectorAll('#form-fields-container select').forEach(select => {
            Array.from(select.options).forEach(opt => opt.selected = false);
        });
    }

    function handleCreate() {
        if (!personNameInput.value) {
            alert('El nombre es obligatorio.');
            return;
        }

        const newId = peopleData.length > 0 ? Math.max(...peopleData.map(p => p.id)) + 1 : 1;
        const newPerson = { id: newId, nombre: personNameInput.value };

        for (const category in filterConfig) {
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const select = document.getElementById(`form-${key}`);
            const values = Array.from(select.selectedOptions).map(opt => opt.value);
            // Si la categoría no es de selección múltiple (ej. Status, Institución), tomar solo el primer valor.
            // En esta configuración, todas son `multiple` para consistencia, pero se podría adaptar.
            newPerson[key] = values; 
        }
        
        // Simplificación: Status e Institución no deberían ser multi-selección.
        newPerson['status'] = newPerson['status'][0] || '';
        newPerson['institucion'] = newPerson['institucion'][0] || '';


        peopleData.push(newPerson);
        saveData();
        updateVisualization();
        clearForm();
    }

    function handleUpdate() {
        const idToUpdate = parseInt(personIdInput.value);
        if (!idToUpdate) {
            alert('Selecciona una persona de la red para modificar.');
            return;
        }

        const personIndex = peopleData.findIndex(p => p.id === idToUpdate);
        if (personIndex === -1) return;
        
        const updatedPerson = { id: idToUpdate, nombre: personNameInput.value };
        for (const category in filterConfig) {
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const select = document.getElementById(`form-${key}`);
            const values = Array.from(select.selectedOptions).map(opt => opt.value);
            updatedPerson[key] = values;
        }
        
        updatedPerson['status'] = updatedPerson['status'][0] || '';
        updatedPerson['institucion'] = updatedPerson['institucion'][0] || '';

        peopleData[personIndex] = updatedPerson;
        saveData();
        updateVisualization();
        showPersonInfo(idToUpdate); // Actualizar tarjeta de info
    }

    function handleDelete() {
        const idToDelete = parseInt(personIdInput.value);
        if (!idToDelete) {
            alert('Selecciona una persona de la red para eliminar.');
            return;
        }
        
        if (confirm(`¿Seguro que quieres eliminar a ${peopleData.find(p=>p.id === idToDelete).nombre}?`)) {
            peopleData = peopleData.filter(p => p.id !== idToDelete);
            saveData();
            updateVisualization();
            clearForm();
            hidePersonInfo();
        }
    }
    */

    // --- INICIALIZACIÓN Y EVENT LISTENERS ---
    loadData();
    renderFiltersAndForm();
    initializeNetwork();
    updateVisualization();

    document.getElementById('filters-container').addEventListener('change', updateVisualization);
    document.getElementById('close-card-btn').addEventListener('click', hidePersonInfo);
    
    document.getElementById('create-btn').addEventListener('click', handleCreate);
    document.getElementById('update-btn').addEventListener('click', handleUpdate);
    document.getElementById('delete-btn').addEventListener('click', handleDelete);
    document.getElementById('clear-form-btn').addEventListener('click', clearForm);
});
