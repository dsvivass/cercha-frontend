// TRAER ELEMENTOS DEL DOM

// Dimensiones
const a = document.getElementById('a');
const b = document.getElementById('b');
const c = document.getElementById('c');
const d = document.getElementById('d');
const h = document.getElementById('h');

// Cargas
const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');
const p3 = document.getElementById('p3');

// Propiedades
const area = document.getElementById('area');
const elasticity = document.getElementById('elasticity');

const inputElements = [a, b, c, d, h, p1, p2, p3, area, elasticity];

// Crear objeto para enviar al backend

var requestObject = {
    dimensions: {},
    loads: {},
    properties: {}
}

// EVENTOS
inputElements.forEach(element => {

    if (element == a || element == b || element == c || element == d || element == h) {
        element.addEventListener('input', (e) => {
            requestObject['dimensions'][e.target.id] = parseFloat(e.target.value);
        });
    }

    if (element == p1 || element == p2 || element == p3) {
        element.addEventListener('input', (e) => {
            requestObject['loads'][e.target.id] = parseFloat(e.target.value);
        });
    }

    if (element == area || element == elasticity) {
        element.addEventListener('input', (e) => {
            requestObject['properties'][e.target.id] = parseFloat(e.target.value);
        });
    }

})

// FUNCION PARA CALCULAR COORDENADAS DE LOS ELEMENTOS

const calculateElementCoordinates = () => {

    var coordsObject = {}

    // Lista de listas [[coord inicial], [coord final]]
    // Elemento 1
    coordsObject['1'] = [
        [0, 0],
        [parseFloat(c.value), parseFloat(h.value)]
    ];

    // Elemento 2
    coordsObject['2'] = [
        [0, 0],
        [parseFloat(a.value), 0]
    ];

    // Elemento 3
    // [[coord final elemento 1], [coord final elemento 2]]
    coordsObject['3'] = [coordsObject['1'][1], coordsObject['2'][1]];

    // Elemento 4
    // [[coord final elemento 1], [a + b - d, h]]
    coordsObject['4'] = [
        coordsObject['1'][1],
        [parseFloat(a.value) + parseFloat(b.value) - parseFloat(d.value), parseFloat(h.value)]
    ];

    // Elemento 5
    // [[coord final elemento 2], [coord final elemento 4]]
    coordsObject['5'] = [coordsObject['2'][1], coordsObject['4'][1]];

    // Elemento 6
    // [[coord final elemento 4], [a + b, 0]
    coordsObject['6'] = [coordsObject['4'][1],
        [parseFloat(a.value) + parseFloat(b.value), 0]
    ];

    // Elemento 7
    // [[coord final elemento 2], [coord final elemento 6]]
    coordsObject['7'] = [coordsObject['2'][1], coordsObject['6'][1]];

    return coordsObject

}

const drawElementLines = (canvas, coords, h, factor) => {

    const context = canvas.getContext('2d');

    context.scale(0.7, 0.7)

    // Altura vertical de partida
    var h = parseFloat(h.value) * factor * 1.1

    Object.keys(coords).forEach(key => {

        context.beginPath();
        context.moveTo(coords[key][0][0] * factor, h - coords[key][0][1] * factor);
        context.lineTo(coords[key][1][0] * factor, h - coords[key][1][1] * factor);
        context.strokeStyle = '#00ff00';
        context.stroke();

    })

}

const drawTextForces = (canvas, coords, h, factor) => {

    const context = canvas.getContext('2d');

    // Altura vertical de partida
    var h = parseFloat(h.value) * factor * 1.1

    context.font = "8px Arial";

    Object.keys(coords).forEach(key => {

            context.fillText(key,

                (coords[key][0][0] * factor + coords[key][1][0] * factor) / 2,
                h - (coords[key][0][1] * factor + coords[key][1][1] * factor) / 2)
        })
}

document.getElementById('btnSubmit').onclick = function () {

    const coords = calculateElementCoordinates()
    const canvas = document.getElementById('canvas');

    // Factor de escala, para que a + b => 300px
    const factor = parseFloat(canvas.width) / (parseFloat(a.value) + parseFloat(b.value))

    // h se utiliza para manejar el eje y negativo
    drawElementLines(canvas, coords, h, factor)

    drawTextForces(canvas, coords, h, factor)




}