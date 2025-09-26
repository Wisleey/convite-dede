"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  Download,
  Trash2,
  Search,
  Mail,
  Phone,
  MessageCircle,
  TrendingUp,
  Clock,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RSVPData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  guestsCount: number;
  guestNames?: string[];
  message?: string;
  willAttend: boolean;
  createdAt: string;
}

interface RSVPStats {
  totalRSVPs: number;
  totalGuests: number;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([]);
  const [stats, setStats] = useState<RSVPStats>({
    totalRSVPs: 0,
    totalGuests: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRSVP, setSelectedRSVP] = useState<RSVPData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/rsvp");
      const result = await response.json();

      if (result.success) {
        setRsvpData(result.data || []);
        setStats(result.stats || { totalRSVPs: 0, totalGuests: 0 });
      } else {
        throw new Error(result.error || "Erro ao carregar dados");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do RSVP:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados das confirmações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/rsvp/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadData(); // Recarrega os dados
        toast({
          title: "Confirmação removida",
          description: "A confirmação foi removida com sucesso.",
        });
      } else {
        throw new Error("Erro ao remover confirmação");
      }
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a confirmação.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // Organiza todos os nomes em ordem alfabética
    const allNames: string[] = [];

    // Ordena os RSVPs por nome alfabeticamente
    const sortedRsvpData = [...rsvpData].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR")
    );

    // Para cada RSVP, adiciona o nome principal e depois os convidados
    sortedRsvpData.forEach((rsvp) => {
      // Adiciona o nome principal
      allNames.push(rsvp.name);

      // Adiciona os nomes dos convidados em ordem alfabética
      if (Array.isArray(rsvp.guestNames) && rsvp.guestNames.length > 0) {
        const sortedGuestNames = [...rsvp.guestNames].sort((a, b) =>
          a.localeCompare(b, "pt-BR")
        );
        allNames.push(...sortedGuestNames);
      }
    });

    // Cria o CSV apenas com os nomes, um por linha
    const csvHeaders = "Nome\n";
    const csvData = allNames.map((name) => `"${name}"`).join("\n");
    const fullCsvData = csvHeaders + csvData;

    const blob = new Blob([fullCsvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `confirmacoes-aniversario-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Dados exportados",
      description:
        "Os dados foram exportados para um arquivo CSV com nomes em ordem alfabética.",
    });
  };

  const filteredData = rsvpData.filter(
    (rsvp) =>
      rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rsvp.email &&
        rsvp.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[55] overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-full md:max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2">
                Dashboard Administrativo
              </h1>
              <p className="text-white/80 text-lg">
                Gerencie as confirmações do seu aniversário
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                    <Users className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold">
                      Total de Confirmações
                    </p>
                    <p className="text-3xl font-black text-white">
                      {stats.totalRSVPs}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                    <TrendingUp className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold">
                      Total de Convidados
                    </p>
                    <p className="text-3xl font-black text-white">
                      {stats.totalGuests}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold">
                      Última Atualização
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {rsvpData.length > 0
                        ? new Date(rsvpData[0].createdAt).toLocaleString(
                            "pt-BR"
                          )
                        : "Nenhuma"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-yellow-400/30 focus:border-yellow-400 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
                  disabled={rsvpData.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RSVP List */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Confirmações Recebidas ({filteredData.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-yellow-400/50 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">
                    {searchTerm
                      ? "Nenhuma confirmação encontrada"
                      : "Nenhuma confirmação recebida ainda"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredData.map((rsvp) => (
                    <Card
                      key={rsvp.id}
                      className="bg-black/40 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Button
                                onClick={() => setSelectedRSVP(rsvp)}
                                variant="ghost"
                                size="sm"
                                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                              >
                                Ver Detalhes
                              </Button>
                              <Button
                                onClick={() => handleDelete(rsvp.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-white">
                                {rsvp.name}
                              </h3>
                              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
                                {rsvp.guestsCount}{" "}
                                {rsvp.guestsCount === 1 ? "pessoa" : "pessoas"}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              {rsvp.email && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Mail className="h-4 w-4 text-yellow-400" />
                                  <span>{rsvp.email}</span>
                                </div>
                              )}
                              {rsvp.phone && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Phone className="h-4 w-4 text-yellow-400" />
                                  <span>{rsvp.phone}</span>
                                </div>
                              )}
                            </div>

                            {rsvp.message && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageCircle className="h-4 w-4 text-yellow-400" />
                                  <span className="text-yellow-400 font-semibold">
                                    Mensagem:
                                  </span>
                                </div>
                                <p className="text-white/80 bg-black/30 p-3 rounded-lg border border-yellow-400/20">
                                  {rsvp.message}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Confirmado em:{" "}
                                {new Date(rsvp.createdAt).toLocaleString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RSVP Detail Modal */}
      {selectedRSVP && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-yellow-400/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  Detalhes da Confirmação
                </CardTitle>
                <Button
                  onClick={() => setSelectedRSVP(null)}
                  variant="ghost"
                  size="icon"
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-yellow-400 font-semibold">Nome:</label>
                <p className="text-white text-lg">{selectedRSVP.name}</p>
              </div>
              {selectedRSVP.email && (
                <div>
                  <label className="text-yellow-400 font-semibold">
                    Email:
                  </label>
                  <p className="text-white">{selectedRSVP.email}</p>
                </div>
              )}
              {selectedRSVP.phone && (
                <div>
                  <label className="text-yellow-400 font-semibold">
                    Telefone:
                  </label>
                  <p className="text-white">{selectedRSVP.phone}</p>
                </div>
              )}
              <div>
                <label className="text-yellow-400 font-semibold">
                  Convidados:
                </label>
                <p className="text-white">
                  {selectedRSVP.guestsCount}{" "}
                  {selectedRSVP.guestsCount === 1 ? "pessoa" : "pessoas"}
                </p>
              </div>
              {selectedRSVP.guestNames &&
                selectedRSVP.guestNames.length > 0 && (
                  <div>
                    <label className="text-yellow-400 font-semibold">
                      Nomes dos Convidados:
                    </label>
                    <ul className="text-white mt-2">
                      {selectedRSVP.guestNames.map((name, index) => (
                        <li key={index} className="ml-4">
                          • {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {selectedRSVP.message && (
                <div>
                  <label className="text-yellow-400 font-semibold">
                    Mensagem:
                  </label>
                  <p className="text-white bg-black/30 p-3 rounded-lg border border-yellow-400/20 mt-2">
                    {selectedRSVP.message}
                  </p>
                </div>
              )}
              <div>
                <label className="text-yellow-400 font-semibold">
                  Data de Confirmação:
                </label>
                <p className="text-white">
                  {new Date(selectedRSVP.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
