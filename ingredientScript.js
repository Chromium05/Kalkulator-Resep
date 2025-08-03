// Global ingredients array - using let instead of const to allow reassignment
const ingredients = JSON.parse(localStorage.getItem("ingredients")) || []

// Pagination variables
let currentPage = 1
let itemsPerPage = 5

// Function to format price with Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)
}

// Function to get paginated ingredients
function getPaginatedIngredients() {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return ingredients.slice(startIndex, endIndex)
}

// Function to calculate total pages
function getTotalPages() {
  return Math.ceil(ingredients.length / itemsPerPage)
}

// Function to render pagination info
function renderPaginationInfo() {
  const ingredientInfo = document.getElementById("ingredientInfo")
  if (ingredients.length === 0) {
    ingredientInfo.textContent = ""
    return
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, ingredients.length)
  ingredientInfo.innerHTML = `<i class="fas fa-info-circle"></i> Menampilkan ${startIndex}-${endIndex} dari ${ingredients.length} bahan`
}

// Function to render pagination buttons
function renderPagination() {
  const paginationContainer = document.getElementById("ingredientPagination")
  paginationContainer.innerHTML = ""

  const totalPages = getTotalPages()

  if (totalPages <= 1) {
    return // No pagination needed
  }

  // Previous button
  const prevLi = document.createElement("li")
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`
  prevLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous">
      <i class="fas fa-chevron-left"></i>
    </a>
  `
  if (currentPage > 1) {
    prevLi.querySelector(".page-link").onclick = (e) => {
      e.preventDefault()
      currentPage--
      renderIngredients()
    }
  }
  paginationContainer.appendChild(prevLi)

  // Page numbers
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  // Adjust start page if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    const firstLi = document.createElement("li")
    firstLi.className = "page-item"
    firstLi.innerHTML = `<a class="page-link" href="#">1</a>`
    firstLi.querySelector(".page-link").onclick = (e) => {
      e.preventDefault()
      currentPage = 1
      renderIngredients()
    }
    paginationContainer.appendChild(firstLi)

    if (startPage > 2) {
      const ellipsisLi = document.createElement("li")
      ellipsisLi.className = "page-item disabled"
      ellipsisLi.innerHTML = `<span class="page-link">...</span>`
      paginationContainer.appendChild(ellipsisLi)
    }
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li")
    li.className = `page-item ${i === currentPage ? "active" : ""}`
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`

    if (i !== currentPage) {
      li.querySelector(".page-link").onclick = (e) => {
        e.preventDefault()
        currentPage = i
        renderIngredients()
      }
    }
    paginationContainer.appendChild(li)
  }

  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsisLi = document.createElement("li")
      ellipsisLi.className = "page-item disabled"
      ellipsisLi.innerHTML = `<span class="page-link">...</span>`
      paginationContainer.appendChild(ellipsisLi)
    }

    const lastLi = document.createElement("li")
    lastLi.className = "page-item"
    lastLi.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`
    lastLi.querySelector(".page-link").onclick = (e) => {
      e.preventDefault()
      currentPage = totalPages
      renderIngredients()
    }
    paginationContainer.appendChild(lastLi)
  }

  // Next button
  const nextLi = document.createElement("li")
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
  nextLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Next">
      <i class="fas fa-chevron-right"></i>
    </a>
  `
  if (currentPage < totalPages) {
    nextLi.querySelector(".page-link").onclick = (e) => {
      e.preventDefault()
      currentPage++
      renderIngredients()
    }
  }
  paginationContainer.appendChild(nextLi)
}

// Function to check if ingredient is used in recipes
function getRecipesUsingIngredient(ingredientId) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []
  return recipes.filter((recipe) => recipe.ingredients.some((ingredient) => ingredient.id === ingredientId))
}

// Function to render ingredient list with pagination
function renderIngredients() {
  const ingredientList = document.getElementById("ingredientList")

  // If there's no ingredients, show a message
  if (ingredients.length === 0) {
    ingredientList.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-shopping-basket" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
        <p class="text-muted">Belum ada bahan yang ditambahkan. Mulai dengan menambahkan bahan pertama Anda!</p>
      </div>
    `
    renderPaginationInfo()
    renderPagination()
    return
  }

  // Clear the list and render paginated ingredients
  ingredientList.innerHTML = ""

  const paginatedIngredients = getPaginatedIngredients()

  paginatedIngredients.forEach((ingredient, paginatedIndex) => {
    // Calculate the actual index in the full ingredients array
    const actualIndex = (currentPage - 1) * itemsPerPage + paginatedIndex

    // Use quantity if exists, otherwise default to 1
    const quantity = ingredient.quantity ? ingredient.quantity : 1

    const ingredientItem = document.createElement("div")
    ingredientItem.className = `ingredient-item ${ingredient.unavailable ? "unavailable" : ""}`

    ingredientItem.innerHTML = `
      <div class="ingredient-info">
        <div class="ingredient-name">
          <i class="fas fa-cube" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
          ${ingredient.name}
          ${ingredient.unavailable ? '<span class="badge-modern">Tidak Tersedia</span>' : ""}
        </div>
        <div class="ingredient-details">
          ${formatPrice(ingredient.price)} / ${quantity} ${ingredient.unit}
        </div>
      </div>
      <div class="ingredient-actions">
        <button class="modern-btn modern-btn-warning" style="padding: 0.5rem 1rem;" data-edit-index="${actualIndex}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="modern-btn modern-btn-danger" style="padding: 0.5rem 1rem;" data-delete-index="${actualIndex}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `

    // Add event listeners
    const editBtn = ingredientItem.querySelector("[data-edit-index]")
    const deleteBtn = ingredientItem.querySelector("[data-delete-index]")

    editBtn.addEventListener("click", () => openEditModal(actualIndex))
    deleteBtn.addEventListener("click", () => handleIngredientDeletion(actualIndex))

    ingredientList.appendChild(ingredientItem)
  })

  // Render pagination info and controls
  renderPaginationInfo()
  renderPagination()

  // Update ingredient select dropdown in recipe form
  const updateIngredientSelect = window.updateIngredientSelect
  if (typeof updateIngredientSelect === "function") {
    updateIngredientSelect()
  }
}

