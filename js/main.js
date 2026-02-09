// main.js

// resaltar secciones en pantalla (navBar horizontal)
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: "-64px 0px -80px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;

      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${id}`
        );
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ----------------------

// expandir menú hamburguesa y ocultar al seleccionar link
const toggleButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

toggleButton.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Cerrar menú al hacer click en un link
document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

// ======================
// FORM CONTROLLER
// ======================

function validateForm(data) {
  const errors = [];

  if (!data.nombre.trim()) {
    errors.push({
      field: "nombre",
      message: "El nombre es obligatorio"
    });
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,}$/.test(data.nombre.trim())) {
    errors.push({
      field: "nombre",
      message: "prueba un nombre mas largo, solo letras y espacios"
    });
  }


  if (!data.mensaje.trim()) {
    errors.push({ field: "mensaje", message: "El mensaje es obligatorio" });
  }

  if (!data.email.trim() && !data.telefono.trim()) {
    errors.push({
      field: "email",
      message: "Debes ingresar un email o un teléfono"
    });
    errors.push({
      field: "telefono",
      message: "Debes ingresar un email o un teléfono"
    });
  }

  if (data.email.trim() && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push({
      field: "email",
      message: "El email no tiene un formato válido"
    });
  }

  if (data.telefono.trim() && !/^[0-9+\s()-]{7,}$/.test(data.telefono)) {
    errors.push({
      field: "telefono",
      message: "El teléfono no tiene un formato válido"
    });
  }

  return errors;
}

// ======================
// FORM BINDING (temporal)
// ======================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");

  // submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(form);

    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      telefono: form.telefono.value,
      mensaje: form.mensaje.value
    };

    const errors = validateForm(data);

    if (errors.length > 0) {
      showErrors(form, errors);
      return;
    }

    const submitBtn = form.querySelector(".btn-submit");
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Mensaje enviado correctamente 👍");
        form.reset();
      } else {
        alert("Hubo un error al enviar el mensaje");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }

    submitBtn.disabled = false;

  });

  // ✨ UX fina: limpiar errores mientras se tipea
  form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
      const errorEl = form.querySelector(`[data-error-for="${input.name}"]`);
      if (errorEl) errorEl.textContent = "";
      input.closest(".form-field")?.classList.remove("error");
    });
  });
});

function clearErrors(form) {
  form.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
  form.querySelectorAll(".form-field").forEach(el => el.classList.remove("error"));
}

function showErrors(form, errors) {
  errors.forEach(err => {
    const field = err.field;
    const msg = err.message;

    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.closest(".form-field")?.classList.add("error");
    }
  });
}


