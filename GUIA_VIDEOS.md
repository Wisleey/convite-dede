# 🎥 Guia Completo para Adicionar Vídeos das Bandas

## 📋 Pré-requisitos

1. **Estrutura de Pastas**

   ```
   public/
   ├── videos/
   │   ├── banda1-preview.mp4
   │   ├── banda2-preview.mp4
   │   ├── banda1-preview.webm (opcional)
   │   └── banda2-preview.webm (opcional)
   └── images/
       ├── banda1-thumbnail.jpg
       └── banda2-thumbnail.jpg
   ```

2. **Especificações Recomendadas dos Vídeos**
   - **Duração**: 30-60 segundos (preview)
   - **Resolução**: 1280x720 (HD) ou 1920x1080 (Full HD)
   - **Formato**: MP4 (H.264) para compatibilidade máxima
   - **Tamanho**: Máximo 10MB por vídeo
   - **Aspect Ratio**: 16:9 (widescreen)

## 🛠️ Passo a Passo para Implementação

### 1. Adicionar useRef no Componente

No arquivo `components/birthday-invitation.tsx`, adicione no topo do componente:

```typescript
import { useState, useEffect, useRef } from "react";

export function BirthdayInvitation() {
  // Adicione estas linhas após os outros estados
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isVideo1Playing, setIsVideo1Playing] = useState(false);
  const [isVideo2Playing, setIsVideo2Playing] = useState(false);

  // ... resto do código
}
```

### 2. Substituir as Imagens por Vídeos

#### Vídeo 1 (Banda Principal)

Substitua esta seção:

```jsx
{
  /* ⚠️ SUBSTITUA ESTA IMAGEM PELO VÍDEO ⚠️ */
}
<img
  src="/images/birthday-invitation.png"
  alt="Banda Principal - Preview do Vídeo"
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>;
```

Por:

```jsx
<video
  ref={video1Ref}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  poster="/images/banda1-thumbnail.jpg"
  preload="metadata"
  muted
  playsInline
  onPlay={() => setIsVideo1Playing(true)}
  onPause={() => setIsVideo1Playing(false)}
  onEnded={() => setIsVideo1Playing(false)}
>
  <source src="/videos/banda1-preview.mp4" type="video/mp4" />
  <source src="/videos/banda1-preview.webm" type="video/webm" />
  Seu navegador não suporta vídeos HTML5.
</video>
```

#### Vídeo 2 (Atração Especial)

Substitua esta seção:

```jsx
{
  /* ⚠️ SUBSTITUA ESTA IMAGEM PELO VÍDEO ⚠️ */
}
<img
  src="/images/birthday-invitation.png"
  alt="Atração Especial - Preview do Vídeo"
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>;
```

Por:

```jsx
<video
  ref={video2Ref}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  poster="/images/banda2-thumbnail.jpg"
  preload="metadata"
  muted
  playsInline
  onPlay={() => setIsVideo2Playing(true)}
  onPause={() => setIsVideo2Playing(false)}
  onEnded={() => setIsVideo2Playing(false)}
>
  <source src="/videos/banda2-preview.mp4" type="video/mp4" />
  <source src="/videos/banda2-preview.webm" type="video/webm" />
  Seu navegador não suporta vídeos HTML5.
</video>
```

### 3. Conectar os Botões de Play/Pause

#### Botão do Vídeo 1

Substitua:

```jsx
onClick={() => {
  console.log("🎵 Play/Pause Vídeo Banda Principal");
}}
```

Por:

```jsx
onClick={() => {
  const video = video1Ref.current;
  if (video) {
    if (video.paused) {
      // Pausa outros vídeos antes de reproduzir
      if (video2Ref.current && !video2Ref.current.paused) {
        video2Ref.current.pause();
      }
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }
}}
```

#### Botão do Vídeo 2

Substitua:

```jsx
onClick={() => {
  console.log("🎤 Play/Pause Vídeo Atração Especial");
}}
```

Por:

