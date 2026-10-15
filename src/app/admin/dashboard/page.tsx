import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Suspense } from "react";
import LinearChart from "@/components/charts/LinearChart";
import { getSalesChartData } from "@/lib/get-sales-chart";
import HalfYearSalesChart from "@/components/charts/HalfYearSalesChart";
import CustomerGrowthChart from "@/components/charts/CustomersGrowthChart";
import LastSales from "@/components/dashboard/LastSales";
import TopCustomers from "@/components/dashboard/TopCustomers";
import { CustomersRegistered, TotalExpenses, TotalProfit, TotalSales } from "@/components/dashboard/DashboardCards";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function Page({ searchParams }: {searchParams: { ticker?: string }}) {
	const session =await getServerSession(authOptions)


	const datosVentas = getSalesChartData();
	return (
		<>
			<section className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				<TotalProfit/>
				<CustomersRegistered/>
				<TotalSales/>
				<TotalExpenses/>
			</section>

			<section className="relative w-full space-y-5">
				<Card>
					<CardHeader>
						<CardTitle>
							Ventas del año
						</CardTitle>
						<CardDescription>
							Importe cobrado por día, sin contar ventas pendientes ni canceladas
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Suspense>
							<LinearChart chartData={datosVentas} ticker="" />
						</Suspense>
					</CardContent>
				</Card>
        	</section>

			<section className="relative w-full flex gap-5 max-lg:flex-col">
				<Card className="w-full lg:w-[55%]">
					<CardHeader>
						<CardTitle>
							Grafica de Ventas Realizadas
						</CardTitle>

					</CardHeader>
					<CardContent>
						<Suspense>
							<HalfYearSalesChart/>
						</Suspense>
					</CardContent>
					<CardFooter>
						Ultimos 6 meses
					</CardFooter>
				</Card>

				<Card className="w-full lg:w-[45%]">
					<CardHeader>
						<CardTitle>
							Ultimas Ventas Realizadas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Suspense>
							<LastSales/>
						</Suspense>
					</CardContent>
					<CardFooter>
						Ultimos 6 meses
					</CardFooter>
				</Card>
			</section>

			<section className="w-full relative flex gap-5 max-lg:flex-col">
				<Card className="w-full lg:w-[40%]">
					<CardHeader>
						<CardTitle>
							Los Mejores Clientes
						</CardTitle>

					</CardHeader>
					<CardContent>
						<Suspense>
							<TopCustomers/>
						</Suspense>
					</CardContent>
					<CardFooter>
						Ultimos 6 meses
					</CardFooter>
				</Card>

				<Card className="w-full lg:w-[60%]">
					<CardHeader>
						<CardTitle>
							Crecimiento de clientes registrados
						</CardTitle>

					</CardHeader>
					<CardContent>
						<Suspense>
							<CustomerGrowthChart/>
						</Suspense>
					</CardContent>
					<CardFooter>
						Ultimos 6 meses
					</CardFooter>
				</Card>
			</section>

		</>
	);
}
