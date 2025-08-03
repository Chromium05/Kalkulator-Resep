// Recipe ingredients array to store selected ingredients for current recipe
let recipeIngredients = []

// Declare formatPrice function
function formatPrice(price) {
  return `Rp ${price.toLocaleString("id-ID")}`
}

// Function to get ingredients from localStorage
function getIngredients() {
  return JSON.parse(localStorage.getItem("ingredients")) || []
}

// Function to update ingredient select dropdown
function updateIngredientSelect() {
  const ingredientSelect = document.getElementById("ingredientSelect")
  ingredientSelect.innerHTML = '<option value="">Pilih bahan...</option>'

  const ingredients = getIngredients()

  ingredients.forEach((ingredient) => {
    // Only show available ingredients
    if (!ingredient.unavailable) {
      const option = document.createElement("option")
      option.value = ingredient.id
      option.text = `${ingredient.name} (${ingredient.unit})`
      ingredientSelect.add(option)
    }
  })
}

// Function to add ingredient to recipe
function addIngredientToRecipe() {
  const ingredientSelect = document.getElementById("ingredientSelect")
  const quantityInput = document.getElementById("ingredientSelectQuantity")

  const ingredientId = Number.parseInt(ingredientSelect.value)
  const quantity = Number.parseFloat(quantityInput.value)

  if (!ingredientId || !quantity || quantity <= 0) {
    alert("Pilih bahan dan masukkan jumlah yang valid.")
    return
  }

  const ingredients = getIngredients()
  const ingredient = ingredients.find((ing) => ing.id === ingredientId)

  if (!ingredient) {
    alert("Bahan tidak ditemukan.")
    return
  }

  if (ingredient.unavailable) {
    alert("Bahan ini tidak tersedia.")
    return
  }

  // Check if ingredient already added
  const existingIndex = recipeIngredients.findIndex((ri) => ri.id === ingredientId)
  if (existingIndex !== -1) {
    // Update quantity if already exists
    recipeIngredients[existingIndex].usedQuantity = quantity
  } else {
    // Add new ingredient to recipe
    recipeIngredients.push({
      id: ingredientId,
      name: ingredient.name,
      price: ingredient.price,
      unit: ingredient.unit,
      availableQuantity: ingredient.quantity,
      usedQuantity: quantity,
    })
  }

  renderSelectedIngredients()
  updateCost()

  // Reset form
  ingredientSelect.value = ""
  quantityInput.value = ""
}

