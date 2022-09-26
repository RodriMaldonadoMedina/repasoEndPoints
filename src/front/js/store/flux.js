const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,

			productList: [],
			token: null,
			cart: [],

			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			cargarProductos: async() =>{
				let store = getStore();
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/products", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							  "Authorization": 'Bearer '+ store.token
						}});
					const data = await resp.json();
					setStore({ productList: [...store.productList, data.data]});
					// don't forget to return something, that is how the async resolves
					return true;
				} catch (error) {
					console.log("Error al cargar productos", error);
				}
			},
			//cargarCarrito: 
			cargarUsuario: async(datos) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
					method: "POST",
					headers: {
						"content-type": "application/json",
					  },
					body: JSON.stringify(datos)
					});
					const data = await resp.json();
					if (resp.status === 400)
						console.log(data.message)
					else console.log("Usuario creado exitosamente")
				}
				catch (error) {
					console.log("Error al cargar el usuario", error);
				}
			},
			loguearUsuario: async(datos) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: {
							"content-type": "application/json",
						},
						body: JSON.stringify(datos)
					});
					const data = await resp.json();
					if (resp.status === 401){
						console.log(data.message);
					} 
					else 
						if(resp.status === 400){
						console.log("Invalid email or password format")
				    	} 
						else{
							sessionStorage.setItem("token", data.token);
							setStore({token: data.token});
						}
				}
				catch (error) {
					console.log("Error al loguear el usuario", error);
				}
			},
			logout: ()=>{
				let store = getStore();
				fetch(process.env.BACKEND_URL + "/api/logout", {
				  method: "DELETE",
				  headers: {
					"Authorization": "Bearer " + store.token,
					"Content-Type": "application/json",
				  },
				})
				  .then(resp => resp.json())
				  .then((data) => {
					setStore({token: null});
					sessionStorage.removeItem("token");
				  })
				  .catch(error=>console.log(error));
			  }
		}
	};
};

export default getState;
