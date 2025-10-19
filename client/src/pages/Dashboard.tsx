import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Upload,
  Plus,
  FileText,
  Activity,
  Calendar,
  TrendingUp,
  LogOut,
  User,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { reportsApi, healthApi, authApi } from "@/lib/api";

interface DashboardStats {
  totalReports: number;
  totalVitals: number;
  lastCheckup: string;
  healthScore: number;
}

interface RecentReport {
  id: string;
  title: string;
  type: string;
  date: string;
  description?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    totalVitals: 0,
    lastCheckup: "No data",
    healthScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Check authentication
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        const token = localStorage.getItem("token");

        if (!isAuthenticated || !token) {
          navigate("/login");
          return;
        }

        // Load user profile
        try {
          const profile = await authApi.getProfile();
          setUserName(profile.username || profile.name || "User");
          setUserEmail(profile.email || "");
        } catch (profileError) {
          console.error("Failed to load profile:", profileError);
          // Fallback to localStorage
          const name = localStorage.getItem("userName") || "User";
          setUserName(name);
        }

        // Load dashboard stats
        try {
          const dashboardStats = await healthApi.getDashboardStats();
          setStats(dashboardStats);
        } catch (statsError) {
          console.error("Failed to load dashboard stats:", statsError);
        }

        // Load recent reports
        try {
          const reports = await reportsApi.getReports(4);
          setRecentReports(reports.map((report: any) => ({
            id: report.id || report._id,
            title: report.title || "Untitled Report",
            type: report.type || "Medical Report",
            date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Unknown",
            description: report.description
          })));
        } catch (reportsError) {
          console.error("Failed to load reports:", reportsError);
          setRecentReports([]);
        }

      } catch (error: any) {
        console.error("Dashboard load error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Total Reports",
      value: stats.totalReports,
      icon: <FileText className="h-5 w-5" />,
      color: "text-primary"
    },
    {
      label: "Vitals Tracked",
      value: stats.totalVitals,
      icon: <Activity className="h-5 w-5" />,
      color: "text-secondary"
    },
    {
      label: "Last Check-up",
      value: stats.lastCheckup,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-accent"
    },
    {
      label: "Health Score",
      value: stats.healthScore > 0 ? `${stats.healthScore}%` : "Calculating...",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HealthMate</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">{userName}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your health journey with real-time insights
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link to="/upload">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-fade-up">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Upload Report</h3>
                  <p className="text-muted-foreground">Add new medical report or prescription</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/add-vitals">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Add Vitals</h3>
                  <p className="text-muted-foreground">Record BP, Sugar, Weight manually</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="p-6 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`${stat.color}`}>{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Reports</h2>
            <Link to="/timeline">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Reports Yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first medical report to get started
              </p>
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-primary to-primary-glow">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Report
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recentReports.map((report, index) => (
                <Link key={report.id || index} to={`/view-report/${report.id}`}>
                  <Card className="p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                        <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Link to="/timeline">
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Timeline View</h3>
              <p className="text-sm text-muted-foreground mt-1">View your health history</p>
            </Card>
          </Link>

          <Link to="/add-vitals">
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center">
              <Activity className="h-8 w-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Track Vitals</h3>
              <p className="text-sm text-muted-foreground mt-1">Monitor your health metrics</p>
            </Card>
          </Link>

          <Link to="/upload">
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center">
              <Upload className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Upload Reports</h3>
              <p className="text-sm text-muted-foreground mt-1">Add new documents</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;