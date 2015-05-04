(function(a2, $, undefined){
	
	a1.cakeQuantities = {};
	a1.cookiesQuantities = {};
	a1.cakeIngredients = [];
	a1.cookiesIngredients = [];
	var cakeRecipe;
	var cookiesRecipe;
	
	a1.start = function(hookElement, dataUrlForJsonFile){
		$.ajax({url: dataUrlForJsonFile}).success(function(data){
			var a1_html = $("<div id='main' class='starter-template'><h1>Cake Baby Bakery</h1><ul style='list-style-type:none'><li>Number of cakes<form><input type='number' id='nCakes' min=0></form></li><br><br><li>Number of cookies<form><input type='number' id='nCookies' min=0></form></li></ul></div>");
			a1_html.appendTo(hookElement);
			var buttonCalc = $("<div id='calculate'><button id='calc' class='btn-success' type='button'>Calculate total cost</div>");
			buttonCalc.appendTo(hookElement);
			var buttonRecalc = $("<br><div id='calculate'><button id='again' class='btn-warning' type='button'>Calculate again</div>");
				buttonRecalc.appendTo(hookElement);
			parseJsonData(data);
			var display_html = $("<div id='recipes'></div>");
			display_html.appendTo(hookElement);
			
			//when clicking the button, it retrieves the total
			$("#calc").click(function(){
				$("#recipes").empty();
				var numberOfCakes = nCakes.value;
				var numberOfCookies = nCookies.value;
				numberOfCakes = numberOfCakes || 0;
				numberOfCookies = numberOfCookies || 0;
				
				cakeRecipe.displayIngredientsAmounts(numberOfCakes);
				cakeRecipe.costOfRecipe(numberOfCakes);
				cookiesRecipe.displayIngredientsAmounts(numberOfCookies);
				cookiesRecipe.costOfRecipe(numberOfCookies);
				calculateCostPerSupplier(numberOfCakes, numberOfCookies, "Wholesale Baking");
				calculateCostPerSupplier(numberOfCakes, numberOfCookies, "Pete's Farm Fresh Ingredients");
				
				calculateTotal(numberOfCakes, numberOfCookies);
				$("#main").slideUp(3000);
			});
			
			$("#again").click(function(){
				$("#recipes").empty();
				$("#main").slideDown("slow");
				
			});
			
		});
	}
	
	
	//parses and organizes all the data for the assignment
	var parseJsonData = function(data){
		
		for(var key in data.recipes[0].ingredients){
			a1.cakeQuantities[key] = data.recipes[0].ingredients[key];
		}
		for(var key in data.recipes[1].ingredients){
			a1.cookiesQuantities[key] = data.recipes[1].ingredients[key];
		}
		
		$.each(data.products, function(i, product){
			for(var key in a1.cakeQuantities){
				if(key == product.name){
					a1.cakeIngredients.push(new a1.Product(product.name, product.cost, product.per, product.supplier, a1.cakeQuantities[key]));
				}
			}
			
			for(var key in a1.cookiesQuantities){
				if(key == product.name){
					a1.cookiesIngredients.push(new a1.Product(product.name, product.cost, product.per, product.supplier, a1.cookiesQuantities[key]));
				}
			}
		});
		
		cakeRecipe = new a1.Recipe(data.recipes[0].name, a1.cakeIngredients);
		cookiesRecipe = new a1.Recipe(data.recipes[1].name, a1.cookiesIngredients);
		
		console.log(a1.cakeQuantities);
		console.log(a1.cookiesQuantities);
		console.log(a1.cakeIngredients);
		console.log(a1.cookiesIngredients);
	}//parse data
	
	//calculates the amount per supplier	
	var calculateCostPerSupplier = function(numberOfCakes, numberOfCookies, supplier_name){
		var cost_per_supplier = 0;
		var cost_per_supplier_cake = 0;
		var cost_per_supplier_cookies = 0;
		$.each(cakeRecipe.ingredients,function(i, ingredient){
			if(ingredient.supplier == supplier_name){
					cost_per_supplier_cake += ingredient.cost * ingredient.amount;
			}
		});
		cost_per_supplier_cake = cost_per_supplier_cake * numberOfCakes;
		$.each(cookiesRecipe.ingredients,function(i, ingredient){
			if(ingredient.supplier == supplier_name){
					cost_per_supplier_cookies += ingredient.cost * ingredient.amount;
			}
		});
		cost_per_supplier_cookies = cost_per_supplier_cookies * numberOfCookies;
		cost_per_supplier = cost_per_supplier_cake + cost_per_supplier_cookies;
		var displayCostPerSupplier = "<h3>Total cost from " + supplier_name + ": $"+ cost_per_supplier+"</h3>";
		$("#recipes").append(displayCostPerSupplier);
	}
	
	
	//calculates the total of everything
	var calculateTotal = function(numberOfCakes, numberOfCookies){
		var total = 0;
		var totalCake = 0;
		var totalCookies = 0;
		$.each(cakeRecipe.ingredients,function(i, ingredient){
			totalCake += ingredient.cost * ingredient.amount;
		});
		totalCake = totalCake * numberOfCakes;
		
		$.each(cookiesRecipe.ingredients,function(i, ingredient){
			totalCookies += ingredient.cost * ingredient.amount;
		});
		totalCookies = totalCookies * numberOfCookies
		total = totalCake + totalCookies;
		var displayTotal = "<h1>Total cost of the order: $"+ total +"</h1>";
		$("#recipes").append(displayTotal);
	}
	
	a1.Product = function(name, cost, per, supplier, amount){
		this.name = name;
		this.cost = cost;
		this.per = per;
		this.supplier = supplier;
		this.amount = amount;
	} //product class
	
	a1.Recipe = function(recipe_name, ingredients){
		this.recipe_name = recipe_name;
		this.ingredients = ingredients;
		
		this.displayIngredientsAmounts = function(numberOfRecipes){
			var recipe_name = this.recipe_name;
			var recipeDisplay = "<h2>"+ recipe_name +"</h2>";
			var ingrRecipe = this.ingredients;
			
			console.log(ingrRecipe);
			$.each(ingrRecipe, function(i, ingredient){
				var ingAmount = ingredient.amount * numberOfRecipes;
				recipeDisplay += "<p> Amount of "+ ingredient.name +" from "+ ingredient.supplier +" for "+ numberOfRecipes + " " + recipe_name +" = "+ ingAmount +" "+ ingredient.per +"</p>";
			});
			$("#recipes").append(recipeDisplay);
		}
		
		this.costOfRecipe= function(numberOfRecipes){
			var recipe_name = this.recipe_name;
			var totalCostOfRecipe = 0;
			$.each(this.ingredients, function(i, ingredient){
				totalCostOfRecipe += ingredient.cost * ingredient.amount; 
			});
			totalCostOfRecipe = numberOfRecipes * totalCostOfRecipe;
			var showCostOfRecipe = "<h3>Total cost of " + numberOfRecipes+" recipes of "+ recipe_name + ": $"+ totalCostOfRecipe +"</h3>";
			$("#recipes").append(showCostOfRecipe);
		}
	}//recipe classs
	
})(window.a1 = window.a1 || {}, jQuery) //namespace