const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

//const comprarButton = document.getElementById('comprarButton').content

const open = document.getElementById('open');
//const modal_container = document.getElementById('modal_container');
const modal_container1 = document.getElementById('modal_container1');
const close= document.getElementById('close');

let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
  fetchData()
  if(localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
  }
}) 

cards.addEventListener('click', e =>{
  addCarrito(e)
}) 


items.addEventListener('click', e =>{
   btnAccion(e)
})
const fetchData = async () =>  {
  try{
    const res = await fetch('api.json')
    const data = await res.json()
    pintarcards(data)

  }catch (error){
    console.log(error)
  }
}

let counter = 1;
    setInterval(function(){
      document.getElementById('radio' + counter).checked = true;
      counter++;
      if(counter > 4){
        counter = 1;
      }
    }, 4000);



const pintarcards = data => {
  data.forEach(producto =>{
    templateCard.querySelector('h5').textContent = producto.title
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute("src",producto.fotoProducto)
    templateCard.querySelector('.btn-dark').dataset.id = producto.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  cards.appendChild(fragment)
}


//Añadir al carrito

const addCarrito = e =>{
  if(e.target.classList.contains('btn-dark')){
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}
const setCarrito = objeto => {
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id, 
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
  }
  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
  }
  carrito[producto.id] = {...producto}
  pintarCarrito()

  }

  const pintarCarrito = () => {
    items.innerHTML = ''
    
    Object.values(carrito).forEach(producto =>{
      templateCarrito.querySelector('th').textContent =producto.id
      templateCarrito.querySelectorAll('td')[0].textContent = producto.title
      templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
      templateCarrito.querySelector('.btn-suma').dataset.id = producto.id
      templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
      templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
      const clone = templateCarrito.cloneNode(true)
      fragment.appendChild(clone)
     })
     items.appendChild(fragment)

     pintarFooter()

     //guardamos en el local storage
     localStorage.setItem('carrito', JSON.stringify(carrito))
  }


  const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
      `
      return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc +cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio,0)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    
    //vaciamos el carrito
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
      carrito = {}
      pintarCarrito()
    })
  }
  
  const btnAccion = e => {
    //suma de productos
    if(e.target.classList.contains('btn-suma')){
      const producto = carrito[e.target.dataset.id]
      producto.cantidad++
      carrito[e.target.dataset.id] = {...producto}
      pintarCarrito()
    }
    //restamos los productos
    if(e.target.classList.contains('btn-danger')){
      const producto = carrito[e.target.dataset.id]
      producto.cantidad--
      if(producto.cantidad === 0){
        delete carrito[e.target.dataset.id]
      }
      pintarCarrito()
    }
    e.stopPropagation()
  }

  
  
  
  //open.addEventListener('click', () =>{
    //modal_container.classList.add('show');
  //});
  
  //close.addEventListener('click', () =>{
   // modal_container.classList.remove('show');
 //  });
  
  open.addEventListener('click', () =>{
    modal_container1.classList.add('show');
  });
  
  close.addEventListener('click', () =>{
    modal_container1.classList.remove('show');
    carrito = {}
      pintarCarrito()
  });
  