// Function to handle ingredient deletion with warning
function handleIngredientDeletion(index) {
  const ingredient = ingredients[index]
  const affectedRecipes = getRecipesUsingIngredient(ingredient.id)

  if (affectedRecipes.length > 0) {
    // Show warning modal
    showIngredientDeletionWarning(index, affectedRecipes)
  } else {
    // Safe to delete
    if (confirm("Apakah kamu yakin ingin menghapus bahan ini?")) {
      deleteIngredient(index)
    }
  }
}

// Function to show ingredient deletion warning modal
function showIngredientDeletionWarning(ingredientIndex, affectedRecipes) {
  const modalElement = document.getElementById("ingredientDeletionWarningModal")
  const modal = new window.bootstrap.Modal(modalElement)
  const affectedRecipesList = document.getElementById("affectedRecipesList")

  // Populate affected recipes list
  affectedRecipesList.innerHTML = '<div class="list-group">'
  affectedRecipes.forEach((recipe) => {
    affectedRecipesList.innerHTML += `<div class="list-group-item"><i class="fas fa-utensils"></i> ${recipe.name}</div>`
  })
  affectedRecipesList.innerHTML += "</div>"

  // Set up button handlers
  document.getElementById("markUnavailableBtn").onclick = () => {
    markIngredientUnavailable(ingredientIndex)
    modal.hide()
  }

  document.getElementById("forceDeleteBtn").onclick = () => {
    forceDeleteIngredient(ingredientIndex)
    modal.hide()
  }

  modal.show()
}

