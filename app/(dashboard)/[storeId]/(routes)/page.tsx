// In the /app directory


import { Separator } from '@/components/ui/separator';
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { getSalesCount } from '@/actions/get-sales-count'
import { getStockCount } from '@/actions/get-stock-count'
import { getOrderInfo } from '@/actions/get-order-info'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import { formatter } from '@/lib/utils';
import { getGraphRevenue } from '@/actions/get-graph-revenue';
import { Overview } from '@/components/ui/overview';

interface DashboardpageProps {
  params: Promise<{ storeId: string }>
}

const Dashboardpage: React.FC<DashboardpageProps> = async (props: DashboardpageProps) => {
  const params = await props.params;

  const totalRevenue = await getTotalRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const stockCount = await getStockCount(params.storeId)
  const graphRavenue = await getGraphRevenue(params.storeId)
  const orderinfo = await getOrderInfo(params.storeId)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <div className="flex-1 space-y-6 p-6 pt-6 md:p-8 md:pt-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your dashboard</p>
          </div>

          <Separator className="my-2" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1"> from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{salesCount}</div>
                <p className="text-xs text-muted-foreground mt-1">from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockCount}</div>
                <p className="text-xs text-muted-foreground mt-1">new products this week</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Revenue trends for the past 12 months</p>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="h-[350px] w-full">
                <Overview data={graphRavenue} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>

                {(!orderinfo || orderinfo.length === 0) && (
                  <p className="text-sm text-muted-foreground">No orders found.</p>
                )}


                <div className="space-y-4">
                  
                  {orderinfo.map((item, i) => {
                    let SubtotalOrderValue = 0; 
                    
                    return (
                      <div key={i} className="flex flex-col gap-4 border p-4 rounded-lg">
                        {item.orderItems.map((orderItem, j) => {
                          SubtotalOrderValue += orderItem.product.price 
                          return (
                            <div key={j} className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-muted" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{orderItem.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {orderItem.product.category.name}
                                </p>
                              </div>
                              <div className="text-sm font-medium">
                                {formatter.format(orderItem.product.price)}
                              </div>
                            </div>
                          );
                        })}
                        <div className="mt-4 text-sm font-medium">
                          Total: {formatter.format(SubtotalOrderValue)}
                        </div>
                      </div>
                    );
                  })}
                </div>





              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboardpage
