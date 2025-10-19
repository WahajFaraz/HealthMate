import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft, FileText, Activity, Calendar } from "lucide-react";

interface TimelineItem {
  id: string;
  type: "report" | "vital";
  date: string;
  title?: string;
  reportType?: string;
  bloodPressure?: string;
  sugarLevel?: string;
  weight?: string;
}

const Timeline = () => {
  const navigate = useNavigate();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load both reports and vitals
    const reports = JSON.parse(localStorage.getItem("healthReports") || "[]");
    const vitals = JSON.parse(localStorage.getItem("healthVitals") || "[]");

    // Combine and sort by date
    const combined: TimelineItem[] = [
      ...reports.map((r: any) => ({ ...r, type: "report" as const })),
      ...vitals.map((v: any) => ({ ...v, type: "vital" as const }))
    ];

    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTimelineItems(combined);
  }, [navigate]);

  const groupByMonth = (items: TimelineItem[]) => {
    const grouped: { [key: string]: TimelineItem[] } = {};
    
    items.forEach(item => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(item);
    });

    return grouped;
  };

  const groupedItems = groupByMonth(timelineItems);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HealthMate</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold text-foreground mb-2">Health Timeline</h1>
            <p className="text-xl text-muted-foreground">
              Your complete health journey - Aapki puri sehat ki kahani
            </p>
          </div>

          {timelineItems.length === 0 ? (
            <Card className="p-12 text-center animate-fade-up">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Timeline Data</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading reports or adding vitals to see your timeline
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/upload">
                  <Button className="bg-gradient-to-r from-primary to-primary-glow">
                    Upload Report
                  </Button>
                </Link>
                <Link to="/add-vitals">
                  <Button variant="outline">
                    Add Vitals
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([monthYear, items], groupIndex) => (
                <div key={monthYear} className="animate-fade-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">{monthYear}</h2>
                  </div>

                  <div className="relative pl-8 border-l-2 border-border space-y-6">
                    {items.map((item, index) => (
                      <div key={item.id} className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[2.1rem] w-4 h-4 rounded-full border-2 border-background ${
                          item.type === "report" ? "bg-primary" : "bg-secondary"
                        }`}></div>

                        {item.type === "report" ? (
                          <Link to={`/view-report/${item.id}`}>
                            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(item.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">Type: {item.reportType}</p>
                                  <div className="mt-3">
                                    <Button size="sm" variant="outline">
                                      View Report & AI Analysis
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ) : (
                          <Card className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-secondary/10 rounded-lg">
                                <Activity className="h-6 w-6 text-secondary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-semibold text-foreground">Vital Signs Recorded</h3>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(item.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                  {item.bloodPressure && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                      <p className="font-medium text-foreground">{item.bloodPressure}</p>
                                    </div>
                                  )}
                                  {item.sugarLevel && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">Sugar Level</p>
                                      <p className="font-medium text-foreground">{item.sugarLevel}</p>
                                    </div>
                                  )}
                                  {item.weight && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">Weight</p>
                                      <p className="font-medium text-foreground">{item.weight}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;