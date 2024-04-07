const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];

const cursos = [
    {
        id:"inicial",
        titulo:"Curso de inicial en uñas",
        precio:10000,
        img:"./img/INICIAL.png",   
    },
    {   
        id:"polygel",
        titulo:"Curso de polygel en uñas",
        precio:15000,
        img:"./img/POLYGEL.png",   
    },
    {
        id:"kapping",
        titulo:"Curso de kapping en uñas",
        precio:20000,
        img:"./img/KAPPING.png",   
    },    
    {
        id:"manicuria rusa",
        titulo:"Curso de Manicuria Rusa en uñas",
        precio:5000,
        img:"./img/MANICURIA-RUSA.png",   
    }
];

const contenedorCursos = document.querySelector("#cursos");
const portfolioVacio = document.querySelector("#portfolio-vacio");
const portfolioCursos = document.querySelector("#portfolio-cursos");
const portfolioTotal = document.querySelector("#portfolio-total");
const checkoutBtn = document.querySelector("#checkout-btn");

const incrementarCantidad = (id) => {
    const curso = portfolio.find(item => item.id === id);
    if (curso) {
        curso.cantidad++;
        actualizarPortfolio();
    }
}

const decrementarCantidad = (id) => {
    const curso = portfolio.find(item => item.id === id);
    if (curso && curso.cantidad > 1) {
        curso.cantidad--;
        actualizarPortfolio();
    }
}

cursos.forEach((curso) => {
    let div = document.createElement("div");
    div.classList.add("curso");
    div.innerHTML=`
    <img class="curso-img" src="${curso.img}">
    <h3>${curso.titulo}</h3>
    <p>$${curso.precio}</p>
    `;

    let button = document.createElement("button");
    button.classList.add("curso-btn");
    button.innerText = "Agregar al portfolio";
    button.addEventListener("click", () => {   
        agregarAlPortfolio(curso);
    });

    div.append(button);
    contenedorCursos.append(div);
});

const actualizarPortfolio = () => {
    if (portfolio.length === 0) {
        portfolioVacio.classList.remove("d-none");
        portfolioCursos.classList.add("d-none");
    } else{
        portfolioVacio.classList.add("d-none");
        portfolioCursos.classList.remove("d-none");

        portfolioCursos.innerHTML = "";
        portfolio.forEach((curso) => {        
            let div = document.createElement("div");
            div.classList.add("portfolio-curso");
            div.innerHTML = `
            <h3>${curso.titulo}</h3>
            <p>$${curso.precio}</p>
            <p>Cantidad: 
                <button class="cantidad-btn" onclick="decrementarCantidad('${curso.id}')">-</button>
                <span>${curso.cantidad}</span>
                <button class="cantidad-btn" onclick="incrementarCantidad('${curso.id}')">+</button>
            </p>
            `;

            let button = document.createElement("button");
            button.classList.add("portfolio-curso-btn");
            button.innerText = "X";
            button.addEventListener("click", () => {            
                borrarDelPortfolio(curso);
            });
            
            div.append(button);
            portfolioCursos.append(div);
        });
    }
    actualizarTotal();
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
}

const agregarAlPortfolio = (curso) => {
    const itemEncontrado = portfolio.find(item => item.id === curso.id);
    if (itemEncontrado){
        itemEncontrado.cantidad++;
    } else{
        portfolio.push( {...curso, cantidad: 1} );    
    }   
    actualizarPortfolio(); 
}

const borrarDelPortfolio = (curso) => {
    const cursoIndex = portfolio.findIndex(item => item.id === curso.id);
    portfolio.splice(cursoIndex, 1);
    actualizarPortfolio(); 
}

const actualizarTotal = () => {
    const total = portfolio.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    portfolioTotal.innerText = `$${total}`;
}

const mostrarCheckout = () => {
    const checkout = document.getElementById("checkout");
    checkout.classList.remove("d-none");
};

checkoutBtn.addEventListener("click", () => {
    mostrarCheckout();
});

document.getElementById("checkout-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Aquí podrías hacer cualquier otra cosa que necesites con los datos del formulario,
    // como enviarlos a un servidor o realizar otras operaciones necesarias.

    // Mostrar mensaje de confirmación
    alert("¡Pedido realizado con éxito! Gracias por tu compra.");
});

actualizarPortfolio();
