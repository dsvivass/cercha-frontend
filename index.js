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

// FUNCIONES

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

const drawElementLines = (context, coords, h_init, factor, forces) => {

    colors = {'C': '#00FF00', 'T': '#a80a0a'}

    Object.keys(coords).forEach(key => {

        context.beginPath();
        context.moveTo(coords[key][0][0] * factor, h_init - coords[key][0][1] * factor);
        context.lineTo(coords[key][1][0] * factor, h_init - coords[key][1][1] * factor);
        context.strokeStyle = colors[forces[key]['condition']];
        context.stroke();

    })

}

const drawTextForces = (context, coords, h_init, factor, forces) => {

    context.font = "18px Arial";

    Object.keys(coords).forEach(key => {

        context.fillText(
            forces[key]['value'],
            (coords[key][0][0] * factor + coords[key][1][0] * factor) / 2,
            h_init - (coords[key][0][1] * factor + coords[key][1][1] * factor) / 2
        )
    })
}

const drawSupports = (context, h_init, coord_x) => {

    // Factor de escala, respecto h_init
    const supportFactor = 1 / 10        // 1 / 10 de la altura de inicio

    // Dibujo de triangulo (Soporte articulado)
    context.fillStyle = '#03d3fc'
    context.beginPath();
    context.moveTo(0, h_init);
    context.lineTo(h_init * supportFactor, h_init + h_init * supportFactor);
    context.lineTo(- h_init * supportFactor, h_init + h_init * supportFactor);
    context.closePath();
    context.fill();

    // Dibujo de triangulo (Soporte articulado)
    context.beginPath();
    context.moveTo(coord_x, h_init);
    context.lineTo(coord_x + h_init * supportFactor, h_init + h_init * supportFactor);
    context.lineTo(coord_x - h_init * supportFactor, h_init + h_init * supportFactor);
    context.closePath();
    context.fill();

    return supportFactor // Para reutilizarlo al ubicar las flechas de reacción
}

const drawReactionAndForces = (context, h_init, supportFactor, coords, factor, requestObject, reactions) => {

    // Factor de escala, respecto h_init
    const reactionTailFactor = 1 / 5       // 1 / 5 de la altura de inicio

    context.strokeStyle = '#52545c'

    // Reaccion 1 en y

    context.beginPath();
    context.moveTo(0, h_init + h_init * supportFactor);
    context.lineTo(h_init * supportFactor / 2, (h_init + h_init * supportFactor) + h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(0, h_init + h_init * supportFactor);
    context.lineTo(0, (h_init + h_init * supportFactor) + h_init * reactionTailFactor);
    context.stroke();

    context.beginPath();
    context.moveTo(0, h_init + h_init * supportFactor);
    context.lineTo(- h_init * supportFactor / 2, (h_init + h_init * supportFactor) + h_init * supportFactor / 2);
    context.stroke();

    // Reaccion 1 en x

    context.beginPath();
    context.moveTo(0, h_init);
    context.lineTo(coords['2'][1][0] * factor * 2 / 5 , h_init);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['2'][1][0] * factor * 2 / 5, h_init);
    context.lineTo(coords['2'][1][0] * factor * 2 / 5 - h_init * supportFactor / 2, h_init - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['2'][1][0] * factor * 2 / 5, h_init);
    context.lineTo(coords['2'][1][0] * factor * 2 / 5 - h_init * supportFactor / 2, h_init + h_init * supportFactor / 2);
    context.stroke();

    // Reaccion elemento 2 en y

    context.beginPath();
    context.moveTo(coords['7'][1][0] * factor, h_init + h_init * supportFactor);
    context.lineTo(coords['7'][1][0] * factor + h_init * supportFactor / 2, (h_init + h_init * supportFactor) + h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['7'][1][0] * factor, h_init + h_init * supportFactor);
    context.lineTo(coords['7'][1][0] * factor, (h_init + h_init * supportFactor) + h_init * reactionTailFactor);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['7'][1][0] * factor, h_init + h_init * supportFactor);
    context.lineTo(coords['7'][1][0] * factor - h_init * supportFactor / 2, (h_init + h_init * supportFactor) + h_init * supportFactor / 2);
    context.stroke();

    // Reaccion 2 en x

    context.beginPath();
    context.moveTo(coords['7'][1][0] * factor, h_init);
    context.lineTo(coords['7'][1][0] * factor * 4 / 5 , h_init);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['7'][1][0] * factor, h_init);
    context.lineTo(coords['7'][1][0] * factor - h_init * supportFactor / 2, h_init - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['7'][1][0] * factor, h_init);
    context.lineTo(coords['7'][1][0] * factor - h_init * supportFactor / 2, h_init + h_init * supportFactor / 2);
    context.stroke();

    // Fuerza p1
    context.beginPath();
    context.moveTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor / 2);
    context.lineTo(coords['1'][1][0] * factor + h_init * supportFactor / 2, (h_init - coords['1'][1][1] * factor / 2) - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor / 2);
    context.lineTo(coords['1'][1][0] * factor - h_init * supportFactor / 2, (h_init - coords['1'][1][1] * factor / 2) - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor / 2);
    context.lineTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor);
    context.stroke();

    // Fuerza p2
    context.beginPath();
    context.moveTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor);
    context.lineTo(coords['1'][1][0] * factor - h_init * supportFactor / 2, (h_init - coords['1'][1][1] * factor) - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor);
    context.lineTo(coords['1'][1][0] * factor - h_init * supportFactor / 2, (h_init - coords['1'][1][1] * factor) + h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor);
    context.lineTo(coords['1'][1][0] * factor - coords['1'][1][0] * factor, h_init - coords['1'][1][1] * factor);
    context.stroke();

    // Fuerza p3
    context.beginPath();
    context.moveTo(coords['4'][1][0] * factor, h_init - coords['4'][1][1] * factor / 2);
    context.lineTo(coords['4'][1][0] * factor + h_init * supportFactor / 2, (h_init - coords['4'][1][1] * factor / 2) - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['4'][1][0] * factor, h_init - coords['4'][1][1] * factor / 2);
    context.lineTo(coords['4'][1][0] * factor - h_init * supportFactor / 2, (h_init - coords['4'][1][1] * factor / 2) - h_init * supportFactor / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(coords['4'][1][0] * factor, h_init - coords['4'][1][1] * factor / 2);
    context.lineTo(coords['4'][1][0] * factor, h_init - coords['4'][1][1] * factor);
    context.stroke();

    // Texto de fuerzas y reacciones

    context.fillStyle = '#0a27a8'
    context.font = "20px Arial"

    // Reaccion1y
    context.fillText(
        reactions['1']['y'],
        h_init * supportFactor / 2,
        (h_init + h_init * supportFactor) + h_init * reactionTailFactor

    )

    // Reaccion1x
    context.fillText(
        reactions['1']['x'],
        coords['2'][1][0] * factor * 2 / 5 - h_init * supportFactor / 2,
        h_init + h_init * supportFactor * 1.5

    )

    // Reaccion2y
    context.fillText(
        reactions['2']['y'],
        coords['7'][1][0] * factor - h_init * supportFactor * 2,
        (h_init + h_init * supportFactor) + h_init * reactionTailFactor

    )

    // Reaccion2x
    context.fillText(
        reactions['2']['x'],
        coords['7'][1][0] * factor * 4 / 5 ,
        h_init + h_init * supportFactor * 1.5

    )

    // Fuerza1
    context.fillText(
        requestObject['loads']['p1'],
        coords['1'][1][0] * factor + h_init * supportFactor / 2,
        (h_init - coords['1'][1][1] * factor / 2) - h_init * supportFactor

    )

    // Fuerza2
    context.fillText(
        requestObject['loads']['p2'],
        coords['1'][1][0] * factor - coords['1'][1][0] * factor,
        (h_init - coords['1'][1][1] * factor) + h_init * supportFactor

    )

    // Fuerza3
    context.fillText(
        requestObject['loads']['p3'],
        coords['4'][1][0] * factor + h_init * supportFactor / 2,
        (h_init - coords['4'][1][1] * factor / 2) - h_init * supportFactor

    )

}