// Function to mark ingredient as unavailable
function markIngredientUnavailable(index) {
  ingredients[index].unavailable = true
  localStorage.setItem("ingredients", JSON.stringify(ingredients))

  // Update all recipes that use this ingredient
  updateRecipesWithUnavailableIngredient(ingredients[index].id)

  renderIngredients()

  // Re-render recipes if the function exists
  const renderRecipes = window.renderRecipes
  if (typeof renderRecipes === "function") {
    renderRecipes()
  }

  alert("Bahan telah ditandai sebagai tidak tersedia. Resep yang menggunakan bahan ini akan diperbarui.")
}

// Function to force delete ingredient
function forceDeleteIngredient(index) {
  const ingredientId = ingredients[index].id

  // Remove ingredient
  ingredients.splice(index, 1)
  localStorage.setItem("ingredients", JSON.stringify(ingredients))

  // Update recipes to remove this ingredient
  removeIngredientFromAllRecipes(ingredientId)

  // Adjust current page if necessary
  const totalPages = getTotalPages()
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages
  } else if (totalPages === 0) {
    currentPage = 1
  }

  renderIngredients()

  // Re-render recipes if the function exists
  const renderRecipes = window.renderRecipes
  if (typeof renderRecipes === "function") {
    renderRecipes()
  }

  alert("Bahan telah dihapus dan dihilangkan dari semua resep.")
}

// Function to update recipes with unavailable ingredient
function updateRecipesWithUnavailableIngredient(ingredientId) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.id === ingredientId) {
        ingredient.unavailable = true
      }
    })

    // Recalculate total cost excluding unavailable ingredients
    recipe.totalCost = recipe.ingredients
      .filter((ingredient) => !ingredient.unavailable)
      .reduce((total, ingredient) => {
        const costPerUnit = ingredient.price / ingredient.availableQuantity
        return total + costPerUnit * ingredient.usedQuantity
      }, 0)

    recipe.costPerServing = recipe.totalCost / recipe.servings
  })

  localStorage.setItem("recipes", JSON.stringify(recipes))
}

// Function to remove ingredient from all recipes
function removeIngredientFromAllRecipes(ingredientId) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []

  recipes.forEach((recipe) => {
    recipe.ingredients = recipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId)

    // Recalculate total cost
    recipe.totalCost = recipe.ingredients.reduce((total, ingredient) => {
      const costPerUnit = ingredient.price / ingredient.availableQuantity
      return total + costPerUnit * ingredient.usedQuantity
    }, 0)

    recipe.costPerServing = recipe.totalCost / recipe.servings
  })

  localStorage.setItem("recipes", JSON.stringify(recipes))
}

// Function to handle items per page change
function handleItemsPerPageChange() {
  const itemsPerPageSelect = document.getElementById("itemsPerPage")
  itemsPerPage = Number.parseInt(itemsPerPageSelect.value)
  currentPage = 1 // Reset to first page when changing items per page
  renderIngredients()
}

// Function to add new ingredient
function addIngredient(event) {
  event.preventDefault()
  const name = document.getElementById("ingredientName").value
  const price = Number.parseFloat(document.getElementById("ingredientPrice").value)
  const quantity = Number.parseFloat(document.getElementById("ingredientQuantity").value)
  const unit = document.getElementById("unitType").value

  // Validation checks
  if (quantity <= 0) {
    alert("Jumlah tidak boleh kurang dari atau sama dengan 0.")
    return
  }

  if (price < 100) {
    alert("Harga tidak boleh kurang dari  Rp100.")
    return
  }

  // Check if all fields are filled
  if (name && price && unit) {
    const newIngredient = { id: Date.now(), name, price, quantity, unit }
    ingredients.push(newIngredient)
    localStorage.setItem("ingredients", JSON.stringify(ingredients))

    // Go to the last page to show the newly added ingredient
    const totalPages = getTotalPages()
    currentPage = totalPages

    renderIngredients()
    document.getElementById("ingredientForm").reset()

    // Update recipe ingredient select if function exists
    const updateIngredientSelect = window.updateIngredientSelect
    if (typeof updateIngredientSelect === "function") {
      updateIngredientSelect()
    }
  }
}

