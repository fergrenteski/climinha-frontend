"use client";

import {useState, useEffect} from "react";
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {Thermometer} from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type Temperatura = {
    timestamp: string;
    temp: number;
};

export default function Home() {
    const [temperaturas, setTemperaturas] = useState<Temperatura[]>([]);
    const [ultimaTemp, setUltimaTemp] = useState<Temperatura | null>(null);

  function formatarDataBR(dataEntrada: string | Date): string {
    const data = new Date(dataEntrada);

    return data.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

    const fetchTemperaturas = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/temperatura");
            const data = await res.json();
            setTemperaturas(data);
            if (data.length > 0) setUltimaTemp(data[data.length - 1]);
        } catch (error) {
            console.error("Erro ao buscar temperaturas:", error);
        }
    };

    useEffect(() => {
        fetchTemperaturas();
        const interval = setInterval(fetchTemperaturas, 30000);
        return () => clearInterval(interval);
    }, []);

    const dataHistorico = {
        labels: temperaturas.map((t) =>
            new Date(t.timestamp).toLocaleTimeString()
        ),
        datasets: [
            {
                label: "Temperatura (°C)",
                data: temperaturas.map((t) => t.temp),
                borderColor: "rgba(75,192,192,1)",
                fill: false,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {min: 0, max: 50},
        },
        plugins: {
            legend: {
                labels: {
                    color: "#444",
                    font: {size: 14},
                },
            },
        },
    };

    const getCorTemperatura = (temp: number) => {
        if (temp < 18) return "#3b82f6"; // azul
        if (temp > 22) return "#ef4444"; // vermelho
        return "#10b981"; // verde
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f9fafb",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                fontFamily: "sans-serif",
            }}
        >
            <h1 style={{fontSize: "2rem", marginBottom: 40, color: "#111827"}}>
                Climinha
            </h1>

            {/* Card Temperatura Atual */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 16,
                    padding: "30px 40px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    marginBottom: 50,
                    textAlign: "center",
                    width: "100%",
                    maxWidth: 500,
                }}
            >
                <h2 style={{fontSize: "1.5rem", marginBottom: 20, color: "#374151"}}>
                    Temperatura Atual
                </h2>

                {ultimaTemp ? (
                    <div style={{display: "block", justifyContent: "center", alignItems: "center", gap: 16}}>
                        <Thermometer size={48} color={getCorTemperatura(ultimaTemp.temp)}/>
                        <span
                            style={{
                                fontSize: 48,
                                fontWeight: 600,
                                color: getCorTemperatura(ultimaTemp.temp),
                            }}
                        >
              {ultimaTemp.temp.toFixed(1)}°C
            </span>
                        <div
                            style={{
                                fontSize: 48,
                                fontWeight: 600,
                                paddingTop: '1rem'
                            }}
                        >
            </div>
                      <span style={{ color: "#333333" }}> {formatarDataBR(ultimaTemp.timestamp)}</span>
                    </div>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>

            {/* Card Gráfico Histórico */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 16,
                    padding: "30px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    width: "100%",
                    maxWidth: 800,
                }}
            >
                <h2 style={{fontSize: "1.5rem", marginBottom: 20, color: "#374151"}}>
                    Histórico de Temperaturas
                </h2>

                {temperaturas.length > 0 ? (
                    <Line data={dataHistorico} options={options}/>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </div>
    );
}
