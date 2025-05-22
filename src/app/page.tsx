"use client";

import {useState, useEffect, useRef} from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    Chart,
} from "chart.js";
import { Thermometer } from "lucide-react";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

type Temperatura = {
    timestamp: string;
    temp: number;
};

const filtros = {
    "1h": 1,
    "3h": 3,
    "12h": 12,
    "1d": 24,
    "7d": 24 * 7,
    "1m": 24 * 30,
};

export default function Home() {
    const [temperaturas, setTemperaturas] = useState<Temperatura[]>([]);
    const [ultimaTemp, setUltimaTemp] = useState<Temperatura | null>(null);
    const [filtro, setFiltro] = useState<keyof typeof filtros>("1h");
    const [contador, setContador] = useState(30);
    const chartRef = useRef<Chart<"line"> | null>(null);

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/temperatura`);
            const data = await res.json();
            setTemperaturas(data);
            if (data.length > 0) setUltimaTemp(data[data.length - 1]);
            setContador(30); // Resetar contador após carregar dados
        } catch (error) {
            console.error("Erro ao buscar temperaturas:", error);
        }
    };

    useEffect(() => {
        fetchTemperaturas();
        const intervalFetch = setInterval(fetchTemperaturas, 30000);

        const intervalContador = setInterval(() => {
            setContador((prev) => (prev > 0 ? prev - 1 : 30));
        }, 1000);

        return () => {
            clearInterval(intervalFetch);
            clearInterval(intervalContador);
        };
    }, []);

    const getTemperaturasFiltradas = () => {
        const agora = new Date().getTime();
        const limiteHoras = filtros[filtro] * 60 * 60 * 1000;
        return temperaturas.filter((t) => {
            const tTime = new Date(t.timestamp).getTime();
            return agora - tTime <= limiteHoras;
        });
    };

    const dataFiltrada = getTemperaturasFiltradas();

    const dataHistorico = {
        labels: dataFiltrada.map((t) =>
            formatarDataBR(new Date(t.timestamp))
        ),
        datasets: [
            {
                label: "Temperatura (°C)",
                data: dataFiltrada.map((t) => t.temp),
                borderColor: "rgba(75,192,192,1)",
                fill: false,
                tension: 0.3,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        scales: {
            y: { min: 0, max: 50 },
        },
        plugins: {
            legend: {
                labels: {
                    color: "#444",
                    font: { size: 14 },
                },
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x" as const,
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: "x" as const,
                },
                limits: {
                    x: { min: "original", max: "original" },
                    y: { min: 0, max: 50 },
                },
            },
        },
    };

    const getCorTemperatura = (temp: number) => {
        if (temp < 18) return "#3b82f6";
        if (temp > 22) return "#ef4444";
        return "#10b981";
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
                position: "relative",
            }}
        >
            {/* Contador no canto superior direito */}
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    color: "#505050",
                    padding: "6px 12px",
                    borderRadius: 12,
                    fontWeight: "bold",
                    fontSize: 14,
                    userSelect: "none",
                }}
                title="Segundos para próximo reload"
            >
                Atualizando em: {contador}s
            </div>

            <h1 style={{ fontSize: "2rem", marginBottom: 40, color: "#111827" }}>
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
                <h2 style={{ fontSize: "1.5rem", marginBottom: 20, color: "#374151" }}>
                    Temperatura Atual
                </h2>

                {ultimaTemp ? (
                    <div
                        style={{
                            display: "block",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <Thermometer size={48} color={getCorTemperatura(ultimaTemp.temp)} />
                        <span
                            style={{
                                fontSize: 48,
                                fontWeight: 600,
                                color: getCorTemperatura(ultimaTemp.temp),
                            }}
                        >
              {ultimaTemp.temp.toFixed(1)}°C
            </span>
                        <div style={{ fontSize: 48, fontWeight: 600, paddingTop: "1rem" }}></div>
                        <span style={{ color: "#333333" }}>
              {formatarDataBR(ultimaTemp.timestamp)}
            </span>
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
                <h2 style={{ fontSize: "1.5rem", marginBottom: 20, color: "#374151" }}>
                    Histórico de Temperaturas
                </h2>

                {/* Filtros */}
                <div
                    style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}
                >
                    {Object.keys(filtros).map((key) => (
                        <button
                            key={key}
                            onClick={() => setFiltro(key as keyof typeof filtros)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "none",
                                backgroundColor: filtro === key ? "#10b981" : "#e5e7eb",
                                color: filtro === key ? "white" : "#111827",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            {{
                                "1h": "Última hora",
                                "3h": "Últimas 3 horas",
                                "12h": "Últimas 12 horas",
                                "1d": "Hoje",
                                "7d": "Última semana",
                                "1m": "Último mês",
                            }[key as keyof typeof filtros]}
                        </button>
                    ))}
                </div>

                {dataFiltrada.length > 0 ? (
                    <Line ref={chartRef} data={dataHistorico} options={options} />
                ) : (
                    <p>Nenhum dado nesse período.</p>
                )}
            </div>
        </div>
    );
}
