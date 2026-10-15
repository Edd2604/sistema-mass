import db from "@/lib/db";

export interface SalesPoint {
    date: string;
    ventas: number;
}

export async function getSalesChartData(): Promise<SalesPoint[]> {
    try {
        const filas = await db.$queryRaw<{ dia: Date; total: unknown }[]>`
            SELECT date_trunc('day', "created") AS dia,
                   SUM("totalPayment")          AS total
            FROM "Sale"
            WHERE "status" = 'Completada'
              AND "created" >= date_trunc('year', CURRENT_DATE)
            GROUP BY 1
            ORDER BY 1
        `;

        return filas.map((f) => ({
            date: f.dia.toISOString().split("T")[0],
            ventas: Number(f.total),
        }));
    } catch (error) {
        // Igual que con la fuente anterior: la gráfica se queda vacía, pero el
        // resto del panel sigue en pie.
        console.warn("[sales-chart] no se pudieron leer las ventas:", error);
        return [];
    }
}
