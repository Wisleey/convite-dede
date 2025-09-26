// Script para limpar cache local em caso de problemas
// Execute no console do navegador se a contagem não estiver funcionando

console.log("🧹 Limpando cache do convite...");

// Remove dados antigos do localStorage
localStorage.removeItem("eventDate");
localStorage.removeItem("admin-session");

console.log("✅ Cache limpo com sucesso!");
console.log("🔄 Recarregue a página para ver as atualizações.");

// Força recarregamento da página
if (confirm("Deseja recarregar a página agora?")) {
  window.location.reload();
}