// Function to delete an ingredient
function deleteIngredient(index) {
  ingredients.splice(index, 1)
  localStorage.setItem("ingredients", JSON.stringify(ingredients))

  // Adjust current page if necessary
  const totalPages = getTotalPages()
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages
  } else if (totalPages === 0) {
    currentPage = 1
  }

  renderIngredients()

  // Update recipe ingredient select if function exists
  const updateIngredientSelect = window.updateIngredientSelect
  if (typeof updateIngredientSelect === "function") {
    updateIngredientSelect()
  }
}

// Function to open edit modal and fill values
function openEditModal(index) {
  const ingredient = ingredients[index]
  document.getElementById("editIngredientIndex").value = index
  document.getElementById("editIngredientName").value = ingredient.name
  document.getElementById("editIngredientPrice").value = ingredient.price
  document.getElementById("editIngredientQuantity").value = ingredient.quantity
  document.getElementById("editUnitType").value = ingredient.unit
  const modalEl = document.getElementById("editIngredientModal")
  const modal = new window.bootstrap.Modal(modalEl)
  modal.show()
}

// Function to handle edit form submit
function handleEditIngredient(event) {
  event.preventDefault()
  const index = Number.parseInt(document.getElementById("editIngredientIndex").value, 10)
  const name = document.getElementById("editIngredientName").value
  const price = Number.parseFloat(document.getElementById("editIngredientPrice").value)
  const quantity = Number.parseFloat(document.getElementById("editIngredientQuantity").value)
  const unit = document.getElementById("editUnitType").value

  if (name && price && unit) {
    const oldIngredient = { ...ingredients[index] }

    ingredients[index].name = name
    ingredients[index].price = price
    ingredients[index].quantity = quantity
    ingredients[index].unit = unit
    localStorage.setItem("ingredients", JSON.stringify(ingredients))

    // Update recipes that use this ingredient
    updateRecipesWithIngredientChange(oldIngredient, ingredients[index])

    renderIngredients()

    // Re-render recipes if the function exists
    const renderRecipes = window.renderRecipes
    if (typeof renderRecipes === "function") {
      renderRecipes()
    }

    // Update recipe ingredient select if function exists
    const updateIngredientSelect = window.updateIngredientSelect
    if (typeof updateIngredientSelect === "function") {
      updateIngredientSelect()
    }

    // Hide modal
    const modalEl = document.getElementById("editIngredientModal")
    const modal = window.bootstrap.Modal.getInstance(modalEl)
    if (modal) {
      modal.hide()
    }
  }
}

// Function to update recipes when ingredient is changed
function updateRecipesWithIngredientChange(oldIngredient, newIngredient) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || []

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.id === oldIngredient.id) {
        ingredient.name = newIngredient.name
        ingredient.price = newIngredient.price
        ingredient.unit = newIngredient.unit
        ingredient.availableQuantity = newIngredient.quantity
      }
    })

    // Recalculate total cost
    recipe.totalCost = recipe.ingredients
      .filter((ingredient) => !ingredient.unavailable)
      .reduce((total, ingredient) => {
        const costPerUnit = ingredient.price / ingredient.availableQuantity
        return total + costPerUnit * ingredient.usedQuantity
      }, 0)

    recipe.costPerServing = recipe.totalCost / recipe.servings
  })

  localStorage.setItem("recipes", JSON.stringify(recipes))
}

// Event listeners
document.getElementById("ingredientForm").addEventListener("submit", addIngredient)
document.getElementById("editIngredientForm").addEventListener("submit", handleEditIngredient)

// Add event listener for items per page change
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("itemsPerPage").addEventListener("change", handleItemsPerPageChange)
})

// Initial rendering
renderIngredients()
