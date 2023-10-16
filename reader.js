var age = []
var age_counter = []
var genre = []
var genre_counter = []
var niveau = []
var niveau_counter = []
var sport = []
var sport_counter = []
var objectif = []
var objectif_counter = []
var preference = []
var preference_counter = []


function loadCSVFromURL() {
    var word_exist = 0
    const urlInput = document.getElementById('googleSheetURL');
    const url = urlInput.value;

    if (url) {
        fetch(url)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const table = document.createElement('table');
            
var number_of_ligne = 0
            lines.forEach((line, index) => {
                var tr = document.createElement('tr');
                const cols = splitCSV(line);

                var num_of_cell = 0

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
                  
 
                    if(number_of_ligne == 0){
                        const filterInput = document.createElement('input');
                        filterInput.placeholder = 'Filter...';
                        const columnIndex = cols.indexOf(col);

                        filterInput.addEventListener('input', () => {
                         
                            
                            filterData(columnIndex, filterInput.value);

                         
                        });

                      
                        if(columnIndex != 3)
                        cell.appendChild(filterInput);

                    }
                    
                    if(number_of_ligne != 0){

                    if(num_of_cell == 4){
                        if(age.includes(cell.textContent)){
                        age_counter[age.indexOf(cell.textContent)]++
                        }else{
                        age.push(cell.textContent)
                        age_counter.push(1)
                        }
                    }



                    if(num_of_cell == 5) {
                    if(genre.includes(cell.textContent)){
                        genre_counter[genre.indexOf(cell.textContent)]++
                        }else{
                        genre.push(cell.textContent)
                        genre_counter.push(1)
                        }
                    }

                    if(num_of_cell == 6){
                        if(niveau.includes(cell.textContent)){
                        niveau_counter[niveau.indexOf(cell.textContent)]++
                        }else{
                        niveau.push(cell.textContent)
                        niveau_counter.push(1)
                    }
                }



                    if(num_of_cell == 7){ 
                        if(sport.includes(cell.textContent)){
                        sport_counter[sport.indexOf(cell.textContent)]++
                        }else{
                        sport.push(cell.textContent)
                        sport_counter.push(1)
                    }
                }


                    
                    if(num_of_cell == 8){
                        if(objectif.includes(cell.textContent)){
                        objectif_counter[objectif.indexOf(cell.textContent)]++
                        }else{
                        objectif.push(cell.textContent)
                        objectif_counter.push(1)
                        }
                    }   

                    if(num_of_cell == 9){ 
                        if(preference.includes(cell.textContent)){
                    preference_counter[preference.indexOf(cell.textContent)]++
                        }else{
                            preference.push(cell.textContent)
                            preference_counter.push(1)
                    }
                }
               
               
                }
                
                    num_of_cell++
                    tr.appendChild(cell);
                  
                });

                table.appendChild(tr);
                number_of_ligne++
            });
        
            
            createPieChart(age, age_counter, "age");
            createPieChart(genre, genre_counter, "genre");
            createPieChart(niveau, niveau_counter,"niveau");
            createPieChart(sport, sport_counter,"sport");
            createPieChart(objectif, objectif_counter,"objectif");
            createPieChart(preference, preference_counter,"preference");



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




// Function to filter the data based on the input value
function filterData(colData, inputValue) {
    const rows = document.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let cellContent = '';

        for (let i = 0; i < cells.length; i++) {
            if (i === colData) {
                cellContent = cells[i].textContent || cells[i].innerText;
                if (cellContent.toLowerCase().includes(inputValue.toLowerCase())) {
                    row.style.display = '';  // Affiche la ligne si elle correspond au filtre
                    break;
                } else {
                    row.style.display = 'none';  // Cache la ligne si elle ne correspond pas au filtre
                }
            }
        }
    });
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


function createPieChart(data, dataCounter, titre_graph) {
    var width = 150;
    var height = 150;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
    .domain(data)
    .range(data.map(() => getRandomColor()));
    // Créez un conteneur pour chaque graphique
    var chartContainer = d3.select("body")
        .append("div")
        .style("display", "inline-block")
        .style("width", "30%")
        .style("margin", "10px");

    // Ajoutez le titre du graphique
    chartContainer.append("div")
        .style("font-size", "20px")
        .text(titre_graph);

    // Créez la chart dans le conteneur
    var chart = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var arcs = chart.selectAll("arc")
        .data(pie(dataCounter))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", path)
        .attr("fill", function (d, i) { return color(i); });

    var total_cl = 0
        for(cl = 0; cl<dataCounter.length;cl++)
        total_cl = total_cl + dataCounter[cl]


    arcs.append("text")
        .attr("transform", function (d) { return "translate(" + label.centroid(d) + ")"; })
      
        .text(function (d, i) { return (Number(dataCounter[i])/Number(total_cl) *100).toFixed(2)+'%'  });

    // Ajoutez la légende sous la chart
    var legend = chartContainer.append("div")
        .attr("class", "legend")
        .style("text-align", "left")
        .style("margin-top", "20px");

    legend.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .style("font-size", "14px")
        .style("display", "flex")
        .style("align-items", "center")
        .each(function (d, i) {
            var legendColor = d3.select(this)
                .append("div")
                .style("width", "20px")
                .style("height", "20px")
                .style("background-color", color(i))
                .style("margin-right", "5px");

            var legendText = d3.select(this)
                .append("div")
                .text(data[i] );
        });
}

// Fonction de génération de couleur aléatoire (utilisée pour la légende)
      

 function getRandomColor() {
  var r = Math.floor(Math.random() * 155) + 100; // Composante rouge entre 100 et 255
  var g = Math.floor(Math.random() * 155) + 100; // Composante verte entre 100 et 255
  var b = Math.floor(Math.random() * 155) + 100; // Composante bleue entre 100 et 255
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