// Function to render selected ingredients
function renderSelectedIngredients() {
  const selectedList = document.getElementById("selectedIngredientsList")
  selectedList.innerHTML = ""

  if (recipeIngredients.length === 0) {
    selectedList.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-shopping-basket" style="font-size: 2rem; color: var(--text-secondary); margin-bottom: 0.5rem;"></i>
        <p class="text-muted mb-0">Belum ada bahan yang dipilih.</p>
      </div>
    `
    return
  }

  recipeIngredients.forEach((ingredient, index) => {
    const costPerUnit = ingredient.price / ingredient.availableQuantity
    const totalCost = costPerUnit * ingredient.usedQuantity

    const div = document.createElement("div")
    div.className = "selected-ingredient-item"
    div.innerHTML = `
      <div>
        <div style="font-weight: 600; color: var(--text-primary);">
          <i class="fas fa-cube" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
          ${ingredient.name} - ${ingredient.usedQuantity} ${ingredient.unit}
        </div>
        <small style="color: var(--text-secondary);">${formatPrice(totalCost)}</small>
      </div>
      <button class="modern-btn modern-btn-danger" style="padding: 0.5rem 1rem;" onclick="removeIngredientFromRecipe(${index})">
        <i class="fas fa-times"></i>
      </button>
    `
    selectedList.appendChild(div)
  })
}

// Function to remove ingredient from recipe
function removeIngredientFromRecipe(index) {
  recipeIngredients.splice(index, 1)
  renderSelectedIngredients()
  updateCost()
}

// Function to calculate total recipe cost
function calculateTotalCost() {
  let totalCost = 0
  recipeIngredients.forEach((ingredient) => {
    const costPerUnit = ingredient.price / ingredient.availableQuantity
    totalCost += costPerUnit * ingredient.usedQuantity
  })
  return totalCost
}

// Function to update cost display
function updateCost() {
  const totalCost = calculateTotalCost()
  const servings = Number.parseInt(document.getElementById("servings").value) || 1
  const costPerServing = totalCost / servings

  document.getElementById("totalCostDisplay").textContent = formatPrice(totalCost)
  document.getElementById("costPerServingDisplay").textContent = formatPrice(costPerServing)
}

// Function to save recipe
function saveRecipe(event) {
  event.preventDefault()

  const recipeName = document.getElementById("recipeName").value
  const servings = Number.parseInt(document.getElementById("servings").value)
  const cookingInstructions = document.getElementById("cookingInstructions").value

  if (!recipeName || !servings) {
    alert("Masukkan nama resep dan jumlah porsi.")
    return
  }

  if (recipeIngredients.length === 0) {
    alert("Tambahkan minimal satu bahan ke resep.")
    return
  }

  const totalCost = calculateTotalCost()
  const newRecipe = {
    id: Date.now(),
    name: recipeName,
    servings,
    ingredients: [...recipeIngredients],
    totalCost,
    costPerServing: totalCost / servings,
    cookingInstructions: cookingInstructions || "",
    createdDate: new Date().toISOString(),
  }

  const recipes = JSON.parse(localStorage.getItem("recipes")) || []
  recipes.push(newRecipe)
  localStorage.setItem("recipes", JSON.stringify(recipes))

  renderRecipes()

  // Reset form
  document.getElementById("recipeForm").reset()
  recipeIngredients = []
  renderSelectedIngredients()
  updateCost()

  alert("Resep berhasil disimpan!")
}

// Function to show recipe detail modal
function showRecipeDetail(index) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []
  const recipe = recipes[index]

  if (!recipe) return

  const modalElement = document.getElementById("recipeDetailModal")
  const modal = new window.bootstrap.Modal(modalElement)
  const content = document.getElementById("recipeDetailContent")

  // Calculate ingredient breakdown
  let ingredientBreakdown = ""
  let availableIngredientsCount = 0

  recipe.ingredients.forEach((ingredient) => {
    const costPerUnit = ingredient.price / ingredient.availableQuantity
    const totalCost = costPerUnit * ingredient.usedQuantity
    const unavailableText = ingredient.unavailable ? " (Tidak Tersedia)" : ""
    const unavailableClass = ingredient.unavailable ? "text-muted text-decoration-line-through" : ""

    if (!ingredient.unavailable) {
      availableIngredientsCount++
    }

    ingredientBreakdown += `
      <li class="list-group-item d-flex justify-content-between align-items-center ${unavailableClass}" style="border: 1px solid var(--border-color); margin-bottom: 0.5rem; border-radius: var(--border-radius-sm);">
        <span>
          <i class="fas fa-cube" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
          ${ingredient.name} (${ingredient.usedQuantity} ${ingredient.unit})${unavailableText}
        </span>
        <span style="font-weight: 600;">${ingredient.unavailable ? "N/A" : formatPrice(totalCost)}</span>
      </li>
    `
  })

  // Show warning if some ingredients are unavailable
  const unavailableWarning = recipe.ingredients.some((ing) => ing.unavailable)
    ? '<div class="alert-modern alert-warning"><strong><i class="fas fa-exclamation-triangle"></i> Perhatian:</strong> Beberapa bahan tidak tersedia. Biaya yang ditampilkan hanya untuk bahan yang tersedia.</div>'
    : ""

  content.innerHTML = `
    ${unavailableWarning}
    <div class="row">
      <div class="col-md-6">
        <div class="modern-card" style="margin-bottom: 1rem;">
          <div class="modern-card-body" style="padding: 1.5rem;">
            <h6 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-info-circle"></i> Informasi Resep</h6>
            <div class="recipe-stats">
              <div class="recipe-stat">
                <div class="recipe-stat-value">${recipe.name}</div>
                <div class="recipe-stat-label">Nama Resep</div>
              </div>
              <div class="recipe-stat">
                <div class="recipe-stat-value">${recipe.servings}</div>
                <div class="recipe-stat-label">Porsi</div>
              </div>
              <div class="recipe-stat">
                <div class="recipe-stat-value">${formatPrice(recipe.totalCost)}</div>
                <div class="recipe-stat-label">Total Biaya</div>
              </div>
              <div class="recipe-stat">
                <div class="recipe-stat-value">${formatPrice(recipe.costPerServing)}</div>
                <div class="recipe-stat-label">Biaya per Porsi</div>
              </div>
            </div>
            <p style="margin: 0; color: var(--text-secondary);"><i class="fas fa-calendar"></i> Dibuat: ${new Date(recipe.createdDate).toLocaleDateString("id-ID")}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="modern-card" style="margin-bottom: 1rem;">
          <div class="modern-card-body" style="padding: 1.5rem;">
            <h6 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-shopping-basket"></i> Bahan-bahan (${availableIngredientsCount}/${recipe.ingredients.length} tersedia)</h6>
            <ul class="list-group" style="list-style: none; padding: 0;">
              ${ingredientBreakdown}
            </ul>
          </div>
        </div>
      </div>
    </div>
    ${
      recipe.cookingInstructions
        ? `
      <div class="modern-card">
        <div class="modern-card-body" style="padding: 1.5rem;">
          <h6 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-utensils"></i> Cara Memasak</h6>
          <div style="background: var(--light-bg); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1.5rem; line-height: 1.8;">
            ${recipe.cookingInstructions.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
    `
        : ""
    }
  `

  // Set up modal buttons
  document.getElementById("editRecipeBtn").onclick = (e) => {
    e.preventDefault()
    modal.hide()
    setTimeout(() => openEditRecipeModal(index), 300) // Wait for modal to close
  }

  document.getElementById("deleteRecipeBtn").onclick = (e) => {
    e.preventDefault()
    if (confirm("Apakah kamu yakin ingin menghapus resep ini?")) {
      deleteRecipe(index)
      modal.hide()
    }
  }

  modal.show()
}

// Function to open edit recipe modal
function openEditRecipeModal(index) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []
  const recipe = recipes[index]

  if (!recipe) return

  const modalElement = document.getElementById("editRecipeModal")
  const modal = new window.bootstrap.Modal(modalElement)

  document.getElementById("editRecipeIndex").value = index
  document.getElementById("editRecipeName").value = recipe.name
  document.getElementById("editRecipeServings").value = recipe.servings
  document.getElementById("editRecipeCookingInstructions").value = recipe.cookingInstructions || ""

  modal.show()
}

// Function to handle edit recipe form submit
function handleEditRecipe(event) {
  event.preventDefault()

  const index = Number.parseInt(document.getElementById("editRecipeIndex").value)
  const name = document.getElementById("editRecipeName").value
  const servings = Number.parseInt(document.getElementById("editRecipeServings").value)
  const cookingInstructions = document.getElementById("editRecipeCookingInstructions").value

  if (!name || !servings) {
    alert("Masukkan nama resep dan jumlah porsi.")
    return
  }

  const recipes = JSON.parse(localStorage.getItem("recipes")) || []

  if (recipes[index]) {
    recipes[index].name = name
    recipes[index].servings = servings
    recipes[index].cookingInstructions = cookingInstructions || ""
    recipes[index].costPerServing = recipes[index].totalCost / servings

    localStorage.setItem("recipes", JSON.stringify(recipes))
    renderRecipes()

    // Hide modal
    const modalElement = document.getElementById("editRecipeModal")
    const modal = window.bootstrap.Modal.getInstance(modalElement)
    if (modal) {
      modal.hide()
    }

    alert("Resep berhasil diperbarui!")
  }
}

// Function to render recipes
function renderRecipes() {
  const recipesList = document.getElementById("recipesList")
  recipesList.innerHTML = ""
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []

  if (recipes.length === 0) {
    recipesList.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-utensils" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
        <p class="text-muted">Belum ada resep yang disimpan.</p>
      </div>
    `
    return
  }

  recipes.forEach((recipe, index) => {
    // Check if recipe has unavailable ingredients
    const unavailableIngredients = recipe.ingredients.filter((ing) => ing.unavailable)
    const warningBadge =
      unavailableIngredients.length > 0
        ? `<span class="badge-modern">${unavailableIngredients.length} bahan tidak tersedia</span>`
        : ""

    const recipeElement = document.createElement("div")
    recipeElement.className = "recipe-card"
    recipeElement.innerHTML = `
      <div class="recipe-title">
        <i class="fas fa-utensils"></i>
        ${recipe.name}
        ${warningBadge}
      </div>
      <div class="recipe-stats">
        <div class="recipe-stat">
          <div class="recipe-stat-value">${recipe.servings}</div>
          <div class="recipe-stat-label">Porsi</div>
        </div>
        <div class="recipe-stat">
          <div class="recipe-stat-value">${formatPrice(recipe.totalCost)}</div>
          <div class="recipe-stat-label">Total Biaya</div>
        </div>
        <div class="recipe-stat">
          <div class="recipe-stat-value">${formatPrice(recipe.costPerServing)}</div>
          <div class="recipe-stat-label">Biaya per Porsi</div>
        </div>
        <div class="recipe-stat">
          <div class="recipe-stat-value">${new Date(recipe.createdDate).toLocaleDateString("id-ID")}</div>
          <div class="recipe-stat-label">Tanggal Dibuat</div>
        </div>
      </div>
      <div class="recipe-actions">
        <button type="button" class="modern-btn modern-btn-primary" data-recipe-index="${index}">
          <i class="fas fa-eye"></i> Detail
        </button>
        <button type="button" class="modern-btn modern-btn-danger" data-delete-index="${index}">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
    `

    // Add event listeners to buttons
    const detailBtn = recipeElement.querySelector("[data-recipe-index]")
    const deleteBtn = recipeElement.querySelector("[data-delete-index]")

    detailBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      showRecipeDetail(index)
    })

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      deleteRecipe(index)
    })

    recipesList.appendChild(recipeElement)
  })
}

// Function to delete recipe
function deleteRecipe(index) {
  if (confirm("Apakah kamu yakin ingin menghapus resep ini?")) {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || []
    recipes.splice(index, 1)
    localStorage.setItem("recipes", JSON.stringify(recipes))
    renderRecipes()
  }
}

// Event listeners
document.getElementById("addIngredientToRecipe").addEventListener("click", addIngredientToRecipe)
document.getElementById("recipeForm").addEventListener("submit", saveRecipe)
document.getElementById("servings").addEventListener("input", updateCost)
document.getElementById("editRecipeForm").addEventListener("submit", handleEditRecipe)

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  updateIngredientSelect()
  renderRecipes()
})
