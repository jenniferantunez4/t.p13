const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const comprobarId = id => (id && !!products.find(e => e.id === id));

const reemplazarProd = obj => {
	products.forEach(pr => {
		if(pr.id === obj.id){
			pr.name = obj.name
			pr.description = obj.description
			pr.price = obj.price
			pr.discount = obj.discount
			pr.image = obj.image || pr.image
			pr.category = obj.category
			return;
		}
	});
}

const crearProd = obj => {
	obj.id = products[products.length - 1].id + 1;
	obj.image = obj.image || "default-image.png"
	products.push(obj);
}

const eliminarProd = id => products = products.filter(pr => pr.id !== id)

const escribirBD = () => {
	fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const locals = {
			products,
		}
		res.render('products', locals)
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const locals = {
			pr: products.find(pr => pr.id == req.params.id),
		}
		res.render('detail', locals)
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		crearProd(req.body)
		escribirBD();
		res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const locals = {
			pr: products.find(pr => pr.id == req.params.id),
		}
		res.render('product-edit-form', locals)
	},
	// Update - Method to update
	
	update: (req, res) => {
		const id = parseInt(req.body.id, 10);
		if (comprobarId(id)) {
			pr = req.body;
			pr.id = id;
			reemplazarProd(pr)
			escribirBD()
			res.redirect('/products');
		}
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		const id = parseInt(req.params.id, 10);
		if (comprobarId(id)) {
			eliminarProd(id)
			escribirBD()
			res.redirect('/products');
		}
	}
};

module.exports = controller;