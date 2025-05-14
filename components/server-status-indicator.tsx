"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { API_URL } from "@/config";

export function ServerStatusIndicator() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        console.log('Checking server status at:', `${API_URL}/health`);
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          headers: { 
            'Cache-Control': 'no-cache', 
            'Pragma': 'no-cache',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Server response:', data);
        setStatus("connected");
        setErrorMessage(null);
      } catch (error) {
        console.error('Server status check failed:', error);
        setStatus("disconnected");
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
      
      setLastChecked(new Date());
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    connecting: {
      color: "bg-yellow-200 hover:bg-yellow-300 text-yellow-900",
      icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
      label: "Connecting..."
    },
    connected: {
      color: "bg-green-200 hover:bg-green-300 text-green-900",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      label: "Server Connected"
    },
    disconnected: {
      color: "bg-red-200 hover:bg-red-300 text-red-900",
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      label: "Server Disconnected"
    }
  };

  const config = statusConfig[status];
  const tooltipMessage = lastChecked 
    ? `Status: ${config.label} (Last checked: ${lastChecked.toLocaleTimeString()})${errorMessage ? `\nError: ${errorMessage}` : ''}`
    : `Status: ${config.label}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`transition-colors ${config.color} w-full justify-center`}>
            {config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="whitespace-pre-line">{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}