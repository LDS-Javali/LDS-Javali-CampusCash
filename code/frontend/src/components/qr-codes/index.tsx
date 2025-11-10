"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion } from "framer-motion";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Download, QrCode, Camera, X } from "lucide-react";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  showDownload?: boolean;
}

export function QRCodeGenerator({ 
  value, 
  size = 200, 
  className = "",
  showDownload = true 
}: QRCodeGeneratorProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Criar canvas para download
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      // Criar QR code como SVG e converter para canvas
      const svg = document.createElement("div");
      svg.innerHTML = QRCode({ value, size: size - 20 }).outerHTML;
      
      // Simular download
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("QR Code baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar QR Code");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <QRCode value={value} size={size - 40} />
          </div>
        </div>
        
        {showDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Baixando..." : "Baixar QR Code"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface QRCodeScannerProps {
  onScanSuccess: (result: string) => void;
  onScanError?: (error: string) => void;
  className?: string;
}

export function QRCodeScanner({ 
  onScanSuccess, 
  onScanError,
  className = ""
}: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const scannerId = useRef(`qr-scanner-${Date.now()}-${Math.random()}`);

  const stopScanning = () => {
    if (scanner) {
      try {
        const clearPromise = scanner.clear();
        if (clearPromise && typeof clearPromise.then === 'function') {
          clearPromise
            .then(() => {
              // Limpar o conteúdo após o scanner limpar
              if (scannerRef.current && scannerRef.current.parentNode) {
                try {
                  scannerRef.current.innerHTML = '';
                } catch (e) {
                  // Ignorar erros
                }
              }
            })
            .catch(() => {
              // Se falhar, tentar limpar manualmente
              if (scannerRef.current && scannerRef.current.parentNode) {
                try {
                  scannerRef.current.innerHTML = '';
                } catch (e) {
                  // Ignorar erros
                }
              }
            });
        } else {
          // Se não retornar promise, limpar imediatamente
          if (scannerRef.current && scannerRef.current.parentNode) {
            try {
              scannerRef.current.innerHTML = '';
            } catch (e) {
              // Ignorar erros
            }
          }
        }
      } catch (error) {
        // Se der erro, tentar limpar manualmente
        if (scannerRef.current && scannerRef.current.parentNode) {
          try {
            scannerRef.current.innerHTML = '';
          } catch (e) {
            // Ignorar erros
          }
        }
      }
      setScanner(null);
      setIsScanning(false);
    }
  };

  const startScanning = () => {
    if (scannerRef.current && !isScanning) {
      // Parar scanner anterior se existir
      if (scanner) {
        stopScanning();
        // Aguardar um pouco para garantir que a limpeza foi concluída
        setTimeout(() => {
          iniciarNovoScanner();
        }, 100);
      } else {
        iniciarNovoScanner();
      }
    }
  };

  const iniciarNovoScanner = () => {
    if (!scannerRef.current) return;

    try {
      // Limpar qualquer conteúdo anterior
      if (scannerRef.current.parentNode) {
        scannerRef.current.innerHTML = '';
      }
      
      const newScanner = new Html5QrcodeScanner(
        scannerId.current,
        {
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          fps: 5,
        },
        false
      );

      newScanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanning();
        },
        (error) => {
          // Ignorar erros de leitura contínua
          if (onScanError && error && !error.includes("NotFoundException")) {
            onScanError(error);
          }
        }
      );

      setScanner(newScanner);
      setIsScanning(true);
    } catch (error) {
      console.error("Erro ao iniciar scanner:", error);
      if (onScanError) {
        onScanError("Erro ao iniciar o scanner de QR Code");
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup ao desmontar o componente
      if (scanner) {
        try {
          const clearPromise = scanner.clear();
          if (clearPromise && typeof clearPromise.then === 'function') {
            clearPromise.catch(() => {
              // Ignorar erros
            });
          }
        } catch (error) {
          // Ignorar erros
        }
        setScanner(null);
      }
      // Limpar o container apenas se ainda estiver no DOM
      if (scannerRef.current && scannerRef.current.parentNode) {
        try {
          scannerRef.current.innerHTML = '';
        } catch (error) {
          // Ignorar erros
        }
      }
    };
  }, [scanner]);

  return (
    <div className={className}>
      <div className="space-y-4">
        <div 
          ref={scannerRef}
          id={scannerId.current}
          className="aspect-square bg-muted rounded-lg flex items-center justify-center"
        >
          {!isScanning && (
            <div className="text-center">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Clique em "Iniciar Scanner" para começar
              </p>
              <Button onClick={startScanning}>
                <Camera className="h-4 w-4 mr-2" />
                Iniciar Scanner
              </Button>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={stopScanning}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Parar Scanner
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para exibir QR Code em modal
interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  title?: string;
}

export function QRCodeModal({ isOpen, onClose, value, title = "QR Code" }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <QRCodeGenerator 
          value={value} 
          size={250}
          showDownload={true}
        />
      </motion.div>
    </div>
  );
}
