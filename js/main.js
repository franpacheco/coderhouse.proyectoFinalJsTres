const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];

const contenedorCursos = document.querySelector("#cursos");
const portfolioVacio = document.querySelector("#portfolio-vacio");
const portfolioCursos = document.querySelector("#portfolio-cursos");
const portfolioTotal = document.querySelector("#portfolio-total");
const checkoutBtn = document.querySelector("#checkout-btn");
const vaciarBtn = document.querySelector("#vaciar-btn");

let cursos = [];

fetch("./data/cursos.json")
    .then((res) => res.json())
    .then((data) => {
        cursos = [...data];
        mostrarCursos(cursos); // Llama a la función mostrarCursos() después de obtener los datos
    })
    .catch((error) => {
        console.error("Error al cargar los cursos:", error);
    });

// Función para mostrar los cursos en la página
const mostrarCursos = (cursos) => {
    cursos.forEach((curso) => {
        let div = document.createElement("div");
        div.classList.add("curso");
        div.innerHTML = `
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
};

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

    Toastify({
        text: "producto agregado al carrito",
        duration: 3000,
        newWindow: true,
        style: {
          background: "linear-gradient(to right, #ff00f7, #f86cf3)",
          borderRadius: ".5rem"
        },
        onClick: function(){} // Callback after click
      }).showToast();
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

vaciarBtn.addEventListener("click", () => {

    Swal.fire({
        title: "¿vaciar portfolio?",
        text: "se perderan todos los productos cargados hasta el momento",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, vaciar portfolio",
        cancelButtonText: "No, Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Portfolio vacio",
            icon: "success"
          });
        }
      });

    // Vaciar el carrito (eliminar todos los elementos del arreglo)
    portfolio.splice(0, portfolio.length);

    // Actualizar la interfaz para mostrar que el carrito está vacío
    actualizarPortfolio();
});

