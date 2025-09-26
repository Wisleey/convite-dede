// Script para testar a API de RSVP
console.log("🧪 Testando API de RSVP...");

const testData = {
  name: "Teste Usuario",
  email: "teste@email.com",
  phone: "83999999999",
  guests_count: 2,
  guest_names: ["Convidado 1"],
  message: "Teste de confirmação",
  will_attend: true,
};

fetch("http://localhost:3000/api/rsvp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testData),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log("✅ API funcionando corretamente!");
      console.log("📊 Dados salvos:", data.data);
    } else {
      console.log("❌ Erro na API:", data.error);
    }
  })
  .catch((error) => {
    console.log("❌ Erro de conexão:", error.message);
  });