const processResults = (response) => {
    console.log(response);
    const coords = calculateElementCoordinates()

    const img = document.querySelector('img');
    img.style.display = 'none'; // ocultar imagen

    const canvas = document.getElementById('canvas'); 
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.6;
    const context = canvas.getContext('2d'); // El canvas crea un lienzo de dibujo fijado que expone uno o mas contextos renderizados, 
                        // los cuales son usados para crear y manipular el contenido mostrado. Nos enfocaremos en renderizacion de contextos 2D.
                        
    context.scale(0.7, 0.7)

    // Factor de escala, para que a + b => 300px
    const factor = parseFloat(canvas.width) / (parseFloat(a.value) + parseFloat(b.value))

    // Altura vertical de partida, se utiliza para manejar el eje y negativo
    // el canvas toma y+ hacia abajo y x+ hacia la derecha
    var h_init = parseFloat(h.value) * factor * 1.1

    drawElementLines(context, coords, h_init, factor, response['forces'])
    drawTextForces(context, coords, h_init, factor, response['forces'])
    supportFactor = drawSupports(context, h_init, coords['7'][1][0] * factor)
    drawReactionAndForces(context, h_init, supportFactor, coords, factor, requestObject, response['reactions'])
};

document.getElementById('btnSubmit').onclick = function () {

    // const url = 'localhost:3000'

    // const request = await fetch('url')
    // const response = await request.json()

    fetch('http://localhost:3008/truss-solver', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestObject),
    })
    .then((res) => res.json())
    .then((res) => processResults(res));

    // const response = {
    //     "forces": {
    //         "1": {
    //             "value": 111,
    //             "condition": "T"
    //         },
    //         "2": {
    //             "value": 222,
    //             "condition": "C"
    //         },
    //         "3": {
    //             "value": 333,
    //             "condition": "T"
    //         },
    //         "4": {
    //             "value": 444,
    //             "condition": "T"
    //         },
    //         "5": {
    //             "value": 555,
    //             "condition": "C"
    //         },
    //         "6": {
    //             "value": 666,
    //             "condition": "T"
    //         },
    //         "7": {
    //             "value": 777,
    //             "condition": "T"
    //         }
    //     },

    //     "reactions": {
    //         "1": {
    //             "x": 123,
    //             "y": 321
    //         },
    //         "2": {
    //             "x": 789,
    //             "y": 987
    //         }
    //     }
        
    // }
    // processResults(response)
}

