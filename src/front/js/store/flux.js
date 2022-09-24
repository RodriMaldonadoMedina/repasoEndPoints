const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,

			productList: [],

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
					const resp = await fetch(process.env.BACKEND_URL + "/api/products");
					const data = await resp.json();
					setStore({ productList: [...store.productList, data.data]});
					// don't forget to return something, that is how the async resolves
					return true;
				} catch (error) {
					console.log("Error al cargar productos", error);
				}
			},
			cargarUsuario: async(datos) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
					method: "POST",
					headers: {
						"content-type": "application/json",
					  },
					body: JSON.stringify(datos)
					});
					if (resp.status === 400)
						alert("Usuario ya existente")
					else alert("Usuario creado exitosamente")
				}
				catch (error) {
					console.log("Error al cargar el usuario", error);
				}
			}
		}
	};
};

export default getState;
