import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  ArrowRight,
  Activity,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-r-transparent"></div></div>;

  const pieData = [
    { name: "To Do", value: stats?.todoTasks || 0, color: "#ec4899" }, // pink-500
    { name: "In Progress", value: stats?.inProgressTasks || 0, color: "#f97316" }, // orange-500
    { name: "Done", value: stats?.doneTasks || 0, color: "#10b981" }, // emerald-500
  ].filter(d => d.value > 0);

  // Mocking bar data since backend /dashboard/stats only returns recent tasks and totals
  // Ideally, this data would come from the backend grouping tasks by project
  const generateBarData = () => {
    if (!stats?.recentTasks) return [];
    const projectMap = {};
    stats.recentTasks.forEach(t => {
      const pName = t.project?.name || "Unknown";
      if (!projectMap[pName]) projectMap[pName] = 0;
      projectMap[pName]++;
    });
    return Object.keys(projectMap).map(k => ({
      name: k.length > 10 ? k.substring(0, 10) + '...' : k,
      tasks: projectMap[k]
    }));
  };
  
  const barData = generateBarData();

  return (
    <div className="space-y-10 p-4 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back. Here is your productivity snapshot.</p>
        </div>
        {isAdmin && (
          <Link to="/projects" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 px-6 py-3 rounded-2xl font-bold text-white shadow-xl shadow-pink-500/20 transition-all hover:-translate-y-1">
            <Plus className="h-5 w-5" />
            Create Project
          </Link>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<AlertCircle className="text-pink-500 h-6 w-6" />} 
          label="Pending Tasks" 
          value={stats?.todoTasks || 0} 
          color="bg-pink-100" 
        />
        <StatCard 
          icon={<Activity className="text-orange-500 h-6 w-6" />} 
          label="In Progress" 
          value={stats?.inProgressTasks || 0} 
          color="bg-orange-100" 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-500 h-6 w-6" />} 
          label="Completed" 
          value={stats?.doneTasks || 0} 
          color="bg-emerald-100" 
        />
        <StatCard 
          icon={<Layers className="text-indigo-500 h-6 w-6" />} 
          label="Total Projects" 
          value={stats?.projectsCount || 0} 
          color="bg-indigo-100" 
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="glass-panel p-6 rounded-3xl border border-white/60">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Task Distribution</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 font-medium">No tasks to display</div>
            )}
          </div>
          {pieData.length > 0 && (
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/60">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity by Project</h2>
          <div className="h-[300px] w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">No activity to display</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {/* Recent Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Recent Activity Log</h2>
            <Link to="/projects" className="text-indigo-600 font-bold hover:text-indigo-500 text-sm flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/60">
            {stats?.recentTasks?.length > 0 ? (
              <div className="divide-y divide-slate-100/50">
                {stats.recentTasks.map((task) => (
                  <div key={task._id} className="p-5 flex items-center justify-between hover:bg-white/40 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{task.title}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">{task.project?.name}</p>
                    </div>
                    <span className={`text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                      task.status === "DONE" ? "bg-emerald-100 text-emerald-700" :
                      task.status === "IN_PROGRESS" ? "bg-orange-100 text-orange-700" :
                      "bg-pink-100 text-pink-700"
                    }`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-500 font-medium">
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-slate-300" />
                </div>
                No activity found. Time to start working!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/60"
  >
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${color} shadow-inner shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-800">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;
