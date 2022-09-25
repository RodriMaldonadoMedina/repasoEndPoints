import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Producto = () => {
	const { store, actions } = useContext(Context);

	useEffect(()=>{
		actions.cargarProductos();
	},[])

	return (
		<div className="container">
			<table className="table">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col">Description</th>
					<th scope="col">Category</th>
					<th scope="col">Price</th>
					<th scope="col">Stock</th>
				</tr>
			</thead>
			<tbody>
				{store.productList && store.productList.length > 0 ? 
					store.productList[0].map((product, index)=>{ 
						return (
							<tr key={index}>
								<th scope="row">{index+1}</th>
								<td>{product.name}</td>
								<td>{product.description}</td>
								<td>{product.category}</td>
								<td>{product.price}</td>
								<td>{product.stock}</td>
							</tr>
						);
					}) 
					: null}
			</tbody>
			</table>
		</div>
	);
};

export default Producto;