const socket = io()
console.log("Cargo ProductsJS");

socket.on("newProduct", datos =>{
    const renderFunc = (product) => {        
        
        const productList = document.getElementById("products-list");
        const productsCounter = document.getElementById("productsCounter"); 
        const newProductToInsert = document.createElement("div");
        newProductToInsert.setAttribute('id', product.code);
        newProductToInsert.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'product-card');
        newProductToInsert.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden product-card">
            <img class="w-full h-48 object-cover object-center transition duration-300 transform hover:scale-105" src="${product.thumbnails[0]}" alt="${product.title}">
            <div class="p-4">
                <div class="flex flex-row justify-between">
                    <div class="flex flex-wrap">
                        <h4 class="text-lg font-semibold mb-1 mr-2">${product.title.toUpperCase()}</h4>
                        <div class="flex mb-1">
                            <p class="text-gray-600 mr-1"><span class="bg-slate-200 text-black font-light text-xs px-2 py-0.5 rounded-md transform hover:bg-black hover:text-white hover:text-sm"><span class="font-bold">ID:</span> ${product.id}</span></p>
                            <p class="text-gray-600"><span class="bg-slate-200 text-black font-light text-xs px-2 py-0.5 rounded-md transform hover:bg-black hover:text-white hover:text-sm"><span class="font-bold">Código:</span> ${product.code}</span></p>
                        </div>
                    </div>
                    <p class="text-gray-600"><span class="bg-slate-800 text-gray-200 font-light text-xs inline-flex items-center align-middle px-2 py-1 rounded transform hover:text-white hover:text-sm"><span class="font-bold">${product.price} USD</span> </span></p>
                </div>
            <hr class="mb-2 mt-1">
            <p class="text-gray-600"><span class="bg-slate-200 text-black font-normal text-xs px-2 py-0.5 rounded-md transform hover:bg-black hover:text-white hover:text-sm"><span class="font-bold">Descripción:</span> ${product.description}</span></p>
            <p class="text-gray-600"><span class="bg-slate-200 text-black font-normal text-xs px-2 py-0.5 rounded-md transform hover:bg-black hover:text-white hover:text-sm"><span class="font-bold">Categoria:</span> ${product.category}</span></p>
            <p class="text-gray-600"><span class="bg-slate-200 text-black font-normal text-xs px-2 py-0.5 rounded-md transform hover:bg-black hover:text-white hover:text-sm"><span class="font-bold">Status:</span> ${product.status}</span></p>
            <p class="text-gray-600"><span class="bg-slate-200 text-black font-normal text-xs px-2 py-0.5 rounded-md transform hover:bg-black hover:text-white hover:text-sm"><span class="font-bold">Stock:</span> ${product.stock}</span></p>
            </div>
        </div>
        `
        productList.appendChild(newProductToInsert);
        let elementsCount = parseInt(productList.childElementCount);
        productsCounter.innerText = `PRODUCTOS: ${elementsCount}`;  
    } 
    
    renderFunc(datos);
    Toastify({
        text: `Se ha agregado el producto: ${datos.title}`,
        duration: 3500,
        gravity: "top",
        position: "right",
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c92d)'
        }
    }).showToast();
})

socket.on("deletedProduct", product =>{
    
    //busca el ID html del elemento, estos ID son los codigos de los producto por eso se usa el codigo para buscarlo en el documento
    const productToRemove = document.getElementById(product.code);
    
    if (productToRemove) {
        productToRemove.remove(); // Elimina el producto del DOM si existe
    } else {
        console.log(`No se encontró el producto con código ${product.code} cuando el emisor intento eliminarlo desde el socket`);
    }
    Toastify({
        text: `Se Elimino ${product.title} de la lista`,
        duration: 3500,
        gravity: "top",
        position: "right",
        style: {
            background: 'linear-gradient(to right, #ec0000, #ff6969)'
        }
    }).showToast();
})