```jsx
onClick={() => {
  const video = video2Ref.current;
  if (video) {
    if (video.paused) {
      // Pausa outros vídeos antes de reproduzir
      if (video1Ref.current && !video1Ref.current.paused) {
        video1Ref.current.pause();
      }
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }
}}
```

### 4. Atualizar os Ícones dos Botões

Para mostrar ícone de pause quando o vídeo estiver reproduzindo:

```jsx
// Para o botão 1
{
  isVideo1Playing ? (
    <Pause className="h-8 w-8 sm:h-12 sm:w-12" />
  ) : (
    <Play className="h-8 w-8 sm:h-12 sm:w-12 ml-1" />
  );
}

// Para o botão 2
{
  isVideo2Playing ? (
    <Pause className="h-8 w-8 sm:h-12 sm:w-12" />
  ) : (
    <Play className="h-8 w-8 sm:h-12 sm:w-12 ml-1" />
  );
}
```

Não esqueça de importar o ícone Pause:

```typescript
import {
  // ... outros ícones
  Play,
  Pause,
  // ... resto dos ícones
} from "lucide-react";
```

## 🎬 Dicas de Otimização

### 1. Compressão de Vídeo

Use ferramentas como FFmpeg para otimizar os vídeos:

```bash
# Comprimir vídeo mantendo qualidade
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k output.mp4

# Criar versão WebM (opcional)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### 2. Thumbnails Otimizados

Crie thumbnails atraentes dos vídeos:

- **Resolução**: 1280x720 pixels
- **Formato**: JPG (melhor compressão)
- **Qualidade**: 80-90%
- **Tamanho**: Máximo 200KB

### 3. Lazy Loading (Opcional)

Para melhor performance, você pode implementar lazy loading:

```jsx
<video
  ref={video1Ref}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  poster="/images/banda1-thumbnail.jpg"
  preload="none" // Carrega apenas quando necessário
  loading="lazy"
  // ... resto das props
>
```

## 🔧 Funcionalidades Avançadas (Opcionais)

### 1. Controles de Volume

```jsx
const [volume1, setVolume1] = useState(0.7);

// No vídeo
<video
  ref={video1Ref}
  volume={volume1}
  // ... outras props
>
```

### 2. Indicador de Progresso

```jsx
const [progress1, setProgress1] = useState(0);

// No vídeo
<video
  ref={video1Ref}
  onTimeUpdate={(e) => {
    const video = e.target as HTMLVideoElement;
    setProgress1((video.currentTime / video.duration) * 100);
  }}
  // ... outras props
>
```

### 3. Autoplay com Interação do Usuário

```jsx
const handleVideoInteraction = useCallback(() => {
  // Só permite autoplay após interação do usuário
  if (video1Ref.current) {
    video1Ref.current.muted = false; // Remove mute após interação
  }
}, []);
```

## ✅ Checklist Final

- [ ] Vídeos adicionados na pasta `public/videos/`
- [ ] Thumbnails criados na pasta `public/images/`
- [ ] useRef adicionados no componente
- [ ] Tags `<video>` substituindo as `<img>`
- [ ] Botões de play/pause conectados
- [ ] Estados de reprodução implementados
- [ ] Ícones de play/pause dinâmicos
- [ ] Testes realizados em diferentes navegadores
- [ ] Performance verificada (tamanho dos arquivos)

## 🚀 Resultado Final

Após implementar todas as modificações, você terá:

- ✨ Vídeos das bandas reproduzindo diretamente no convite
- 🎮 Controles intuitivos de play/pause
- 📱 Compatibilidade total com dispositivos móveis
- 🎯 Performance otimizada com lazy loading
- 🎨 Interface elegante e profissional
- 🔄 Sincronização entre vídeos (apenas um reproduz por vez)

## 📞 Suporte

Se encontrar algum problema durante a implementação:

1. Verifique o console do navegador para erros
2. Teste os caminhos dos arquivos de vídeo
3. Confirme que os formatos são suportados pelo navegador
4. Verifique as permissões de autoplay do navegador

---

🎉 **Parabéns!** Seu convite de aniversário agora tem vídeos das bandas totalmente funcionais!


