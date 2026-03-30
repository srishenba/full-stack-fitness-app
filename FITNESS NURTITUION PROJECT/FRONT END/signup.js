const form = document.getElementById("signupForm");

function togglePassword(fieldId, eyeId){
  const field = document.getElementById(fieldId);
  const eye = document.getElementById(eyeId);

  if(field.type === "password"){
    field.type = "text";
    eye.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    field.type = "password";
    eye.classList.replace("bi-eye-slash", "bi-eye");
  }
}

form.addEventListener("submit", async function(e){
  e.preventDefault();

  let isValid = true;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  // Simple validation
  if(name.value.trim() === ""){
    alert("Name is required");
    isValid = false;
  }

  if(email.value.trim() === ""){
    alert("Email is required");
    isValid = false;
  }

  if(password.value.length < 6){
    alert("Password must be at least 6 characters");
    isValid = false;
  }

  if(confirmPassword.value !== password.value){
    alert("Passwords do not match");
    isValid = false;
  }

  if(isValid){

    try{
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: name.value,
          email: email.value,
          password: password.value
        })
      });

      const data = await response.json();
      alert(data.message);

      window.location.href = "details.html";

    }catch(error){
      alert("Error registering user");
      console.log(error);
    }
  }


});