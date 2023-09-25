function loadCSVFromURL() {
    const urlInput = document.getElementById('googleSheetURL');
    const url = urlInput.value;

    if (url) {
        fetch(url)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const table = document.createElement('table');

            lines.forEach((line, index) => {
                var tr = document.createElement('tr');
                const cols = splitCSV(line);

                cols.forEach(col => {
                    var cell = index === 0 ? document.createElement('th') : document.createElement('td');

                    const image_check = col.includes("drive");
                    if (image_check) {
                        const link = 'http://drive.google.com/uc?export=view&id=';
                        const id = col.slice(col.indexOf('=') + 1);
                        const imgElement = document.createElement('img');
                        imgElement.src = link + id;
                        imgElement.width = "120";
                        imgElement.height = "150";
                        cell.appendChild(imgElement);
                    } else {
                        cell.textContent = col;
                    }

                    tr.appendChild(cell);
                });

                table.appendChild(tr);
            });

            document.body.appendChild(table);
            table.setAttribute("border", "0"); 
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du fichier CSV.', error);
        });
    } else {
        console.error("Aucun URL fourni.");
    }
}

function splitCSV(text) {
    let res = [];
    let quote = false; 
    let field = '';    

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === ',' && !quote) {
            res.push(field);
            field = '';
        } else if (char === '"') {
            if (quote) {
                if (i < text.length - 1 && text[i + 1] === '"') {
                    field += '"';
                    i++; 
                } else {
                    quote = false;
                }
            } else {
                quote = true;
            }
        } else {
            field += char;
        }
    }
    if (field) res.push(field);
    return res;
}
