"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AdminLogin({ isOpen, onClose, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ADMIN_PASSWORD = "dede50anos";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      onLogin();
      onClose();
      setPassword("");
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao dashboard administrativo.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Por favor, verifique a senha e tente novamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 rounded-lg" />

        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
              <Lock className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              Acesso Administrativo
            </CardTitle>
          </div>

          <p className="text-white/80">
            Digite a senha para acessar o dashboard
          </p>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                className="text-yellow-400 font-semibold mb-2 block"
              >
                Senha de Administrador
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="bg-black/50 border-yellow-400/30 focus:border-yellow-400 text-white placeholder:text-gray-400 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 text-lg shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:shadow-yellow-400/50 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5" />
                  Entrar no Dashboard
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <p className="text-yellow-400 text-sm font-semibold mb-1">
              Senha de demonstração:
            </p>
            <p className="text-white/80 text-sm">dede50anos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
