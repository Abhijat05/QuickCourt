import { useState } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { LineChart, BarChart, PieChart, FileText, Download, Calendar } from 'lucide-react';

export default function AdminReports() {
  const [reportType, setReportType] = useState('bookings');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics & Reports</h1>
          <p className="text-muted-foreground">View system performance metrics and generate reports</p>
        </div>
        <div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Card.Header className="pb-0">
              <div className="flex justify-between items-center">
                <Card.Title>System Overview</Card.Title>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    This Month
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="flex justify-center items-center py-16 border rounded-lg border-dashed">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chart data will be displayed here</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Bookings by Sport</Card.Title>
              </Card.Header>
              <Card.Content className="p-6">
                <div className="flex justify-center items-center py-12 border rounded-lg border-dashed">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Pie chart will be shown here</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
            
            <Card>
              <Card.Header>
                <Card.Title>Revenue Trends</Card.Title>
              </Card.Header>
              <Card.Content className="p-6">
                <div className="flex justify-center items-center py-12 border rounded-lg border-dashed">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Bar chart will be shown here</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Generate Reports</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="bookings">Bookings Report</option>
                  <option value="users">Users Report</option>
                  <option value="venues">Venues Report</option>
                  <option value="revenue">Revenue Report</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="p-2 border rounded-md bg-background" />
                  <input type="date" className="p-2 border rounded-md bg-background" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
              
              <Button className="w-full">Generate Report</Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Quick Stats</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                  <span className="text-sm">Total Bookings</span>
                  <span className="font-bold">3,427</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                  <span className="text-sm">Active Users</span>
                  <span className="font-bold">1,245</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                  <span className="text-sm">Total Revenue</span>
                  <span className="font-bold">₹843,290</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="font-bold">24.8%</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}