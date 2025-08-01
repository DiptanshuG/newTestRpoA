import { useState } from 'react';
import { 
  BarChart3, Users, Package, ShoppingCart, 
  MessageSquare, Settings, DollarSign, 
  ShoppingBag, UserCheck, Clock
} from 'lucide-react';
import Sellers from './Sellers';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <div className="w-64 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">MestoKart</h1>
        </div>
        <nav className="mt-2">
          <NavItem icon={<BarChart3 size={20} />} text="Dashboard" active />
          <NavItem icon={<Users size={20} />} text="Sellers" />
          <NavItem icon={<Package size={20} />} text="Products" />
          <NavItem icon={<ShoppingCart size={20} />} text="Orders" />
          <NavItem icon={<MessageSquare size={20} />} text="Support" />
          <NavItem icon={<Settings size={20} />} text="Settings" />
        </nav>
      </div> */}
<Sidebar></Sidebar>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">6</span>
                <span>🔔</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                AU
              </div>
              <div className="flex items-center">
                <span className="font-medium">Admin User</span>
                <span className="ml-1">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-6">
            <p className="text-gray-600">Welcome to the MestoKart admin dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Revenue" 
              value="$124,500" 
              description="Total revenue across all orders" 
              change="+12.5%" 
              positive={true}
              icon={<DollarSign size={20} className="text-blue-500" />}
            />
            <StatsCard 
              title="Total Orders" 
              value="1,248" 
              description="Total number of orders placed" 
              change="+8.2%" 
              positive={true}
              icon={<ShoppingBag size={20} className="text-blue-500" />}
            />
            <StatsCard 
              title="Active Sellers" 
              value="85" 
              description="Sellers currently active on the platform" 
              change="+3.1%" 
              positive={true}
              icon={<UserCheck size={20} className="text-blue-500" />}
            />
            <StatsCard 
              title="Pending Approvals" 
              value="12" 
              description="Sellers awaiting approval" 
              change="-2.5%" 
              positive={false}
              icon={<Clock size={20} className="text-blue-500" />}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-bold mb-1">Sales Overview</h2>
              <p className="text-gray-600 text-sm mb-4">Daily sales for the last 7 days</p>
              
              <div className="h-64">
                <SalesChart />
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-bold mb-1">Order Status</h2>
              <p className="text-gray-600 text-sm mb-4">Distribution of orders by status</p>
              
              <div className="flex justify-center items-center h-64">
                <OrderStatusChart />
              </div>
            </div>
           
          </div>
      
        </main>
      </div>
    </div>
  );
}



function StatsCard({ title, value, description, change, positive, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className={`mt-2 text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {change} from last month
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SalesChart() {
  const data = [
    { day: 'Thu', amount: 4000 },
    { day: 'Fri', amount: 4800 },
    { day: 'Sat', amount: 2900 },
    { day: 'Sun', amount: 4600 },
    { day: 'Mon', amount: 2800 },
    { day: 'Tue', amount: 5800 },
    { day: 'Wed', amount: 1200 },
  ];
  
  const maxValue = Math.max(...data.map(item => item.amount));
  
  return (
    <div className="relative h-full w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <div>$0</div>
        <div>$6000</div>
      </div>
      <div className="flex items-end h-56 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t" 
              style={{ height: `${(item.amount / 6000) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{item.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderStatusChart() {
  const statusData = [
    { status: 'Delivered', percentage: 75, color: 'text-green-500' },
    { status: 'Shipped', percentage: 11, color: 'text-purple-500' },
    { status: 'Processing', percentage: 7, color: 'text-blue-500' },
    { status: 'Pending', percentage: 4, color: 'text-yellow-500' },
    { status: 'Canceled', percentage: 3, color: 'text-red-500' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Create the donut chart segments */}
          {(() => {
            let startAngle = 0;
            return statusData.map((item, index) => {
              // Calculate the slice
              const angle = (item.percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              // Convert to radians for math functions
              const startAngleRad = (startAngle - 90) * Math.PI / 180;
              const endAngleRad = (startAngle + angle - 90) * Math.PI / 180;
              
              // Calculate coordinates
              const x1 = 50 + 40 * Math.cos(startAngleRad);
              const y1 = 50 + 40 * Math.sin(startAngleRad);
              const x2 = 50 + 40 * Math.cos(endAngleRad);
              const y2 = 50 + 40 * Math.sin(endAngleRad);
              
              // Construct path
              const pathData = `
                M 50 50
                L ${x1} ${y1}
                A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              // Get color class from tailwind
              let colorClass;
              switch(item.status) {
                case 'Delivered': colorClass = "#10b981"; break;
                case 'Shipped': colorClass = "#8b5cf6"; break;
                case 'Processing': colorClass = "#3b82f6"; break;
                case 'Pending': colorClass = "#f59e0b"; break;
                case 'Canceled': colorClass = "#ef4444"; break;
                default: colorClass = "#ccc";
              }
              
              const path = (
                <path
                  key={index}
                  d={pathData}
                  fill={colorClass}
                />
              );
              
              // Update the start angle for the next slice
              startAngle += angle;
              
              return path;
            });
          })()}
          {/* Add the center circle to make it a donut */}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 flex-wrap gap-3">
        {statusData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 rounded-sm mr-1 ${item.color.replace('text', 'bg')}`}></div>
            <span className={`text-sm ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}