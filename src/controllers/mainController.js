const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

const controller = {
	index: (req, res) => {
		const locals = {
			visited: products.filter(pr => pr.category === 'visited'),
			inSale: products.filter(pr => pr.category === 'in-sale'),
		}
		res.render('index', locals)
	},
	search: (req, res) => {
		const search = removeAccents(req.query.keywords.toLowerCase().trim());
		const locals = {
			res: products.filter(pr => removeAccents(pr.name.toLowerCase()).includes(search))
		}
		res.render('results', locals)
	},
};

module.exports = controller;
