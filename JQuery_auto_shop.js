//step-2(a): add jQuery ready method to hold all the code in this script 
$(function () {
	function Car(id, car_make, car_model, car_year, car_type, car_color, car_price, car_mileage) {
		this.stockid = id;
		this.make = car_make;
		this.model = car_model;
		this.year = car_year;
		this.type = car_type;
		this.color = car_color;
		this.price = car_price;
		this.mileage = car_mileage;
		this.quantity = 0;
		this.display = function () {
			var this_str = "<td>" + this.stockid + "</td><td>" + this.make + "</td>";
			this_str += "<td>" + this.model + "</td><td>" + this.year + "</td><td>" + this.type + "</td>";
			this_str += "<td>" + this.color + "</td><td>$" + this.price + "</td>";
			this_str += "<td>" + this.mileage + "</td>";

			return this_str;
		}
	}

	var car_list = [];
	car_list.push(new Car(1001, "Toyota", "Camry", 2011, "Sedan", "Gray", 17555, 55060));
	car_list.push(new Car(1002, "Volvo", "s40", 2013, "Sedan", "Black", 15575, 20350));
	car_list.push(new Car(1251, "Toyota", "Sienna", 2008, "Minivan", "Gray", 15775, 70000));
	car_list.push(new Car(1321, "Porsche", "Panamera", 2012, "SUV", "Red", 104250, 10567));
	car_list.push(new Car(1904, "Honda", "Accord", 2009, "Sedan", "White", 13370, 35000));
	car_list.push(new Car(1855, "Toyota", "Highlander", 2008, "SUV", "Silver", 18555, 55060));
	car_list.push(new Car(1543, "Ford", "Fusion", 2011, "Sedan", "Black", 13575, 90350));
	car_list.push(new Car(1345, "Toyota", "Sienna", 2011, "Minivan", "Gray", 25775, 70000));
	car_list.push(new Car(2133, "Dodge", "Caravan", 2012, "Minivan", "Red", 30250, 17567));
	car_list.push(new Car(2999, "Lexus", "LFA", 2012, "coupe", "Red", 381370, 3500));
	car_list.push(new Car(3001, "Ferrari", "Rubino", 2012, "coupe", "Red", 354370, 5500));
	car_list.push(new Car(4002, "Audi", "R8", 2012, "SUV", "Black", 181370, 4500));


	displayDropdown();


	$('#categorySelect').on('change', function () {
		var cat = $(this).val();
		displayListing(cat);
	});


	var cart = [];

	$('#car-list').on('click', '.add-item', function () {
		var index = $(this).val();
		if (cart.indexOf(index) == -1) {
			cart.push(index);
		}
		addQty(index);
		updateShoppingCart();
	});
	$('#item-list').on('change', 'input', function () {
		updateCartItemQty(this);
		updateShoppingCart();
	});


	$('#item-list').on('click', '.delete-item', function () {
		var index = $(this).val();
		deleteItemFromCart(index);
		updateShoppingCart();
	});

	function displayDropdown() {
		var currentCat = 'select';
		var output = "<option value=\'" + currentCat + "\'>Select a category to display</option>";
		var addedCats = [];


		for (var i = 0; i < car_list.length; i++) {
			currentCat = car_list[i].type;

			if (addedCats.indexOf(currentCat) == -1) {
				addedCats.push(currentCat);
				output += "<option value='" + currentCat + "'  class='cat-select'>" + currentCat + "</option>";
			}
		}

		currentCat = "All";
		output += "<option value='" + currentCat + "'  class='cat-select'>" + currentCat + "</option>";
		$('#categorySelect').html(output);
	}


	function displayListing(cat) {
		var displayAll = false;
		if (cat == "All") {
			displayAll = true;
		}
		if (cat == "select") {
			$('#car-list tbody').html("");
		}
		var body = "";

		for (var i = 0; i < car_list.length; i++) {
			if (car_list[i].type == cat || displayAll == true) {
				body += "<tr class=\'car-item\' id=\'l-\'>" + i;
				body += car_list[i].display();
				body += "<td class='col-xs-1'><button type='button' value='" +
					i + "' class='btn btn-primary add-item'><i class='\ fas fa-cart-plus'\></i></button><td>";
				body += "</tr>";
			}
		}
		$('#car-list tbody').html(body);
	}

	function addQty(index) {
		car_list[index].quantity++;
	}


	function updateShoppingCart() {


		displayCartItems();

		updateItemTotal();

		calculateCheckoutCost();

	}

	function displayCartItems() {

		var runError = true;
		var elm = '';
		for (var i = 0; i < cart.length; i++) {
			elm += "<tr><td class=\'col-xs-1 font-weight-bold\'>" + car_list[cart[i]].stockid + "</td>";
			elm += "<td class=\'col-xs-1 font-weight-bold\'>" + car_list[cart[i]].make + "</td>";
			elm += "<td class=\'col-xs-1 font-weight-bold\'>" + car_list[cart[i]].model + "</td>";
			elm += "<td class=\'col-xs-1 font-weight-bold\'>" + car_list[cart[i]].price + "</td>";
			elm += "<td class=\'col-xs-1 font-weight-bold\'><input style=\'width:50px;\'  type=\'number\' id=\'" + cart[i] + "\' name=\'qty-" + i +
				"\' size=\'1\' value=\'" + car_list[cart[i]].quantity + "\'></td>";
			elm += "<td class=\'col-xs-1 font-weight-bold\'>" + car_list[cart[i]].type + "</td>";
			elm += "<td class=\'col-xs-1\'><button  type=\'button\' value=\'" + i + "\' class=\'delete-item btn btn-danger\'>Delete</button></td></tr>";
			runError = false;
		}
		if (runError) {
			elm += "Your cart is empty.";
		}

		$('#item-list').html(elm);
	}

	function updateCartItemQty(input) {
		var value = 0;
		value = parseInt($("#" + input.id).val());

		var index = parseInt(input.id);
		car_list[index].quantity = value;


	}


	function updateItemTotal() {
		var total = cart.length;
		$('#items').text(total);
	}

	function calculateCheckoutCost() {

		var taxRate = 0.06;
		var feeRate = 0.05;
		var subtotal = 0;
		var tax = 0;
		var fee = 0;
		var total = 0;

		var subtotal = 0;
		for (var i = 0; i < cart.length; i++) {
			subtotal += parseFloat(car_list[cart[i]].price * car_list[cart[i]].quantity);
		}
		$('#sub-total').text('$' + subtotal.toFixed(2));
		tax = subtotal * taxRate;
		$('#taxes').text('$' + tax.toFixed(2));
		fee = subtotal * feeRate;
		$('#registration').text('$' + fee.toFixed(2));
		total = subtotal + tax + fee;
		$('#total').text('$' + total.toFixed(2));

	}

	function deleteItemFromCart(index) {

		car_list[cart[index]].qty = 0;
		cart.splice(index, 1);
	}
});